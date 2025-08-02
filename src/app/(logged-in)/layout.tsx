import React from "react";
import AuthGuard from "@/lib/auth-guard";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default DashboardLayout;
