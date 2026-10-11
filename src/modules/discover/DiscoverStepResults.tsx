"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Scissors,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { BarberBriefModal } from "./BarberBriefModal";
import type { StyleRecommendation, DiscoverAnswers } from "./discoverTypes";

interface DiscoverStepResultsProps {
  recommendations: StyleRecommendation[];
  answers: DiscoverAnswers;
  barberBrief: StyleRecommendation | null;
  briefCopied: boolean;
  onRetake: () => void;
  onBack: () => void;
  onSelectBrief: (rec: StyleRecommendation | null) => void;
  onCopyBrief: () => void;
  onShareBrief: () => void;
  onDownloadBrief: () => void;
}

const tierColors: Record<"safe" | "balanced" | "bold", string> = {
  safe: "from-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]",
  balanced: "from-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880]",
  bold: "from-[#c86d51]/10 border-[#c86d51]/40 text-[#c86d51]",
};

const tierBadgeBg: Record<"safe" | "balanced" | "bold", string> = {
  safe: "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]",
  balanced: "bg-[#c5a880]/10 border-[#c5a880]/30 text-[#c5a880]",
  bold: "bg-[#c86d51]/10 border-[#c86d51]/30 text-[#c86d51]",
};

export function DiscoverStepResults({
  recommendations,
  answers,
  barberBrief,
  briefCopied,
  onRetake,
  onBack,
  onSelectBrief,
  onCopyBrief,
  onShareBrief,
  onDownloadBrief,
}: DiscoverStepResultsProps) {
  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2b26] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs font-semibold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" /> YOUR BEST OPTIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Styles Matched to You
          </h2>
          <p className="text-sm text-[#a09080] mt-1">
            Based on your hair type, face shape, lifestyle &amp; change comfort
          </p>
        </div>
        <button
          type="button"
          onClick={onRetake}
          className="self-start sm:self-auto inline-flex items-center gap-2 text-xs sm:text-sm text-[#a09080] hover:text-[#c5a880] transition-colors border border-[#2e2b26] px-3.5 py-2 rounded-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retake
        </button>
      </div>

      {/* AI Disclaimer */}
      <div className="flex items-start gap-3 bg-[#1a1816] border border-[#c86d51]/30 rounded-xl px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-[#c86d51] shrink-0 mt-0.5" />
        <p className="text-xs text-[#a09080] leading-relaxed">
          <strong className="text-[#e0d8cd]">⚠️ AI-Assisted Suggestions:</strong> These are style
          suggestions based on your preferences and are not guaranteed recommendations. Consult your stylist for
          professional advice before making any changes.
        </p>
      </div>

      {/* Recommendation cards */}
      <div className="space-y-6">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12, duration: 0.35 }}
            className={`rounded-2xl border bg-gradient-to-br ${tierColors[rec.tier]} from-[#141312] overflow-hidden`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
              {/* Style image */}
              <div className="sm:col-span-4 relative aspect-[4/3] sm:aspect-auto min-h-[200px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${tierBadgeBg[rec.tier]} backdrop-blur-sm`}
                  >
                    {rec.tier === "safe" && "🛡️"}
                    {rec.tier === "balanced" && "⚖️"}
                    {rec.tier === "bold" && "🔥"}
                    {rec.label}
                  </span>
                </div>
              </div>

              {/* Style details */}
              <div className="sm:col-span-8 p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">
                      {rec.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tierBadgeBg[rec.tier]}`}>
                        AI Suggestion
                      </span>
                    </div>
                  </div>
                  {/* Fit Score ring */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#2e2b26" strokeWidth="4" />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          fill="none"
                          stroke={rec.tier === "safe" ? "#22c55e" : rec.tier === "balanced" ? "#c5a880" : "#c86d51"}
                          strokeWidth="4"
                          strokeDasharray={`${(rec.fitScore / 100) * 138.2} 138.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{rec.fitScore}</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6e665e] mt-1 uppercase tracking-wider">Fit Score</span>
                  </div>
                </div>

                {/* Why it works */}
                <ul className="space-y-1.5">
                  {rec.whyItWorks.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#e0d8cd]">
                      <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                {/* Maintenance */}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#a09080]" />
                  <span className="text-xs text-[#a09080]">
                    Maintenance: <span className="text-[#e0d8cd] font-medium">{rec.maintenanceLevel}</span>
                  </span>
                  <div className="flex gap-1 ml-1">
                    {["Low", "Medium", "High"].map((lvl) => (
                      <div
                        key={lvl}
                        className={`w-2 h-2 rounded-full ${
                          (lvl === "Low" && rec.maintenanceLevel !== "High" && rec.maintenanceLevel !== "Medium") ||
                          (lvl === "Medium" && (rec.maintenanceLevel === "Medium" || rec.maintenanceLevel === "High")) ||
                          (lvl === "High" && rec.maintenanceLevel === "High")
                            ? "bg-[#c5a880]"
                            : "bg-[#2e2b26]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Link
                    href="/book"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                  >
                    <Scissors className="w-4 h-4" /> Book This Style
                  </Link>
                  <button
                    type="button"
                    onClick={() => onSelectBrief(rec)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-sm text-[#e0d8cd] hover:border-[#c5a880] hover:text-[#c5a880] transition-colors"
                  >
                    <BookOpen className="w-4 h-4" /> Show My Barber
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {barberBrief && (
        <BarberBriefModal
          rec={barberBrief}
          answers={answers}
          copied={briefCopied}
          onClose={() => onSelectBrief(null)}
          onCopy={onCopyBrief}
          onShare={onShareBrief}
          onDownload={onDownloadBrief}
        />
      )}

      {/* Photo preview if provided */}
      {answers.photoUrl && (
        <div className="flex items-center gap-3 text-xs text-[#6e665e] bg-[#1a1816] border border-[#2e2b26] rounded-lg px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={answers.photoUrl}
            alt="Your photo"
            className="w-8 h-8 rounded-full object-cover border border-[#2e2b26]"
          />
          <div>
            <span className="text-[#a09080]">Suggestions also factored in your uploaded photo.</span>
            <br />
            <span className="flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-[#c5a880]" />
              Photo stays on your device — never uploaded.
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Adjust Answers
        </button>
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 text-xs text-[#a09080] hover:text-[#c5a880] transition-colors"
        >
          Want a deeper analysis? <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
