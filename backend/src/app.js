import express from "express";
import cors from "cors";
import inferenceRoutes from "./routes/inference.routes.js";
import audioRoutes from "./routes/audio.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/infer", inferenceRoutes);
app.use("/api/audio", audioRoutes);

export default app;
