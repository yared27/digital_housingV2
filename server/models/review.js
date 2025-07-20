import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 👇 dynamic reference
  targetModel: { type: String, required: true, enum: ["User", "Property"] },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "targetModel",
  },

  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index for fast retrieval
reviewSchema.index({ user: 1, target: 1 });

export const Review = mongoose.model("Review", reviewSchema);
