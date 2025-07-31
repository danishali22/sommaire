"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const PlanBadge = () => {
  const { user } = useAuth();

  return (
    <Badge
      variant={"outline"}
      className={cn(
        "ml-2 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300 hidden lg:flex flex-row items-center",
        !user?.priceId && "from-red-100 to-red-200 border-red-300"
      )}
    >
      <Crown
        className={cn(
          "w-3 h-3 mr-1",
          user?.planName === "Buy a plan" ? "text-red-600" : "text-amber-600"
        )}
      />
      {user?.planName}
    </Badge>
  );
};

export default PlanBadge;
