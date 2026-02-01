import {Schema, model, Document, Types} from 'mongoose';

export interface IProperty extends Document {
    title: string;
    description: string;
    village?: string;
    adress: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        coordinates?: {
            type: 'Point';
            coordinates: [number, number]; // [lng, lat]
        };
        price: {
            amount: number;
            period: 'monthly' | 'yearly' ;
        };
        propertyType: 'apartment' | 'house' | 'studio' ;
        amenities: string[];
        ownerID: Types.ObjectId;
        isAvailable: boolean;
        isVerified: boolean;
    }
};

const propertySchema = new Schema<IProperty>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    village: { type: String },
    adress: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: { type: [Number], index: '2dsphere' }, // [lng, lat]
        },
        price: {
            amount: { type: Number, required: true },
            period: { type: String, enum: ['monthly', 'yearly'], required: true },
        },
        propertyType: { type: String, enum: ['apartment', 'house', 'studio'], required: true },
        amenities: [{ type: String }],
        ownerID: { type: Schema.Types.ObjectId, required: true },
        isAvailable: { type: Boolean, required: true },
        isVerified: { type: Boolean, required: true },
    }
}, { timestamps: true });
const Property = model<IProperty>('Property', propertySchema);
export default Property;
