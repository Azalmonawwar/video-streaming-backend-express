// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    videoUrl: {
      type: String,
      required: true, // CDN / S3 / Cloudinary URL
    },

    thumbnailUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // in seconds
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    privacy: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
