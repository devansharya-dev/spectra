import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { runInference } from "../controllers/inference.controller.js";

const router = Router();

router.post("/", upload.single("image"), runInference);

export default router;
