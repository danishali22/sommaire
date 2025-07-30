import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
    clerkUserId?: string;
    email: string;
    fullName?: string;
    customerId: string;
    priceId: string;
    app: 'clerk' | 'stripe';
    status: 'active' | 'cancelled' | 'trial' | string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        clerkUserId: {
            type: String,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        customerId: {
            type: String,
            trim: true,
        },
        priceId: {
            type: String,
            trim: true,
        },
        app: {
            type: String,
            enum: ['clerk', 'stripe'],
            default: 'clerk',
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'trial'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

export const User = models.User || model<IUser>('User', UserSchema);
