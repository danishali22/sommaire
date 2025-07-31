import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { itemsVariants } from "@/lib/constants";
import { MotionDiv } from "@/components/common/motion-wrapper";

const SummaryCardSkeleton = () => {
  return (
    <MotionDiv
      variants={itemsVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <Card className="relative h-full w-full">
        {/* Delete Button Placeholder */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-300" />
        </div>

        <div className="p-4 space-y-4">
          {/* File Icon + Header */}
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-sm bg-rose-200" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-4/5 rounded bg-gray-300" />
              <Skeleton className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
          </div>

          {/* Summary Text */}
          <div className="space-y-2 pl-2">
            <Skeleton className="h-4 w-full rounded bg-gray-200" />
            <Skeleton className="h-4 w-11/12 rounded bg-gray-200" />
            <Skeleton className="h-4 w-9/12 rounded bg-gray-200" />
          </div>

          {/* Status Badge */}
          <div className="mt-2">
            <Skeleton className="h-6 w-20 rounded-full bg-gray-300" />
          </div>
        </div>
      </Card>
    </MotionDiv>
  );
};

const SummaryCardSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <SummaryCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default SummaryCardSkeletonGrid;
