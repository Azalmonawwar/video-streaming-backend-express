// models/WatchHistory.js
import mongoose from "mongoose";

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },

  watchedAt: {
    type: Date,
    default: Date.now,
  },

  progress: {
    type: Number, // seconds watched
    default: 0,
  },
});

const WatchHistory =
  mongoose.models.WatchHistory ||
  mongoose.model("WatchHistory", watchHistorySchema);
export default WatchHistory;
