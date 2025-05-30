import { pricingPlans } from "./constants";
import { getDBConnection } from "./db"
import { getUserUploadCount } from "./summaries";

export const getPriceIdForActiveUser = async (email: string) => {
    const sql = await getDBConnection();
    const query = await sql`SELECT price_id FROM users WHERE email = ${email} AND status = 'active'`;
    return query[0]?.price_id || null;
}

export const hasReachedUploadLimit = async (userId: string) => {
    const uploadCount = await getUserUploadCount(userId);

    const priceId = await getPriceIdForActiveUser(userId);
    const isPro = pricingPlans.find((p) => p.priceId === priceId)?.id === 'pro';

    const uploadLimit: number = isPro ? 1000 : 4;

    const hasReachedLimit = uploadCount >= uploadLimit;

    return { hasReachedLimit, uploadLimit };
}