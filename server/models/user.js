import e from 'express';
import monogoose from 'mongoose';

export const userSchema = new monogoose.Schema({
    first_name:
        { type: String, required: true },
    last_name:
        { type: String, required: true },   
    email:
        { type: String, required: true, unique: true },
    phone_number:
        { type: String, required: true, unique: true },
    hash_Password:
        { type: String, required: true },
    role:
        { type: String, enum: ['user', 'admin'], default: 'user' },
    rating:
        { type: Number, default: 0 },
    report:
        { type: Number, default: 0 },
    isVerified:
        { type: Boolean, default: false },
    isEmailVerified:
        { type: Boolean, default: false },
    createdAt:
        { type: Date, default: Date.now },
    
})

userSchema.index({ email: 1, phone_number: 1 }, { unique: true });
userSchema.index({role: 1, isVerified: 1});
userSchema.index({ createdAt: -1 });
userSchema.index({ rating: -1 });

export const User = monogoose.model('User', userSchema);