"use client";

import { useUploadThing } from "@/utils/uploadthing";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import {
  generatePdfSummary,
  generatePdfText,
} from "../../actions/upload-actions";
import UploadFormInput from "./upload-form-input";
import LoadingSkeleton from "./loading-skeleton";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 20 * 1024 * 1024, "File too large")
    .refine((f) => f.type === "application/pdf", "Must be a PDF"),
});

export default function UploadForm() {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("✅ Upload completed!");
    },
    onUploadError: (err) => {
      console.error("❌ Upload error:", err);
      toast.error(
        "❌ Upload failed\n" +
          ((err.data as any)?.cause || err.message || "Please try again.")
      );
    },
    onBeforeUploadBegin: (files) => {
      console.log("Preparing to upload:", files[0].name);
      return files;
    },
    onUploadBegin: (fileName) => {
      console.log("Uploading:", fileName);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validatedSchema = schema.safeParse({ file });
      if (!validatedSchema.success) {
        toast.error(
          "⚠️ Invalid file: " +
            validatedSchema.error.flatten().fieldErrors.file?.[0]
        );
        setLoading(false);
        return;
      }

      const uploadToastId = toast.loading("📤 Uploading your PDF...");
      const response = await startUpload([file!]);
      toast.dismiss(uploadToastId);

      if (!response) return;

      const formattedFileName = formatFileNameAsTitle(file.name);
      const uploadFileUrl = response[0].serverData.file.url;

      formRef.current?.reset();

      const pdfTextResult = await toast.promise(
        generatePdfText({ fileUrl: uploadFileUrl }),
        {
          loading: "🔍 Extracting text from PDF...",
          success: "✅ Text extracted!",
          error: "❌ Failed to extract PDF text.",
        }
      );

      const summaryResult = await toast.promise(
        generatePdfSummary({ pdfText: pdfTextResult?.data?.pdfText ?? "" }),
        {
          loading: "🧠 Generating summary with AI...",
          success: "✅ Summary ready!",
          error: "❌ Failed to summarize PDF.",
        }
      );

      const { data = null } = summaryResult || {};

      console.log("outside fetch");
      if (data?.summary) {
        console.log("before fetch");
        const storeResult = await toast.promise(
          fetch("/api/pdf-summary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user?._id,
              summary: data.summary,
              fileUrl: uploadFileUrl,
              title: formattedFileName,
              fileName: file.name,
            }),
          }).then((res) => res.json()),
          {
            loading: "💾 Saving summary...",
            success: "✅ Summary saved!",
            error: "❌ Failed to save summary.",
          }
        );
        console.log("after fetch");

        if (storeResult?.data?.id) {
          toast.loading("🔄 Redirecting to your summary...");
          router.push(`/summaries/${storeResult.data.id}`);
        }
        console.log("after fetch redirect");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("❌ Something went wrong. Please try again.");
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto mt-2">
      {!loading && (
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-800" />
          <span className="text-sm text-gray-600">Upload PDF</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-800" />
        </div>
      )}

      <UploadFormInput
        loading={loading}
        ref={formRef}
        onSubmit={handleSubmit}
      />

      {loading && (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-800" />
            <span className="text-sm text-gray-600">Processing</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-800" />
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
