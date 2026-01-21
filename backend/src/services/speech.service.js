import sdk from "microsoft-cognitiveservices-speech-sdk";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

import sdk from "microsoft-cognitiveservices-speech-sdk";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

// 🔍 RESOLVE FFMPEG PATH
let validFfmpegPath = null;

// 1. Determine OS
const platform = os.platform(); // 'win32', 'linux', 'darwin'
const arch = os.arch();

console.log(`[FFmpeg] Server OS: ${platform} (${arch})`);
console.log(`[FFmpeg] CWD: ${process.cwd()}`);

// 2. Define candidates based on OS
const candidates = [];

if (platform === "win32") {
    candidates.push(
        path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
        path.join(process.cwd(), "..", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
        ffmpegPath // Fallback to package default
    );
} else {
    // Linux/Mac (Azure uses Linux)
    candidates.push(
        path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
        "/home/site/wwwroot/node_modules/ffmpeg-static/ffmpeg", // Absolute Azure path
        ffmpegPath // Fallback
    );
}

// 3. Find first existing candidate
for (const p of candidates) {
    if (p && fs.existsSync(p)) {
        validFfmpegPath = p;
        console.log(`[FFmpeg] ✅ Found binary at: ${p}`);
        break;
    }
}

// 4. Critical Fallback for Azure:
// If we are on Linux but didn't find the binary, it might mean we are running a Windows-deployed node_modules.
// We will try to force the Linux path anyway, hoping it might be there but hidden or we missed it,
// OR we error out with a very clear message.
if (!validFfmpegPath && platform === "linux") {
    console.warn("[FFmpeg] ⚠️ Binary not found. Forcing Azure default path...");
    validFfmpegPath = "/home/site/wwwroot/node_modules/ffmpeg-static/ffmpeg";
}

if (validFfmpegPath) {
    ffmpeg.setFfmpegPath(validFfmpegPath);
} else {
    console.error("[FFmpeg] ❌ CRITICAL: Could not locate ffmpeg binary!");
}

/**
 * Converts audio buffer to text using Azure Speech SDK
 * @param {Buffer} audioBuffer - Incoming audio buffer (likely WebM/Ogg)
 * @returns {Promise<string>} - Transcribed text
 */
export const speechToText = async (audioBuffer) => {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    console.warn("Azure Speech credentials missing. Returning mock transcript.");
    return "Mock transcript: Azure Speech credentials are not configured.";
  }

  const tempInput = path.join(os.tmpdir(), `${uuidv4()}.webm`);
  const tempOutput = path.join(os.tmpdir(), `${uuidv4()}.wav`);

  try {
    // 1. Write buffer to temp file
    await fs.promises.writeFile(tempInput, audioBuffer);

    // 2. Transcode to PCM WAV (16kHz, 16-bit, Mono)
    await new Promise((resolve, reject) => {
      ffmpeg(tempInput)
        .toFormat("wav")
        .audioChannels(1)
        .audioFrequency(16000)
        .on("end", resolve)
        .on("error", (err) => {
            let debugInfo = `FFmpeg Error: ${err.message}. Path used: ${validFfmpegPath}`;
            reject(new Error(debugInfo));
        })
        .save(tempOutput);
    });

    // 3. Read the clean WAV file
    const wavBuffer = await fs.promises.readFile(tempOutput);

    // 4. Send to Azure Speech SDK
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = "en-US";

    const pushStream = sdk.AudioInputStream.createPushStream();
    pushStream.write(wavBuffer);
    pushStream.close();

    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    const transcript = await new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (result) => {
          recognizer.close();
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            resolve(result.text);
          } else if (result.reason === sdk.ResultReason.NoMatch) {
            resolve("No speech recognized.");
          } else {
            reject(new Error(`Speech Recognition Canceled: ${result.errorDetails}`));
          }
        },
        (err) => {
          recognizer.close();
          console.error("Speech SDK Error:", err);
          reject(err);
        }
      );
    });

    return transcript;

  } catch (error) {
    console.error("Transcoding/Speech Error:", error);
    throw error;
  } finally {
    // 5. Cleanup
    try {
      if (fs.existsSync(tempInput)) await fs.promises.unlink(tempInput);
      if (fs.existsSync(tempOutput)) await fs.promises.unlink(tempOutput);
    } catch (cleanupErr) {
      console.warn("Cleanup failed:", cleanupErr);
    }
  }
};
