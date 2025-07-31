"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import BgGradient from "@/components/common/bg-gradient";
import { MotionDiv } from "@/components/common/motion-wrapper";
import SourceInfo from "@/components/summaries/source-info";
import SummaryViewer from "@/components/summaries/summary-viewer";
import SummaryHeader from "@/components/summaries/summary_header";
import { FileText } from "lucide-react";
import LoadingSkeleton from "@/components/upload/loading-skeleton";

interface Summary {
  _id: string;
  title: string;
  summary: string;
  fileName: string;
  word_count: number;
  createdAt: string;
  originalFileUrl: string;
}

const SummaryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [summaryData, setSummaryData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/summary/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) return setError("not-found");
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setSummaryData(data);
      } catch (err) {
        console.error("❌ Error loading summary:", err);
        setError("server-error");
      }
    };

    fetchSummary();
  }, [id]);

  if (error === "not-found") notFound();
  if (error)
    return (
      <p className="text-center text-red-500 mt-10">Failed to load summary.</p>
    );
  if (!summaryData) return (
     <LoadingSkeleton />
  );

  const {
    title,
    summary: summaryText,
    fileName,
    word_count,
    createdAt,
    originalFileUrl,
  } = summaryData;

  const readingTime = Math.ceil((word_count || 0) / 200);

  return (
    <div className="relative isloate min-h-screen bg-linear-to-r from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-4 lg:px-8 mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <SummaryHeader
              title={title}
              createdAt={createdAt}
              readingTime={readingTime}
            />
          </MotionDiv>

          {fileName && (
            <SourceInfo
              title={title}
              summaryText={summaryText}
              fileName={fileName}
              createdAt={createdAt}
              originalFileUrl={originalFileUrl}
            />
          )}

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mt-4 sm:mt-8 lg:mt-16"
          >
            <div className="relative bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-linear-to-r from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl" />
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
                {word_count?.toLocaleString()} words
              </div>
              <div className="relative mt-8 sm:mt-6 p-6 flex justify-center">
                <SummaryViewer summary={summaryText} />
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
