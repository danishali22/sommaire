import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { IUser, User } from "@/models/User";
import { PdfSummary } from "@/models/PdfSummary";
import { pricingPlans } from "@/lib/constants";

const PRO_LIMIT = 1000;
const BASIC_LIMIT = 3;

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        await connectToDatabase();

        // Get user
        const user = await User.findById(userId).lean<IUser>();
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // Count user's uploaded PDFs
        const uploadCount = await PdfSummary.countDocuments({ userId });

        // Determine plan
        const isPro = pricingPlans.find(plan => plan.priceId === user.priceId)?.id === "pro";
        const uploadLimit = isPro ? PRO_LIMIT : BASIC_LIMIT;
        const hasReachedLimit = uploadCount >= uploadLimit;

        // Get summaries for this user
        const summaries = await PdfSummary.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            hasReachedLimit,
            uploadLimit,
            summaries,
        });
    } catch (err) {
        console.error("Dashboard API Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
