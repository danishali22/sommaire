"use client";

import React, { forwardRef, useRef, useState } from "react";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "../../../actions/upload-actions";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 20 * 1024 * 1024, "File too large")
    .refine((f) => f.type === "application/pdf", "Must be a PDF"),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
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
    onUploadBegin: ({ file }) => {
      console.log("🚀 Upload has begun for", file.name);
      toast.loading("🚀 Uploading PDF…", {
        description: "Please wait while we upload your document.",
      });
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

      toast.loading("🚀 Uploading PDF…", {
        description: "Please wait while we upload your document.",
        duration: 3000,
      });

      // upload the file to upload thing
      const response = await startUpload([file!]);
      if (!response) return;

      toast.success("✅ Upload succeeded!", {
        description: "Your file is safely stored—building your AI summary now…",
        duration: 2000,
      });

      toast.loading("📝 Processing PDF…", {
        description: "Our AI is analyzing your document.",
        duration: 4000,
      });

      // parse the pdf using lang chain
      const result = await generatePdfSummary(response);
      const { data = null, message = null } = result || {};

      if (data) {
        toast.success("🎉 Summary ready!", {
          description: "Tap below to view your AI‑generated overview.",
          // action: {
          //   label: "View Summary",
          //   onClick: () => router.push(`/summaries/${summary.id}`),
          // },
        });
        formRef.current?.reset();
        if(data.summary){
          // save the summary to database
        }
      }

      // summarize the pdf using AI
      // save the summary to the database
      // redirect to the [id] summary page
    } catch (error) {
      setLoading(false);
      console.error("Error occured", error);
      formRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput loading={loading} ref={formRef} onSubmit={handleSubmit} />
    </div>
  );
}
