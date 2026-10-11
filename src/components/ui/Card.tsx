"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "bordered";
  hoverable?: boolean;
}

export function Card({
  children,
  variant = "glass",
  hoverable = false,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    glass: "glass-card bg-[#141312]/80 backdrop-blur-md border border-[#2e2b26]",
    solid: "bg-[#141312] border border-[#2e2b26]",
    bordered: "bg-transparent border border-[#2e2b26]/80",
  }[variant];

  const hoverStyles = hoverable
    ? "transition-all duration-300 hover:border-[#c5a880]/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c5a880]/5"
    : "";

  return (
    <div
      className={`rounded-2xl p-6 ${variantStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
