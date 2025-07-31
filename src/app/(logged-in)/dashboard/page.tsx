"use client";

import { useEffect, useState } from "react";
import BgGradient from "@/components/common/bg-gradient";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/common/motion-wrapper";
import { useAuth } from "@/context/AuthContext";
import EmptySummaryState from "@/components/summaries/empty-summary-state";
import SummaryCard from "@/components/summaries/summary-card";
import { Button } from "@/components/ui/button";
import { itemsVariants } from "@/lib/constants";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState([]);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [uploadLimit, setUploadLimit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/data`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user._id }),
            cache: "no-store",
          }
        );

        const data = await res.json();
        setSummaries(data.summaries || []);
        setHasReachedLimit(data.hasReachedLimit || false);
        setUploadLimit(data.uploadLimit || 0);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col gap-4"
      >
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between items-center">
            <div className="flex flex-col items-start gap-2">
              <MotionH1
                variants={itemsVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent"
              >
                Your Summaries
              </MotionH1>
              <MotionP
                variants={itemsVariants}
                initial="hidden"
                animate="visible"
                className="text-gray-600"
              >
                Transform your PDFs into concise, actionable insights
              </MotionP>
            </div>
            {!hasReachedLimit && (
              <MotionDiv
                variants={itemsVariants}
                initial="hidden"
                animate="visible"
                whileInView={{ scale: 1.05 }}
                className="self-start"
              >
                <Button
                  variant={"link"}
                  className="bg-linear-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-pink-800 hover:scale-105 transition-all duration-300 group hover:no-underline"
                >
                  <Link href="/upload" className="flex items-center text-white">
                    <Plus className="w-5 h-5 mr-2" /> New Summary
                  </Link>
                </Button>
              </MotionDiv>
            )}
          </div>

          {hasReachedLimit && (
            <MotionDiv
              variants={itemsVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-500">
                <p className="text-sm">
                  You've reached the limit of 5 uploads on the Basic plan.
                  <Link
                    href="/pricing"
                    className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
                  >
                    {" "}
                    Click here to upgrade to pro
                    <ArrowRight className="w-4 h-4" />
                  </Link>{" "}
                  for unlimited uploads
                </p>
              </div>
            </MotionDiv>
          )}

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : summaries.length === 0 ? (
            <EmptySummaryState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 sm:px-0">
              {summaries.map((summary, index) => (
                <SummaryCard key={index} summary={summary} />
              ))}
            </div>
          )}
        </div>
      </MotionDiv>
    </main>
  );
};

export default Dashboard;