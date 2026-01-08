import express from "express";
import cors from "cors";
import inferenceRoutes from "./routes/inference.routes.js";
import audioRoutes from "./routes/audio.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 REQUIRED for Azure health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "augen-backend alive" });
});

app.use("/api/infer", inferenceRoutes);
app.use("/api/audio", audioRoutes);

export default app;
