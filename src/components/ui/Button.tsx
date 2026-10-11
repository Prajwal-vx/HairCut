"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2.5 rounded-2xl",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#c5a880] to-[#b3956d] text-[#141312] font-semibold hover:brightness-105 shadow-md shadow-[#c5a880]/10",
    secondary:
      "bg-[#1e1c19] text-[#e7e5e4] hover:bg-[#282522] border border-[#2e2b26]",
    outline:
      "border border-[#c5a880]/40 text-[#c5a880] hover:bg-[#c5a880]/10 hover:border-[#c5a880]",
    ghost:
      "text-stone-400 hover:text-white hover:bg-white/5",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={size === "sm" ? "sm" : "md"} className="text-current" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
