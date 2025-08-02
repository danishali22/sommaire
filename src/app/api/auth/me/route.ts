import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db";
import { IUserWithPlan, User } from "@/models/User";
import { pricingPlans } from "@/lib/constants";
import { PdfSummary } from "@/models/PdfSummary";

const BASIC_LIMIT = 3;
const PRO_LIMIT = 1000;

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const clerk = await currentUser();

    if (!clerk?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkUserId: clerk.id }).lean<IUserWithPlan>();
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const matchedPlan = pricingPlans.find((p) => p.priceId === user.priceId);
    const plan = matchedPlan?.id || null;
    const planName = matchedPlan?.name || "Buy a plan"
    
    const hasActivePlan = !!matchedPlan;
    const uploadLimit = plan === "pro" ? PRO_LIMIT : BASIC_LIMIT;

    const uploadCount = await PdfSummary.countDocuments({
        userId: String(user._id),
    });

    const hasReachedLimit = uploadCount >= uploadLimit;

    return NextResponse.json({
        ...user,
        plan,
        planName,
        hasActivePlan,
        uploadLimit,
        uploadCount,
        hasReachedLimit,
    });
}
