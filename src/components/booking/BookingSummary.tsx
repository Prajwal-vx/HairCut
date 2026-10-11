"use client";

import React from "react";
import { Scissors, User, Calendar, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { Service, Stylist } from "@/lib/types";

interface BookingSummaryProps {
  service: Service;
  stylist: Stylist | "any";
  date: string;
  time: string;
  notes: string;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function BookingSummary({
  service,
  stylist,
  date,
  time,
  notes,
  submitting,
  onSubmit,
  onBack,
}: BookingSummaryProps) {
  const stylistName = stylist === "any" ? "Any Available Master Barber" : stylist.name;

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <Card className="space-y-4">
        <h4 className="text-lg font-semibold text-white border-b border-[#2e2b26] pb-3">
          Review Your Appointment
        </h4>

        <div className="space-y-3 text-sm">
          <div className="flex items-start justify-between">
            <span className="flex items-center gap-2 text-stone-400">
              <Scissors className="w-4 h-4 text-[#c5a880]" />
              Service
            </span>
            <div className="text-right">
              <span className="font-semibold text-white block">{service.name}</span>
              <span className="text-xs text-stone-400">{service.durationMinutes} minutes</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-stone-400">
              <User className="w-4 h-4 text-[#c5a880]" />
              Stylist
            </span>
            <span className="font-medium text-white">{stylistName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-stone-400">
              <Calendar className="w-4 h-4 text-[#c5a880]" />
              Date
            </span>
            <span className="font-medium text-white">{date}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-stone-400">
              <Clock className="w-4 h-4 text-[#c5a880]" />
              Time
            </span>
            <span className="font-medium text-white">{time}</span>
          </div>

          {notes && (
            <div className="pt-2 border-t border-[#2e2b26]/50">
              <span className="text-xs text-stone-400 block mb-1">Notes:</span>
              <p className="text-xs text-stone-300 italic bg-[#1e1c19] p-2.5 rounded-lg">
                &ldquo;{notes}&rdquo;
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-[#2e2b26] flex items-center justify-between">
            <span className="font-semibold text-white">Total Service Fee</span>
            <span className="text-xl font-bold text-[#c5a880]">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={submitting}
          className="flex-1"
        >
          Modify
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSubmit}
          loading={submitting}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="flex-1"
        >
          Confirm Reservation
        </Button>
      </div>
    </div>
  );
}
