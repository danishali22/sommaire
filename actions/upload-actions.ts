"use server"

import { getDBConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtratPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";

interface PdfSummaryType {
    userId?: string, fileUrl: string, summary: string, title: string, fileName: string
}

export async function generatePdfSummary(uploadResponse: {
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        }
    };
}) {
    if (uploadResponse) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }

    const { serverData: { userId, file: { url: pdfUrl, name: fileName } }, } = uploadResponse[0];

    if (!pdfUrl) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }

    try {
        const pdfText = await fetchAndExtratPdfText(pdfUrl);
        console.log("pdfText", pdfText);

        let summary;
        try {
            const result = await generateSummaryFromOpenAI(pdfText);
            console.log({ summary });
        } catch (error) {
            console.log(error);
            // call gemini
            if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
                try {
                    const summary = await generateSummaryFromGemini(pdfText);
                } catch (geminiError) {
                    console.error("Gemini API failed after OpenAI quota exceeded", geminiError);
                    throw new Error("Failed to generate summary with avaiable AI providers");
                }
            }
        }
        if (!summary) {
            return {
                success: false,
                message: 'Failed to generate summary',
                data: null,
            }
        }

        const formattedFileName = formatFileNameAsTitle(fileName);

        return {
            success: true,
            message: 'Summary generated successfully',
            data: {
                title: formattedFileName,
                summary,
            },
        }
    } catch (error) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }
}

async function savePdfSummary({ userId, fileUrl, summary, title, fileName }: PdfSummaryType) {
    try {
        const sql = await getDBConnection();
        await sql`INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name) VALUES (${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName});`;
    } catch (error) {
        console.error("Failed to save summary", error);
        throw error;
    }
}

export async function storePdfSummaryActions({
    fileUrl,
    summary,
    title,
    fileName,
}: PdfSummaryType) {
    // user is logged in and has a userId
    // savePdfSummary()
    let savedSummary : any;
    try {
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                message: 'User not found',
                data: null,
            }
        }
        savedSummary = await savePdfSummary({
            userId,
            fileUrl,
            summary,
            title,
            fileName,
        });
        if(!savedSummary) {
            return {
                success: false,
                message: 'Failed to store Pdf summary, please try again...',
                data: null,
            }
        }

        return {
            success: true,
            message: 'PDF summary stored successfully',
            data: savedSummary,
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to store summary',
            data: null,
        }
    }
}