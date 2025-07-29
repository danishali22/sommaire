import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";
import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateSummaryFromOpenAI(pdfText: string) {
    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: SUMMARY_SYSTEM_PROMPT },
                { role: "user", content: `Transform this document into an engaging, easy-to-read summary with contexually relevant emojis and proper markdown formatting:\n\n${pdfText}` },
            ],
        });

        return completion.choices[0].message.content;
    } catch (error: any) {
        if (error?.status === 429) throw new Error("RATE_LIMIT_EXCEEDED");
        throw error;
    }
}