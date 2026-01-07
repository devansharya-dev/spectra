import { callModel } from "../services/model.service.js";

export async function runInference(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  try {
    const result = await callModel(req.file.buffer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Model inference failed" });
  }
}
