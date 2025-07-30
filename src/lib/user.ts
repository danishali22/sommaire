import { User } from "@clerk/nextjs/server";
import { pricingPlans } from "./constants";
import { getDBConnection } from "./db"
import { getUserUploadCount } from "./summaries";

const PRO_LIMIT = 1000;
const BASIC_LIMIT = 10;
const sql = await getDBConnection();

export const getPriceIdForActiveUser = async (email: string) => {
    const query = await sql`SELECT price_id FROM users WHERE email = ${email} AND status = 'active'`;
    return query[0]?.price_id || null;
}

export const hasReachedUploadLimit = async (userId: string) => {
    const uploadCount = await getUserUploadCount(userId);

    const priceId = await getPriceIdForActiveUser(userId);
    const isPro = pricingPlans.find((p) => p.priceId === priceId)?.id === 'pro';

    const uploadLimit: number = isPro ? PRO_LIMIT : BASIC_LIMIT;
    const hasReachedLimit = uploadCount >= uploadLimit;

    return { hasReachedLimit, uploadLimit };
}

const hasActivePlan = async (email: string) => {
    const query = await sql`SELECT price_id, status FROM users WHERE email = ${email} AND status = 'active' AND price_id IS NOT NULL`;
    return query && query.length > 0;
}

export const getSubscriptionStatus = async (user: User) => {
    const hasSubscription = await hasActivePlan(user.emailAddresses[0]?.emailAddress)
    return hasSubscription;
}