import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import DeleButton from "./delete-button";
import Link from "next/link";
import { FileText } from "lucide-react";
import { cn, formatFileName } from "@/lib/utils";
import { MotionDiv } from "../common/motion-wrapper";
import { itemsVariants } from "@/lib/constants";
import { IPdfSummary } from "@/models/PdfSummary";

const SumaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string;
  createdAt: string;
}) => {
  return (
    <div className="flex items-start gap-2 sm:gap-4">
      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
      <div className="flex-1 min-w-0">
        <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
          {title || formatFileName(fileUrl)}
        </h3>
        <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full capitalize",
        status === "completed"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      )}
    >
      {status}
    </span>
  );
};

const SummaryCard = ({ summary }: { summary: IPdfSummary }) => {
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
      <Card className="relative h-full">
        <div className="absolute top-2 right-2">
          <DeleButton summaryId={String(summary._id)} />
        </div>
        <Link href={`/summaries/${summary._id}`} className="block p-4">
          <div className="flex flex-col gap-3">
            <SumaryHeader
              fileUrl={summary.originalFileUrl}
              title={summary.title}
              createdAt={summary.createdAt instanceof Date ? summary.createdAt.toISOString() : summary.createdAt}
            />
            <p className="text-sm text-gray-600 line-clamp-3 sm:text-base pl-2">
              {summary.summary}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span>
                {" "}
                <StatusBadge status={summary.status} />
              </span>
            </div>
          </div>
        </Link>
      </Card>
    </MotionDiv>
  );
};

export default SummaryCard;