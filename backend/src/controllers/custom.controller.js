import axios from "axios";

export async function runCustomInference(req, res) {
  try {
    const yoloUrl = process.env.YOLO_API_URL;
    const yoloKey = process.env.YOLO_API_KEY;

    if (!yoloUrl) {
      console.warn("YOLO_API_URL not set");
      return res.json({
        label: "Mock YOLO",
        result: "Backend received image but YOLO_API_URL is missing.",
        message: "Please set YOLO_API_URL in backend .env file.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Use Node.js native FormData (available in Node 18+)
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append("file", blob, "capture.jpg");

    // Prepare headers
    const headers = {};
    if (yoloKey) {
      headers["Authorization"] = `Bearer ${yoloKey}`;
      headers["X-API-Key"] = yoloKey; // Send as both just in case
    }

    // Call the external YOLO service
    const response = await fetch(`${yoloUrl}/detect`, {
      method: "POST",
      body: formData,
      headers: headers,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`YOLO API responded with ${response.status}: ${errText}`);
    }

    const data = await response.json();

    // Format response for the frontend
    // YOLO API returns: { "detections": [...], "counts": {...} }
    // Frontend expects: { "result": "...", "label": "...", "message": "..." }

    const topDetection = data.detections?.[0];
    const label = topDetection ? topDetection.class : "Nothing detected";
    const confidence = topDetection ? Math.round(topDetection.confidence * 100) + "%" : "";
    
    // Construct a summary string
    const summary = data.counts 
      ? Object.entries(data.counts).map(([k, v]) => `${v} ${k}`).join(", ") 
      : label;

    res.json({
      label: label,
      result: `${label} ${confidence}`,
      message: `Detected: ${summary}`,
      raw: data
    });

  } catch (error) {
    console.error("Custom Model Error:", error.message);
    res.status(500).json({ 
      error: "Custom model inference failed",
      details: error.message
    });
  }
}