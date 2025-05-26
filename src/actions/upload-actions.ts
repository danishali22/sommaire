"use server"

import { getDBConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtratPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";

interface PdfSummaryType {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}

export async function generatePdfSummary(uploadResponse: Array<{
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        }
    };
}>) {
    if (!uploadResponse || uploadResponse.length === 0) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }

    const { serverData: { userId, file: { url: pdfUrl, name: fileName } } } = uploadResponse[0];

    if (!pdfUrl) {
        return {
            success: false,
            message: 'File pdfUrl upload failed',
            data: null,
        };
    }

    try {
        // Extract text from the PDF
        const pdfText = await fetchAndExtratPdfText(pdfUrl);
        console.log("Extracted PDF text:", pdfText);

        let summary;
        try {
            summary = await generateSummaryFromOpenAI(pdfText);
            console.log("OpenAI summary:", summary);
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
                try {
                    summary = await generateSummaryFromGemini(pdfText);
                    console.log("Gemini summary:", summary);
                } catch (geminiError) {
                    console.error("Gemini failed:", geminiError);
                    throw new Error("Failed with all providers");
                }
            }
        }

        if (!summary) {
            return {
                success: false,
                message: 'Failed to generate summary',
                data: null,
            };
        }

        const title = formatFileNameAsTitle(fileName);

        return {
            success: true,
            message: 'Summary generated successfully',
            data: { title, summary },
        };
    } catch (error) {
        console.error('Error in generatePdfSummary:', error);
        return {
            success: false,
            message: 'Processing failed',
            data: null,
        };
    }
}

async function savePdfSummary({ userId, fileUrl, summary, title, fileName }: PdfSummaryType) {
    const sql = await getDBConnection();
    const [savedSummary] = await sql`INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name) VALUES (${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName}) RETURNING id, summary_text;`;
    return savedSummary;
}

export async function storePdfSummaryActions({ fileUrl, summary, title, fileName }: PdfSummaryType) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: 'User not found', data: null };
        }

        await savePdfSummary({ userId, fileUrl, summary, title, fileName });

        return {
            success: true,
            message: 'PDF summary stored successfully',
            data: null,
        };
    } catch (error: any) {
        console.error('Failed to store summary:', error);
        return { success: false, message: error.message || 'Failed to store summary', data: null };
    }
}