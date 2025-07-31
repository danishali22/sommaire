import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { PdfSummary } from "@/models/PdfSummary";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        await connectToDatabase();

        const summaries = await PdfSummary.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            summaries,
        });
    } catch (err) {
        console.error("Dashboard API Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
