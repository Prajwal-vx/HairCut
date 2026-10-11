"use client";

import React from "react";
import { Camera, SkipForward, Shield, ArrowRight } from "lucide-react";

interface DiscoverStepPhotoProps {
  photoUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkip: () => void;
  onContinue: () => void;
}

export function DiscoverStepPhoto({
  photoUrl,
  fileInputRef,
  onPhotoChange,
  onSkip,
  onContinue,
}: DiscoverStepPhotoProps) {
  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
          Add a photo for better suggestions
        </h2>
        <p className="text-xs sm:text-sm text-[#a09080] mt-1">
          Optional — we can still suggest great styles without one.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Upload photo */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-[#2e2b26] hover:border-[#c5a880] bg-[#1a1816]/40 hover:bg-[#c5a880]/5 transition-all duration-200 group"
        >
          {photoUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Uploaded preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#c5a880]"
              />
              <span className="text-sm text-[#c5a880] font-medium">Change photo</span>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-[#c5a880]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">Upload a photo</p>
                <p className="text-xs text-[#8c827a] mt-0.5">JPG, PNG up to 5 MB</p>
              </div>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPhotoChange}
        />

        {/* Skip */}
        <button
          type="button"
          onClick={onSkip}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-[#2e2b26] bg-[#1a1816]/40 hover:border-[#3e3a34] hover:bg-[#1f1d1a]/80 transition-all duration-200"
        >
          <div className="w-14 h-14 rounded-full bg-[#1e1c19] border border-[#2e2b26] flex items-center justify-center">
            <SkipForward className="w-6 h-6 text-[#a09080]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#e0d8cd]">Skip — answer questions instead</p>
            <p className="text-xs text-[#8c827a] mt-0.5">No photo needed</p>
          </div>
        </button>
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-xs text-[#6e665e] bg-[#1a1816] border border-[#2e2b26] rounded-lg px-4 py-3">
        <Shield className="w-4 h-4 text-[#c5a880] shrink-0" />
        <span>Your photo stays on your device — it is never uploaded to our servers.</span>
      </div>

      {photoUrl && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
