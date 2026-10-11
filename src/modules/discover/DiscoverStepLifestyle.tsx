"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { OptionCard } from "./OptionCard";
import type { DiscoverAnswers } from "./discoverTypes";

interface DiscoverStepLifestyleProps {
  answers: DiscoverAnswers;
  onUpdate: <K extends keyof DiscoverAnswers>(key: K, value: DiscoverAnswers[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DiscoverStepLifestyle({
  answers,
  onUpdate,
  onBack,
  onNext,
}: DiscoverStepLifestyleProps) {
  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Styling Time */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
            How much daily styling time do you have?
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { id: "under5", icon: "⚡", label: "Under 5 min", description: "Wash & go" },
              { id: "5to10", icon: "☕", label: "5–10 min", description: "Quick routine" },
              { id: "10to20", icon: "🪥", label: "10–20 min", description: "Some effort" },
              { id: "20plus", icon: "🎨", label: "20+ min", description: "Full styling" },
            ] as const
          ).map((item) => (
            <OptionCard
              key={item.id}
              id={item.id}
              selected={answers.stylingTime}
              onSelect={(v) => onUpdate("stylingTime", v)}
              icon={item.icon}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Cut Frequency */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
            How often do you get a haircut?
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { id: "biweekly", icon: "📅", label: "Every 2 weeks", description: "High upkeep" },
              { id: "monthly", icon: "🗓️", label: "Monthly", description: "Regular" },
              { id: "every6weeks", icon: "📆", label: "Every 6 weeks", description: "Moderate" },
              { id: "2months", icon: "🌙", label: "Every 2+ months", description: "Low upkeep" },
            ] as const
          ).map((item) => (
            <OptionCard
              key={item.id}
              id={item.id}
              selected={answers.cutFrequency}
              onSelect={(v) => onUpdate("cutFrequency", v)}
              icon={item.icon}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Style Priority */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
            What matters most to you?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              {
                id: "professional",
                icon: "💼",
                label: "Looking sharp & professional",
                description: "Crisp edges, clean lines, polished every day",
              },
              {
                id: "natural",
                icon: "🌿",
                label: "Natural & effortless",
                description: "Looks great with minimal effort",
              },
              {
                id: "fashion",
                icon: "✨",
                label: "Fashion-forward",
                description: "Trendy cuts, color, bold statements",
              },
              {
                id: "health",
                icon: "💚",
                label: "Hair health",
                description: "Nourishing treatments, damage repair",
              },
            ] as const
          ).map((item) => (
            <OptionCard
              key={item.id}
              id={item.id}
              selected={answers.stylePriority}
              onSelect={(v) => onUpdate("stylePriority", v)}
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
