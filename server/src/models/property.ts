import { Schema, model, Document, Types } from 'mongoose';

export type PropertyPricePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type PropertyType = 'apartment' | 'house' | 'room' | 'studio';

export interface IPropertyAddress {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
    coordinates?: {
        type: 'Point';
        coordinates: [number, number];
    };
}

export interface IPropertyPrice {
    amount: number;
    period: PropertyPricePeriod;
}

export interface IProperty extends Document {
    title: string;
    description: string;
    village: string;
    address: IPropertyAddress;
    price: IPropertyPrice;
    propertyType: PropertyType;
    amenities: string[];
    propertyImages: string[];
    ownerId: Types.ObjectId;
    isAvailable: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        village: { type: String, required: true, trim: true, index: true },
        address: {
            street: { type: String, trim: true },
            city: { type: String, required: true, trim: true },
            state: { type: String, required: true, trim: true },
            zipCode: { type: String, trim: true },
            coordinates: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point',
                },
                coordinates: {
                    type: [Number],
                    validate: {
                        validator: (value: number[]) => value.length === 2,
                        message: 'Coordinates must contain [lng, lat].',
                    },
                },
            },
        },
        price: {
            amount: { type: Number, required: true, min: 0 },
            period: {
                type: String,
                enum: ['daily', 'weekly', 'monthly', 'yearly'],
                required: true,
            },
        },
        propertyType: {
            type: String,
            enum: ['apartment', 'house', 'room', 'studio'],
            required: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        propertyImages: {
            type: [String],
            default: [],
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
            index: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

propertySchema.index({ 'address.city': 1 });
propertySchema.index({ 'address.state': 1 });
propertySchema.index({ 'price.amount': 1 });
propertySchema.index({ village: 1, 'address.city': 1, 'address.state': 1 });
propertySchema.index({ 'address.coordinates': '2dsphere' });

const Property = model<IProperty>('Property', propertySchema);
export default Property;
