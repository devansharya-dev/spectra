import { speechToText } from "../services/speech.service.js";
import { translateText } from "../services/translation.service.js";

export const processAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file provided" });
  }

  try {
    // 1. Convert Speech to Text
    const transcript = await speechToText(req.file.buffer);
    
    // 2. Translate Text (Defaulting to Spanish for this demo)
    let translation = "";
    if (transcript && !transcript.startsWith("Mock") && !transcript.startsWith("No speech")) {
        translation = await translateText(transcript, "es");
    } else {
        translation = "Waiting for valid speech...";
    }

    res.json({
      transcript,
      translation,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error("Audio Processing Error:", error);
    res.status(500).json({ error: "Failed to process audio" });
  }
};