import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PdfSummary } from "@/models/PdfSummary";

export async function POST(req: NextRequest) {
    try {

        await connectToDatabase();

        const { userId, fileUrl, summary, title, fileName } = await req.json();

        const savedSummary = await PdfSummary.create({
            userId,
            originalFileUrl: fileUrl,
            summary,
            title,
            fileName,
        });

        return NextResponse.json({
            success: true,
            status: 201,
            message: "PDF summary stored successfully",
            data: { id: savedSummary.id },
        });
    } catch (error: any) {
        console.error("PDF summary API error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error", data: null },
            { status: 500 }
        );
    }
}
