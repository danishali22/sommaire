import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    fullName?: string;
    customerId: string;
    priceId: string;
    status: 'active' | 'cancelled' | 'trial' | string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
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
            required: true,
        },
        priceId: {
            type: String,
            required: true,
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
