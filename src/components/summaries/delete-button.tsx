"use client";

import { deleteSummaryAction } from "@/actions/summary-actions";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-hot-toast";

interface DeleteButtonProps {
  summaryId: string;
}

const DeleteButton = ({ summaryId }: DeleteButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSummaryAction(summaryId);
      if (!result.success) {
        toast.error("Failed to delete summary.");
      }
    });
  };
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={(e) => {
        e.preventDefault();
        handleDelete();
      }}
      className="text-gray-400 bg-gray-50 border curosr-pointer border-gray-200 hover:text-rose-600 hover:bg-rose-50"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash className="w-4 h-4" />
      )}
    </Button>
  );
};

export default DeleteButton;
