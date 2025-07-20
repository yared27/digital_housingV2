import mongoose from "mongoose";

const callSessionSchema = new mongoose.Schema({
  caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ["ongoing", "completed", "missed"], default: "ongoing" },
});

// Index for fast retrieval of ongoing calls
callSessionSchema.index({ caller: 1, receiver: 1, status: 1 });

export const CallSession = mongoose.model("CallSession", callSessionSchema);
