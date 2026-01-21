import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { runCustomInference } from "../controllers/custom.controller.js";

const router = Router();

// Endpoint: POST /api/custom/infer
router.post("/infer", upload.single("image"), runCustomInference);

export default router;