"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export function OptionCard<T extends string>({
  id,
  selected,
  onSelect,
  icon,
  label,
  description,
}: {
  id: T;
  selected: T;
  onSelect: (v: T) => void;
  icon: string;
  label: string;
  description?: string;
}) {
  const active = selected === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 ${
        active
          ? "border-[#c5a880] bg-[#c5a880]/10 shadow-lg shadow-[#c5a880]/10"
          : "border-[#2e2b26] bg-[#1a1816]/60 hover:border-[#3e3a34] hover:bg-[#1f1d1a]/80"
      }`}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span className={`font-semibold text-sm mt-1 ${active ? "text-white" : "text-[#e0d8cd]"}`}>
        {label}
      </span>
      {description && (
        <span className="text-[11px] text-[#8c827a] leading-relaxed">{description}</span>
      )}
      {active && (
        <CheckCircle2 className="w-4 h-4 text-[#c5a880] mt-1 self-end" />
      )}
    </button>
  );
}
