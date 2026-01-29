// models/Playlist.js
import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);
export default Playlist;
