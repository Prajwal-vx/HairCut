"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OptionCard } from "./OptionCard";
import type { DiscoverAnswers } from "./discoverTypes";

interface DiscoverStepHairProps {
  answers: DiscoverAnswers;
  onUpdate: <K extends keyof DiscoverAnswers>(key: K, value: DiscoverAnswers[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DiscoverStepHair({
  answers,
  onUpdate,
  onBack,
  onNext,
}: DiscoverStepHairProps) {
  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Hair Length */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
            What&apos;s your current hair length?
          </h2>
          <p className="text-xs text-[#a09080] mt-0.5">Pick the closest match to right now.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(
            [
              { id: "very-short", icon: "✂️", label: "Very Short" },
              { id: "short", icon: "💈", label: "Short" },
              { id: "medium", icon: "🪮", label: "Medium" },
              { id: "long", icon: "💇", label: "Long" },
              { id: "very-long", icon: "🌊", label: "Very Long" },
            ] as const
          ).map((item) => (
            <OptionCard
              key={item.id}
              id={item.id}
              selected={answers.hairLength}
              onSelect={(v) => onUpdate("hairLength", v)}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </div>

      {/* Hair Texture */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
            What&apos;s your hair texture?
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { id: "straight", icon: "〰️", label: "Straight", description: "Lies flat naturally" },
              { id: "wavy", icon: "〜", label: "Wavy", description: "S-shaped waves" },
              { id: "curly", icon: "🌀", label: "Curly", description: "Defined spirals" },
              { id: "coily", icon: "🔄", label: "Coily", description: "Tight zig-zag coils" },
            ] as const
          ).map((item) => (
            <OptionCard
              key={item.id}
              id={item.id}
              selected={answers.hairTexture}
              onSelect={(v) => onUpdate("hairTexture", v)}
              icon={item.icon}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Face Shape */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
            What&apos;s your face shape?
          </h2>
          <p className="text-xs text-[#a09080] mt-0.5">Not sure? Go with your best guess.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(
            [
              { id: "oval", icon: "🥚", label: "Oval", description: "Balanced, slightly longer" },
              { id: "square", icon: "⬛", label: "Square", description: "Strong jaw, equal widths" },
              { id: "round", icon: "⭕", label: "Round", description: "Full cheeks, equal width/height" },
              { id: "heart", icon: "♥️", label: "Heart", description: "Wide brow, pointed chin" },
              { id: "diamond", icon: "💎", label: "Diamond", description: "Narrow brow and chin" },
            ] as const
          ).map((item) => (
            <OptionCard
              key={item.id}
              id={item.id}
              selected={answers.faceShape}
              onSelect={(v) => onUpdate("faceShape", v)}
              icon={item.icon}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
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
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
