import sdk from "microsoft-cognitiveservices-speech-sdk";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BUNDLED BINARY PATH (Relative to this file)
const bundledFfmpegPath = path.join(__dirname, '../bin/ffmpeg');

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

  // 🛠️ DETERMINISTIC PATH SELECTION
  let selectedPath = ffmpegPath; // Default (works on Windows dev)

  if (os.platform() === 'linux') {
      // On Azure Linux, use the binary we manually bundled
      if (fs.existsSync(bundledFfmpegPath)) {
          console.log(`[FFmpeg] Using bundled Linux binary: ${bundledFfmpegPath}`);
          selectedPath = bundledFfmpegPath;
          
          // Ensure it's executable
          try {
            fs.chmodSync(selectedPath, 0o755);
          } catch (e) { /* ignore */ }
      } else {
          console.error(`[FFmpeg] ❌ Bundled binary missing at ${bundledFfmpegPath}`);
          // Fallback to trying the standard path fix just in case
          if (selectedPath && selectedPath.startsWith('/node_modules')) {
             selectedPath = '/home/site/wwwroot' + selectedPath;
          }
      }
  }

  ffmpeg.setFfmpegPath(selectedPath);

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
            console.error(`[FFmpeg] Transcoding Error using ${selectedPath}:`, err);
            reject(err);
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
