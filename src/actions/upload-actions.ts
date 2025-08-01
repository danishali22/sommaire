"use server";

import { connectToDatabase } from "@/lib/db";
import { PdfSummary } from "@/models/PdfSummary";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtratPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";

interface PdfSummaryType {
    userId: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}

export async function generatePdfText({ fileUrl }: { fileUrl: string }) {
    if (!fileUrl) {
        return {
            success: false,
            message: "File upload failed",
            data: null,
        };
    }

    try {
        const pdfText = await fetchAndExtratPdfText(fileUrl);
        console.log("Extracted PDF text:", pdfText);

        if (!pdfText) {
            return {
                success: false,
                message: "Failed to fetch and extract PDF text",
                data: null,
            };
        }

        return {
            success: true,
            message: "PDF text generated successfully",
            data: { pdfText },
        };
    } catch (error) {
        console.error("Failed to fetch and extract PDF text:", error);
        return {
            success: false,
            message: "Failed to fetch and extract PDF text",
            data: null,
        };
    }
}

export async function generatePdfSummary({ pdfText }: { pdfText: string }) {
    if (!pdfText) {
        return {
            success: false,
            message: "File upload failed",
            data: null,
        };
    }

    try {
        let summary: string | undefined;

        try {
            const openAISummary = await generateSummaryFromOpenAI(pdfText);
            summary = openAISummary === null ? undefined : openAISummary;
            console.log("OpenAI summary:", summary);
        } catch (error) {
            console.log("OpenAI failed:", error);
            if (
                error instanceof Error &&
                error.message === "RATE_LIMIT_EXCEEDED"
            ) {
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
                message: "Failed to generate summary",
                data: null,
            };
        }

        return {
            success: true,
            message: "Summary generated successfully",
            data: { summary },
        };
    } catch (error) {
        console.error("Error in generatePdfSummary:", error);
        return {
            success: false,
            message: "Processing failed",
            data: null,
        };
    }
}