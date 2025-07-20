import mongoose from "mongoose";

export const propertySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    village: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 , min : 0,  max : 5  },
    images : [{ type: String, required: true }],
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

propertySchema.index({ owner: 1, title: 1 }, { unique: true });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ price: 1 });
propertySchema.index({ rating: -1 });

export const Property = mongoose.model('Property', propertySchema);
