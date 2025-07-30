import { Schema, model, models, Document, Types } from 'mongoose';

export interface IPdfSummary extends Document {
    userId: Types.ObjectId | string;
    title: string;
    summary: string;
    originalFileUrl: string;
    status: 'active' | 'archived' | 'deleted';
    fileName: string;
    createdAt: Date;
    updatedAt: Date;
}

const PdfSummarySchema = new Schema<IPdfSummary>(
    {
        userId: {
            type: Schema.Types.Mixed,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        summary: {
            type: String,
            required: true,
        },
        originalFileUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'archived', 'deleted'],
            default: 'active',
        },
        fileName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const PdfSummary = models?.PdfSummary || model<IPdfSummary>('PdfSummary', PdfSummarySchema);
