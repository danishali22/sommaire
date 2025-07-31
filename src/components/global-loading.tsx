"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export const GlobalLoading = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // simulate transition delay

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <div className="text-center space-y-6">
            {/* Dot pulse animation */}
            <div className="flex justify-center space-x-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-rose-500"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-rose-500"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 rounded-full bg-rose-500"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>

            {/* Message */}
            <div>
              <h2 className="text-xl font-semibold text-rose-600">
                Loading your content...
              </h2>
              <p className="text-sm text-gray-600">Please hold on a moment</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
