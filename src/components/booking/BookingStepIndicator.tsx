"use client";

import React from "react";
import { Scissors, User, Calendar, Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { step: 1, label: "Service", icon: Scissors },
  { step: 2, label: "Stylist", icon: User },
  { step: 3, label: "Date & Time", icon: Calendar },
  { step: 4, label: "Review", icon: Check },
];

export function BookingStepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 overflow-x-auto pb-2">
      {STEPS.map(({ step, label, icon: Icon }) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => isCompleted && onStepClick(step)}
              disabled={!isCompleted}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#c5a880] text-[#141312] shadow-lg shadow-[#c5a880]/20 font-semibold"
                  : isCompleted
                  ? "bg-[#282522] text-[#c5a880] hover:bg-[#34302c] cursor-pointer"
                  : "bg-[#1e1c19] text-stone-500 cursor-not-allowed"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? "bg-[#141312] text-[#c5a880]"
                    : isCompleted
                    ? "bg-[#c5a880] text-[#141312]"
                    : "bg-[#282522] text-stone-500"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3" /> : step}
              </span>
              <Icon className="w-3.5 h-3.5 hidden sm:inline" />
              <span>{label}</span>
            </button>
            {step < 4 && <div className="w-4 sm:w-8 h-[1px] bg-[#2e2b26]" />}
          </div>
        );
      })}
    </div>
  );
}
