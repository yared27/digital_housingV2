import { Schema, model, Document,Types } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    role: 'renter'|'owner'|'admin';
    isVerified: boolean;
    googleId?: string;
    avatar?: string;
    rating?: number;
    reports?: Types.ObjectId[];
    password?: string;
}

const userSchema = new Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
    isVerified: { type: Boolean, default: false },
    googleId: { type: String },
    avatar: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    password: { type: String },
}, { timestamps: true });

const User = model<IUser>('User', userSchema);
export default User;