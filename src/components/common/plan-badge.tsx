"use client";

import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const PlanBadge = () => {
  const [planName, setPlanName] = useState<string | null>(null);
  const [priceId, setPriceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("/api/user/plan");
        const data = await res.json();
        setPlanName(data.planName);
        setPriceId(data.priceId);
      } catch (err) {
        console.error("Failed to load plan name:", err);
      }
    };

    fetchPlan();
  }, []);

  if (!planName) return null;

  return (
    <Badge
      variant={"outline"}
      className={cn(
        "ml-2 bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300 hidden lg:flex flex-row items-center",
        !priceId && "from-red-100 to-red-200 border-red-300"
      )}
    >
      <Crown
        className={cn(
          "w-3 h-3 mr-1",
          planName === "Buy a plan" ? "text-red-600" : "text-amber-600"
        )}
      />
      {planName}
    </Badge>
  );
};

export default PlanBadge;
