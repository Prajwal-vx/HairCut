"use client";

import React from "react";
import Image from "next/image";
import { Check, Clock, Scissors } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/lib/types";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectService: (srv: Service) => void;
}

export function ServiceSelector({
  services,
  selectedService,
  categories,
  activeCategory,
  onSelectCategory,
  onSelectService,
}: ServiceSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            aria-pressed={activeCategory === cat}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-[#c5a880] text-[#141312] font-semibold shadow-md shadow-[#c5a880]/10"
                : "bg-[#1e1c19] text-stone-400 hover:text-white hover:bg-[#282522] border border-[#2e2b26]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${service.name}, ${formatCurrency(service.price)}, ${service.durationMinutes} minutes${service.popular ? ", popular" : ""}`}
              onClick={() => onSelectService(service)}
              className={`group w-full rounded-2xl p-5 text-left bg-[#141312]/80 backdrop-blur-sm border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c5a880]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfc8a8] ${
                isSelected
                  ? "border-[#c5a880] bg-[#c5a880]/10 shadow-lg shadow-[#c5a880]/10"
                  : "border-[#2e2b26] hover:border-[#c5a880]/40"
              }`}
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-[#2e2b26]">
                  <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#30251c] to-[#171411] text-[#c5a880]/70" aria-hidden="true"><Scissors className="w-6 h-6" /></span>
                  <Image
                    fill
                    sizes="80px"
                    src={service.image}
                    alt={service.name}
                    className="object-cover"
                    onError={(event) => { event.currentTarget.style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-white text-base truncate block">{service.name}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      {service.popular && <Badge variant="gold">Popular</Badge>}
                      {isSelected && <span aria-hidden="true" className="w-5 h-5 rounded-full bg-[#c5a880] text-[#141312] flex items-center justify-center"><Check className="w-3 h-3" /></span>}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2e2b26]/60">
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                      {service.durationMinutes} mins
                    </span>
                    <span className="text-sm font-bold text-[#c5a880]">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
