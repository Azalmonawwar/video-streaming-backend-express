// controllers/video.controller.js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/aws.ts";
import Video from "../db/models/video.model.ts";
import { isSubscribed } from "../utils/isSubscribe.ts";
import { getStreamingUrl } from "../utils/cloudfront.ts";

export const getUploadPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: "File info missing" });
    }

    const s3Key = `videos/${req.user._id}/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 minutes
    });

    res.json({
      uploadUrl,
      s3Key,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({ message: "Could not generate upload URL" });
  }
};

export const saveVideoMetadata = async (req, res) => {
  try {
    const { title, description, s3Key } = req.body;

    const video = await Video.create({
      title,
      description,
      s3Key,
      owner: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    console.error("Error saving video metadata:", error);
    res.status(500).json({ message: "Could not save video metadata" });
  }
};

export const getVideoPresignedUrl = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("owner")
      .select("-password");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const allowed = await isSubscribed(req.user._id, video.owner._id);

    if (!allowed) {
      return res.status(403).json({
        message: "Subscribe to watch this video",
      });
    }

    const url = getStreamingUrl(video.s3Key);

    res.json({ url });
  } catch (error) {
    console.error("Error getting video URL:", error);
    res.status(500).json({ message: "Could not get video URL" });
  }
};
