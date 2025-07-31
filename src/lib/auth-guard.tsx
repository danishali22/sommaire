"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import UpgradeRequired from "@/components/common/upgrade-required";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if(user?.hasActivePlan){
  // if (!user?.hasActivePlan) {
    return <UpgradeRequired />;
  }

  return <>{children}</>;
}
