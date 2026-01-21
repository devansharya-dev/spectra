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

// 🔍 DEBUG: Extensive Path Resolution & Logging
let validFfmpegPath = ffmpegPath;
const searchPaths = [
    ffmpegPath, // Original export
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    path.join(process.cwd(), "..", "node_modules", "ffmpeg-static", "ffmpeg"),
    // Azure sometimes puts it here
    "/home/site/wwwroot/node_modules/ffmpeg-static/ffmpeg" 
];

// Try to find a valid path
let found = false;
for (const p of searchPaths) {
    if (p && fs.existsSync(p)) {
        validFfmpegPath = p;
        found = true;
        console.log(`[FFmpeg] ✅ Found binary at: ${p}`);
        break;
    }
}

if (!found) {
    console.error("[FFmpeg] ❌ CRITICAL: Binary not found in any candidate path.");
    console.error(`[FFmpeg] CWD: ${process.cwd()}`);
    // We will attempt to use the default and let it fail, but we'll capture the fs state in the error later
} else {
    ffmpeg.setFfmpegPath(validFfmpegPath);
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
            // 🔍 ENHANCED ERROR DEBUGGING
            let debugInfo = `FFmpeg Error: ${err.message}. `;
            
            try {
                // List contents of node_modules/ffmpeg-static to see if binary is there
                const staticDir = path.join(process.cwd(), "node_modules", "ffmpeg-static");
                if (fs.existsSync(staticDir)) {
                    const files = fs.readdirSync(staticDir);
                    debugInfo += ` [Contents of ${staticDir}: ${files.join(", ")}]`;
                } else {
                    debugInfo += ` [Dir ${staticDir} does not exist]`;
                }
                
                // List root node_modules just in case
                const nmDir = path.join(process.cwd(), "node_modules");
                if (fs.existsSync(nmDir)) {
                     // Just check if ffmpeg-static exists
                     const hasStatic = fs.existsSync(path.join(nmDir, "ffmpeg-static"));
                     debugInfo += ` [node_modules exists. Has ffmpeg-static? ${hasStatic}]`;
                } else {
                    debugInfo += ` [node_modules at ${nmDir} NOT FOUND]`;
                }

                debugInfo += ` [CWD: ${process.cwd()}]`;
                debugInfo += ` [Attempted Path: ${validFfmpegPath}]`;
            } catch (fsErr) {
                debugInfo += ` [FS Debug Error: ${fsErr.message}]`;
            }

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
