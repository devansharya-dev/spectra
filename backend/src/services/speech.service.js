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

import { Readable, PassThrough } from 'stream';

// ... imports (keep existing imports)

// BUNDLED BINARY PATH (Relative to backend/src/services/)
// We need to go up two levels: services -> src -> backend
const bundledFfmpegPath = path.join(__dirname, '../../bin/ffmpeg');

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

  try {
    // 1. Setup Streams (No Disk I/O)
    const inputStream = new Readable();
    inputStream.push(audioBuffer);
    inputStream.push(null); // Signal end of data

    const pushStream = sdk.AudioInputStream.createPushStream();
    
    // 2. Setup Azure Recognizer
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = "en-US";
    
    const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // 3. Start Transcoding Pipe
    const transcodingProcess = ffmpeg(inputStream)
      .toFormat("wav")
      .audioChannels(1)
      .audioFrequency(16000)
      .on("error", (err) => {
          console.error(`[FFmpeg] Transcoding Error using ${selectedPath}:`, err);
          // We can't easily reject the main promise from here if recognition is already running,
          // but closing the push stream might trigger a cancellation.
          pushStream.close(); 
      });

    // Create a pass-through stream to pipe FFmpeg output to Azure
    const passThrough = new PassThrough();
    
    transcodingProcess.pipe(passThrough);

    passThrough.on('data', (chunk) => {
        pushStream.write(chunk);
    });

    passThrough.on('end', () => {
        pushStream.close();
    });

    // 4. Start Recognition (Concurrent with transcoding)
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
  }
};
