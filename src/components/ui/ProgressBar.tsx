"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;

    const handleStart = () => {
      if (!mounted) return;
      setIsLoading(true);
      setProgress(0);
    };

    const handleComplete = () => {
      if (!mounted) return;
      setProgress(100);
      setTimeout(() => {
        if (mounted) {
          setIsLoading(false);
          setProgress(0);
        }
      }, 300);
    };

    // Simulate progress
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 100);
    }

    // Listen to route changes
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#0d0c0b]"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#c5a880] to-[#c86d51]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
