import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getPriceIdForActiveUser } from "@/lib/user";
import { pricingPlans } from "@/lib/constants";

export async function GET() {
    const user = await currentUser();

    if (!user?.emailAddresses?.[0]?.emailAddress) {
        return NextResponse.json({ planName: null }, { status: 200 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const priceId = await getPriceIdForActiveUser(email);
    const plan = pricingPlans.find((p) => p.priceId === priceId);

    return NextResponse.json({ planName: plan?.name || "Buy a plan", priceId });
}
