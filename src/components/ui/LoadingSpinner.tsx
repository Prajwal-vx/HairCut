import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export function LoadingSpinner({ size = "md", className = "", message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`border-[#c5a880] border-t-transparent rounded-full animate-spin ${sizeClasses[size]} ${className}`} />
      {message && <p className="text-xs text-stone-400 font-medium">{message}</p>}
    </div>
  );
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingSpinner size="md" className="mx-auto mb-3" />
        <p className="text-[#78716c] text-sm">{message}</p>
      </div>
    </div>
  );
}
