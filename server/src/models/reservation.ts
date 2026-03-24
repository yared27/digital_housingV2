import { Document, Schema, Types, model } from 'mongoose';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'declined';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface IReservation extends Document {
    renterId: Types.ObjectId;
    ownerId: Types.ObjectId;
    propertyId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: ReservationStatus;
    paymentStatus: PaymentStatus;
    message?: string;
    createdAt: Date;
    updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
    {
        renterId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
            index: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (this: IReservation, value: Date) {
                    return this.startDate ? value > this.startDate : true;
                },
                message: 'endDate must be greater than startDate',
            },
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed', 'declined'],
            required: true,
            default: 'pending',
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            required: true,
            default: 'pending',
        },
        message: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
    },
    { timestamps: true }
);

reservationSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });
reservationSchema.index({ renterId: 1 });
reservationSchema.index({ ownerId: 1 });
reservationSchema.index({ status: 1 });

const Reservation = model<IReservation>('Reservation', reservationSchema);
export default Reservation;
