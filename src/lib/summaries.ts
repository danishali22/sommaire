import { getDBConnection } from "./db";

export async function getSummaries(userId: string) {
    const sql = await getDBConnection();
    const summaries = await sql`SELECT * FROM pdf_summaries WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return summaries;
}

export async function getSumaryById(id: string) {
    try {
        const sql = await getDBConnection();
        const [summary] = await sql`SELECT 
        id, 
        user_id,
        title,
        summary_text,
        original_file_url,
        status,
        file_name,
        created_at,
        updated_at,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 as word_count 
        FROM pdf_summaries  
        WHERE id = ${id}`;
        return summary;
    } catch (error) {
        console.error("Failed to fetch summary:", error);
        throw error;
    }
}