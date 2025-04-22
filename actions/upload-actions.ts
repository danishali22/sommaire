"use server"

import { fetchAndExtratPdfText } from "@/lib/langchain";

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

    if(!pdfUrl){
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }

    try {
        const pdfText = await fetchAndExtratPdfText(pdfUrl);
        console.log("pdfText", pdfText);
    } catch (error) {
        return {
            success: false,
            message: 'File upload failed',
            data: null,
        }
    }
}