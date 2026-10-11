"use client";

import React from "react";
import { Scissors, X, Clipboard, Share2, Download } from "lucide-react";
import type { StyleRecommendation, DiscoverAnswers } from "./discoverTypes";

interface BarberBriefModalProps {
  rec: StyleRecommendation;
  answers: DiscoverAnswers;
  copied: boolean;
  onClose: () => void;
  onCopy: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export function BarberBriefModal({
  rec,
  answers,
  copied,
  onClose,
  onCopy,
  onShare,
  onDownload,
}: BarberBriefModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="barber-brief-title"
        className="w-full max-w-lg rounded-2xl border border-[#c5a880]/40 bg-[#141312] p-5 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[#c5a880] text-xs uppercase tracking-[0.2em] font-semibold">
              Your appointment card
            </p>
            <h2 id="barber-brief-title" className="font-display text-2xl text-white mt-1">
              Show My Barber
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close barber brief"
            onClick={onClose}
            className="rounded-lg p-2 text-[#a09080] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[#2e2b26] bg-[#0d0c0b] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2e2b26] pb-3">
            <span className="text-xs tracking-[0.18em] text-[#c5a880] font-semibold">
              BARBER BRIEF
            </span>
            <Scissors className="w-4 h-4 text-[#c5a880]" />
          </div>
          <div>
            <p className="text-[11px] text-[#78716c] uppercase tracking-wider">Requested style</p>
            <p className="text-white text-lg font-semibold mt-0.5">{rec.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-[#78716c] uppercase tracking-wider">Current length</p>
              <p className="text-[#e0d8cd] mt-1 capitalize">
                {answers.hairLength.replace("-", " ")}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#78716c] uppercase tracking-wider">Texture</p>
              <p className="text-[#e0d8cd] mt-1 capitalize">{answers.hairTexture}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#78716c] uppercase tracking-wider">Finish</p>
              <p className="text-[#e0d8cd] mt-1">
                {answers.stylePriority === "natural"
                  ? "Natural"
                  : answers.stylePriority === "professional"
                  ? "Polished"
                  : answers.stylePriority === "fashion"
                  ? "Fashion-led"
                  : "Low-stress"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#78716c] uppercase tracking-wider">Maintenance</p>
              <p className="text-[#e0d8cd] mt-1">{rec.maintenanceLevel}</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#a09080] border-t border-[#2e2b26] pt-3">
            Please agree on the exact lengths together before cutting. This brief describes preferences, not a guaranteed result.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2e2b26] py-2.5 text-xs text-[#e0d8cd] hover:border-[#c5a880] transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5" />
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2e2b26] py-2.5 text-xs text-[#e0d8cd] hover:border-[#c5a880] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#c5a880] py-2.5 text-xs font-semibold text-[#0d0c0b] hover:bg-[#d4b898] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
