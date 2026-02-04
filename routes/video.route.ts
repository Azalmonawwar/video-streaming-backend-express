// routes/video.routes.js
import express from "express";
import { protect } from "../middleware/auth.middleware.ts";
import {
  getUploadPresignedUrl,
  saveVideoMetadata,
  getVideoPresignedUrl,
} from "../controllers/video.controller.js";

const router = express.Router();

router.post("/upload-url", protect, getUploadPresignedUrl);
router.post("/save", protect, saveVideoMetadata);
router.get("/:id/stream", protect, getVideoPresignedUrl);

export default router;
