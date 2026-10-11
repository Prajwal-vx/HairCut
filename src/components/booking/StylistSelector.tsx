"use client";

import React from "react";
import { Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Stylist } from "@/lib/types";

interface StylistSelectorProps {
  stylists: Stylist[];
  selectedStylist: Stylist | "any" | null;
  onSelectStylist: (stylist: Stylist | "any") => void;
}

export function StylistSelector({
  stylists,
  selectedStylist,
  onSelectStylist,
}: StylistSelectorProps) {
  const isAnySelected = selectedStylist === "any";

  return (
    <div className="space-y-4">
      {/* Any Available Stylist option */}
      <Card
        hoverable
        onClick={() => onSelectStylist("any")}
        className={`cursor-pointer transition-all ${
          isAnySelected ? "border-[#c5a880] bg-[#c5a880]/10 shadow-lg shadow-[#c5a880]/10" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#c5a880]" />
          </div>
          <div>
            <h4 className="font-semibold text-white">Any Available Master Barber</h4>
            <p className="text-xs text-stone-400 mt-0.5">
              We&apos;ll automatically assign the first available skilled stylist for your selected time.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stylists
          .filter((s) => s.active)
          .map((stylist) => {
            const isSelected =
              selectedStylist !== "any" && selectedStylist?.id === stylist.id;

            return (
              <Card
                key={stylist.id}
                hoverable
                onClick={() => onSelectStylist(stylist)}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#c5a880] bg-[#c5a880]/10 shadow-lg shadow-[#c5a880]/10"
                    : ""
                }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#2e2b26]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stylist.photoUrl}
                      alt={stylist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white truncate">{stylist.name}</h4>
                      <span className="flex items-center gap-1 text-xs text-[#c5a880]">
                        <Star className="w-3.5 h-3.5 fill-[#c5a880]" />
                        {stylist.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#c5a880] mt-0.5">{stylist.specialty}</p>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">{stylist.bio}</p>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
