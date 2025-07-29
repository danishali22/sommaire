import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSummaryFromGemini(pdfText: string) {
    try {
        const response = await ai.models.generateContent({
            // model: "gemini-1.5-pro-002",
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: SUMMARY_SYSTEM_PROMPT },
                        {
                            text: `Transform this document into an engaging, easy - to - read summary with contextually relevant emojis and proper markdown formatting: \n\n${pdfText}`,
                        },
                    ],
                },
            ],
            config: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            },
        });
        
        if(!response) {
            throw new Error("Empty response from Gemini Api")
        }

        return response.text;
    } catch (error: any) {
        console.log('Gemini API Error', error);
        throw error;
    }
}