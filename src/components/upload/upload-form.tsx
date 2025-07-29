"use client";

import { useUploadThing } from "@/utils/uploadthing";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  generatePdfSummary,
  generatePdfText,
  storePdfSummaryActions,
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
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("✅ Uploaded successfully!");
      toast.success("✅ Upload succeeded!", {
        description: "Your PDF is now stored.",
      });
    },
    onUploadError: (err) => {
      console.error("❌ Upload error:", err);
      toast.error("❌ Upload failed", {
        description:
          (err.data as any)?.cause || err.message || "Please try again.",
      });
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

    try {
      setLoading(true);
      console.log("load");
      // return;
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // validating the fields
      const validatedSchema = schema.safeParse({ file });
      if (!validatedSchema.success) {
        toast.error("⚠️ Invalid file", {
          description: validatedSchema.error.flatten().fieldErrors.file?.[0],
        });
        setLoading(false);
        return;
      }

      // upload the file to upload thing
      const response = await startUpload([file!]);
      console.log("response", response);
      if (!response) return;

      toast.success("✅ Upload succeeded!", {
        description: "Your file is safely stored—building your AI summary now…",
        duration: 2000,
      });

      let storeResult: any;
      toast.success("🎉 Processing PDF!", {
        description: "Hang tight! Our AI is reading through your document!.",
      });
      formRef.current?.reset();
      const formattedFileName = formatFileNameAsTitle(file.name);
      const uploadFileUrl = response[0].serverData.file.url;

      const result = await generatePdfText({
        fileUrl: uploadFileUrl,
      });

      toast.success("🎉 Generating PDF Summary!", {
        description: "Han tight! Our AI is reading through your document!.",
      });

      // call ai service
      //parse the pdf using lang chain
      const summaryResult = await generatePdfSummary({
        pdfText: result?.data?.pdfText ?? "",
      });

      toast.success("🎉 Saving PDF Summary!", {
        description: "Han tight! Our AI is reading through your document!.",
      });

      const { data = null } = summaryResult || {};

      if (data?.summary) {
        storeResult = await storePdfSummaryActions({
          summary: data.summary,
          fileUrl: uploadFileUrl,
          title: formattedFileName,
          fileName: file.name,
        });
        console.log("storeResult", storeResult);

        toast.success("🎉 Summary Generated!", {
          description: "Your PDF has been successfully summarized and saved.",
        });

        formRef.current?.reset();
        if (storeResult?.data?.id) {
          router.push(`/summaries/${storeResult.data.id}`);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Error occured", error);
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto mt-2">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-gray-600 text-sm">
            Upload PDF
          </span>
        </div>
      </div>
      <UploadFormInput
        loading={loading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
      {loading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-gray-600 text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
