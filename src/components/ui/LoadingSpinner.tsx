import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div className={`border-[#c5a880] border-t-transparent rounded-full animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-[#78716c] text-sm">Loading...</p>
      </div>
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
