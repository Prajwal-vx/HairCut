"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "green" | "red" | "stone" | "blue";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "gold",
  size = "sm",
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-[#c5a880]/15 text-[#c5a880] border-[#c5a880]/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    stone: "bg-stone-800 text-stone-300 border-stone-700",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  }[variant];

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
