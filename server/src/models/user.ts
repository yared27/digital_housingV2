import { Schema, model, Document,Types } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
        phone?: string;
        dateOfBirth?: string;
    address?: {
        country?: string;
        city?: string;
        postalCode?: string;
    };
    role: 'renter'|'owner'|'admin';
    isAccountVerified: boolean;
    googleId?: string;
    avatar?: string;
    rating?: number;
    reports?: Types.ObjectId[];
    password?: string;
    isUserIdentityVerified?: boolean;
}

const userSchema = new Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
        phone: { type: String },
        dateOfBirth: { type: String },
    address: {
        country: { type: String },
        city: { type: String },
        postalCode: { type: String },
    },
    role: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
    isAccountVerified: { type: Boolean, default: false },
    googleId: { type: String },
    avatar: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    password: { type: String },
    isUserIdentityVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = model<IUser>('User', userSchema);
export default User;