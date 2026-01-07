import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { processAudio } from "../controllers/audio.controller.js";

const router = express.Router();

// Route to handle audio processing (STT + Translation)
router.post("/process", upload.single("audio"), processAudio);

export default router;