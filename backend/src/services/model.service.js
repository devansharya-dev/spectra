import axios from "axios";

export async function callModel(imageBuffer) {
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;

  // Fallback to mock if no keys provided (for development without Azure)
  if (!endpoint || !key) {
    console.warn("Azure credentials not found. Using mock response.");
    await new Promise((r) => setTimeout(r, 500));
    return {
      label: "Mock Person",
      confidence: 0.92,
      message: "Azure keys missing - returning mock result",
      timestamp: Date.now(),
    };
  }

  try {
    // Switch to v3.2 API which is supported in 'centralindia'
    // This uses 'visualFeatures' instead of 'features'
    const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Description`;
    
    const response = await axios.post(url, imageBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": key,
      },
    });

    const analysis = response.data;
    const caption = analysis.description?.captions?.[0]?.text || "No caption generated";
    const confidence = analysis.description?.captions?.[0]?.confidence || 0.0;
    
    // v3.2 "Read" (OCR) is a separate call usually, but let's stick to Description for now 
    // to ensure the main feature works in this region.
    
    return {
      label: caption,
      confidence: confidence,
      message: "Scene analyzed (v3.2)",
      raw: analysis,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error("Azure Inference Error:", error.response?.data || error.message);
    throw new Error("Azure inference failed");
  }
}
