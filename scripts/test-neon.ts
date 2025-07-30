import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL!);


async function testConnection() {
    try {
        const result = await sql`SELECT NOW()`;
        console.log("✅ Connected to NeonDB:", result);
    } catch (error) {
        console.error("❌ Failed to connect to NeonDB:", error);
    }
}

testConnection();
