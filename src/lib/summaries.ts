import { IPdfSummary, PdfSummary } from "@/models/PdfSummary";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";

// Get all summaries for a user
export async function getSummaries(userId: string) {
    try {
        await connectToDatabase();
        const summaries = await PdfSummary.find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .lean();
        return summaries;
    } catch (error) {
        console.error("Error fetching summaries:", error);
        throw error;
    }
}

// Get summary by ID with word count
export async function getSumaryById(id: string) {
    try {
        await connectToDatabase();
        const pdfSummary = await PdfSummary.findById(id).lean() as IPdfSummary | null;

        if (!pdfSummary) return null;

        const wordCount = pdfSummary.summary?.split(/\s+/).length || 0;

        return {
            ...pdfSummary,
            word_count: wordCount,
        };
    } catch (error) {
        console.error("Failed to fetch summary:", error);
        throw error;
    }
}

// Get total uploads for a user
export const getUserUploadCount = async (userId: string) => {
    try {
        await connectToDatabase();
        const count = await PdfSummary.countDocuments({ userId: new Types.ObjectId(userId) });
        return count;
    } catch (error) {
        console.error("Error fetching user upload count:", error);
        return 0;
    }
};
