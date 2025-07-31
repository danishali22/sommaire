import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PdfSummary, IPdfSummary } from "@/models/PdfSummary";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const summary = await PdfSummary.findById(id).lean() as IPdfSummary | null;

        if (!summary) {
            return new Response(JSON.stringify({ error: "Summary not found" }), {
                status: 404,
            });
        }

        const wordCount = summary.summary?.split(/\s+/).length || 0;

        return new Response(
            JSON.stringify({
                ...summary,
                word_count: wordCount,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Failed to fetch summary:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
