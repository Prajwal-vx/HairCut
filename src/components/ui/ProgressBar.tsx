"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageProgressBar() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const handleStart = () => {
      if (!mounted) return;
      setIsLoading(true);
    };

    const handleComplete = () => {
      if (!mounted) return;
      setTimeout(() => {
        if (mounted) setIsLoading(false);
      }, 300);
    };

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      mounted = false;
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

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
            animate={{ width: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
