"use server"

import { getDBConnection } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction(summaryId: string) {
    try {
        const sql = await getDBConnection();
        const user = await currentUser();
        const userId = user?.id;
        const result = await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId} AND user_id = ${userId}`;

        if(result.length > 0) {
            revalidatePath('/dashboard');
            return { success: true, message: "Summary deleted successfully." };
        }
        return { success: false, message: "Summary not found or you do not have permission to delete it." };
    } catch (error) {
        console.error("Error deleting summary:", error);
        return { success: false, error: "Failed to delete summary" };
    }
}