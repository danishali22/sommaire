import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { PdfSummary } from "@/models/PdfSummary";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const appUser = await User.findOne({ clerkUserId: userId });
        if (!appUser?.hasActivePlan) {
            return NextResponse.json(
                { success: false, message: "Upgrade required" },
                { status: 403 }
            );
        }

        const { fileUrl, summary, title, fileName } = await req.json();

        const savedSummary = await PdfSummary.create({
            userId,
            originalFileUrl: fileUrl,
            summary,
            title,
            fileName,
        });

        return NextResponse.json({
            success: true,
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
