import { IPdfSummary, PdfSummary } from "@/models/PdfSummary";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";

// Get all summaries for a user
export async function getSummaries(clerkUserId: string) {
    try {
        await connectToDatabase();
        const summaries = await PdfSummary.find({ clerkUserId })
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
        const res = await fetch(`/api/summary/${id}`, {
            method: "GET",// Optional: avoid caching
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error("Failed to fetch summary");
        }

        return await res.json();
    } catch (error) {
        console.error("❌ Error fetching summary by ID:", error);
        return null;
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
