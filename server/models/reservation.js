import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
});

// Index for fast retrieval of reservations by user and property
reservationSchema.index({ user: 1, property: 1, startDate: 1 });

export const Reservation = mongoose.model("Reservation", reservationSchema);
