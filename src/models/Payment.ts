import { Schema, model, models, Document } from 'mongoose';

export interface IPayment extends Document {
    amount: number;
    status: string;
    stripePaymentId: string;
    priceId: string;
    userEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
    {
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        stripePaymentId: {
            type: String,
            required: true,
        },
        priceId: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = models?.Payment || model<IPayment>('Payment', PaymentSchema);
