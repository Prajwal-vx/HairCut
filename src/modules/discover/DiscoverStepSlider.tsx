"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sliders, ArrowLeft, Sparkles } from "lucide-react";
import { getSliderLabel } from "./discoverEngine";

interface DiscoverStepSliderProps {
  changeSlider: number;
  onChange: (val: number) => void;
  onBack: () => void;
  onGenerate: () => void;
}

export function DiscoverStepSlider({
  changeSlider,
  onChange,
  onBack,
  onGenerate,
}: DiscoverStepSliderProps) {
  return (
    <div className="p-6 sm:p-10 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-[#c5a880] text-xs uppercase tracking-widest font-semibold mb-2">
          <Sliders className="w-4 h-4" />
          Safe Change → Bold Change
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
          How much change are you ready for?
        </h2>
        <p className="text-xs sm:text-sm text-[#a09080] mt-2">
          Drag the slider to tell us how dramatic you want your new look to be.
        </p>
      </div>

      {/* Current label */}
      <motion.div
        className="text-center"
        key={getSliderLabel(changeSlider)}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-3xl sm:text-4xl font-display font-bold text-white">
          {getSliderLabel(changeSlider)}
        </span>
        <div className="text-lg font-semibold text-[#c5a880] mt-1">
          {changeSlider}
          <span className="text-sm text-[#a09080] ml-1">/ 100</span>
        </div>
      </motion.div>

      {/* Slider */}
      <div className="px-2">
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={changeSlider}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #c5a880 0%, #c5a880 ${changeSlider}%, #2e2b26 ${changeSlider}%, #2e2b26 100%)`,
            }}
          />
        </div>

        {/* Tick labels */}
        <div className="flex justify-between mt-3 text-[10px] sm:text-xs text-[#6e665e] font-medium px-1">
          <span>Almost same</span>
          <span>Small refresh</span>
          <span>Noticeable</span>
          <span>Major</span>
          <span>Completely new</span>
        </div>
      </div>

      {/* Visual cue */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { range: "0–33", label: "Safe Zone", color: "#22c55e", icon: "🛡️" },
          { range: "34–66", label: "Balanced", color: "#c5a880", icon: "⚖️" },
          { range: "67–100", label: "Bold Territory", color: "#c86d51", icon: "🔥" },
        ].map((zone) => {
          const [lo, hi] = zone.range.split("–").map(Number);
          const active = changeSlider >= lo && changeSlider <= hi;
          return (
            <div
              key={zone.range}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                active ? "border-opacity-60 bg-opacity-10" : "border-[#1e1c19] bg-[#141312] opacity-40"
              }`}
              style={
                active
                  ? { borderColor: zone.color + "66", backgroundColor: zone.color + "14" }
                  : {}
              }
            >
              <div className="text-xl">{zone.icon}</div>
              <div
                className="text-xs font-semibold mt-1"
                style={{ color: active ? zone.color : "#6e665e" }}
              >
                {zone.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e4c9a4] text-[#0d0c0b] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#c5a880]/25"
        >
          <Sparkles className="w-4 h-4" /> Show My Best Options
        </button>
      </div>
    </div>
  );
}
