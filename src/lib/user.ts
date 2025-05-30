import { getDBConnection } from "./db"

export const getPriceIdForActiveUser = async (email: string) => {
    const sql = await getDBConnection();
    const query = await sql`SELECT price_id FROM users WHERE email = ${email} AND status = 'active'`;
    return query[0]?.price_id || null;
}