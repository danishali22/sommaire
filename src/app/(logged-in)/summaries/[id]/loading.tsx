import BgGradient from "@/components/common/bg-gradient";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingSkeleton from "@/components/upload/loading-skeleton";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import React from "react";

function HeaderSkeleton() {
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-8 w-32 rounded-full bg-white/80" />
        <Skeleton className="h-5 w-40 rounded-full bg-white/80" />
        <Skeleton className="h-12 w-3/4 rounded-full bg-white/80" />
    </div>
  </div>;
}

const LoadingSummaryPage = () => {
  return (
    <div className="relative isloate min-h-screen bg-linear-to-r from-rose-50/40 to-white">
      <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
      <div className="conatiner mx-auto flex flex-col gap-4">
        <div className="px-2 py-4 lg:px-8 mx-auto">
          <div className="flex flex-col gap-8">
            <HeaderSkeleton />
            <div className="relative mt-4 sm:mt-8 lg:mt-16">
              <div className="relative p-8 bg-white/80 backdrop-blur-md rounded-2xl  border border-rose-100/30">
                {/* Gradient Backgorund  */}
                <div className="absolute top-4 inset-0 bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-3xl" />

                {/* Icon  */}
                <div className="absolute top-4 right-4 text-rose-300/20">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
                </div>

                <div className="relative">
                  <LoadingSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSummaryPage;
