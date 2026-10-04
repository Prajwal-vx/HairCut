import React from "react";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-[#2e2b26] rounded w-3/4" />
        <div className="h-4 bg-[#2e2b26] rounded w-1/2" />
        <div className="h-20 bg-[#141312] rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#141312] border border-[#2e2b26] rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-[#2e2b26] rounded w-1/3 mb-2" />
          <div className="h-3 bg-[#2e2b26] rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
