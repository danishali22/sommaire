import { IUser, User } from "@/models/User";
import { pricingPlans } from "./constants";
import { getUserUploadCount } from "./summaries";
import { User as ClerkUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db";

const PRO_LIMIT = 1000;
const BASIC_LIMIT = 3;

/**
 * Get the Stripe Price ID for an active user by email.
 */
export const getPriceIdForActiveUser = async (email: string) => {
    await connectToDatabase();
    const user = await User.findOne({ email, status: "active" }).lean<IUser>();
    return user?.priceId || null;
};

/**
 * Check if user has reached upload limit.
 */
export const hasReachedUploadLimit = async (clerkUserId: string) => {
    await connectToDatabase();
    const user = await User.findOne({ clerkUserId }).lean<IUser>();

    if (!user) {
        throw new Error("User not found.");
    }

    // Convert ObjectId to string safely
    const _id = user._id as string | { toString(): string };
    const userId = typeof _id === "string" ? _id : _id.toString();

    // Get user's upload count
    const uploadCount = await getUserUploadCount(userId);

    // Check if user is on a Pro plan
    const isPro = pricingPlans.find((plan) => plan.priceId === user.priceId)?.id === "pro";

    const uploadLimit = isPro ? PRO_LIMIT : BASIC_LIMIT;
    const hasReachedLimit = uploadCount >= uploadLimit;

    return { hasReachedLimit, uploadLimit };
};

/**
 * Determine if the user has an active subscription.
 */
const hasActivePlan = async (email: string) => {
    await connectToDatabase();
    const user = await User.findOne({
        email,
        status: "active",
        priceId: { $exists: true, $ne: "" },
    }).lean();

    return !!user;
};

/**
 * Get subscription status from Clerk user.
 */
export const getSubscriptionStatus = async (clerkUser: ClerkUser) => {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) return false;

    return await hasActivePlan(email);
};
