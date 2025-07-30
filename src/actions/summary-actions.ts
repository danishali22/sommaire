"use server";

import { connectToDatabase } from "@/lib/db";
import { PdfSummary } from "@/models/PdfSummary";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction(summaryId: string) {
    try {
        await connectToDatabase();

        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            return {
                success: false,
                message: "Unauthorized: User not found",
            };
        }

        const result = await PdfSummary.deleteOne({
            _id: summaryId,
            userId: userId,
        });

        if (result.deletedCount > 0) {
            revalidatePath("/dashboard");
            return {
                success: true,
                message: "Summary deleted successfully.",
            };
        }

        return {
            success: false,
            message: "Summary not found or you do not have permission to delete it.",
        };
    } catch (error) {
        console.error("❌ Error deleting summary:", error);
        return {
            success: false,
            error: "Failed to delete summary",
        };
    }
}
