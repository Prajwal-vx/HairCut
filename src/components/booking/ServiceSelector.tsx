"use client";

import React from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
            <Card
              key={service.id}
              hoverable
              onClick={() => onSelectService(service)}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-[#c5a880] bg-[#c5a880]/10 shadow-lg shadow-[#c5a880]/10"
                  : ""
              }`}
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-[#2e2b26]">
                  <Image
                    fill
                    sizes="80px"
                    src={service.image}
                    alt={service.name}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white text-base truncate">{service.name}</h4>
                    {service.popular && <Badge variant="gold">Popular</Badge>}
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}
