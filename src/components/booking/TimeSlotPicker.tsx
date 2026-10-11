"use client";

import React from "react";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { TIME_SLOTS } from "@/constants/salon";
import { Card } from "@/components/ui/Card";

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  minDate: string;
  notes: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onChangeNotes: (notes: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedTime,
  minDate,
  notes,
  onSelectDate,
  onSelectTime,
  onChangeNotes,
}: TimeSlotPickerProps) {
  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#c5a880]" />
          <h4 className="text-sm font-semibold text-white">Select Appointment Date</h4>
        </div>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          className="w-full bg-[#1e1c19] border border-[#2e2b26] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c5a880] transition-colors"
        />
      </Card>

      {/* Time Slot Grid */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[#c5a880]" />
          <h4 className="text-sm font-semibold text-white">Select Time Slot</h4>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot;

            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelectTime(slot)}
                className={`py-2 px-1 text-xs font-medium rounded-xl border transition-all text-center ${
                  isSelected
                    ? "bg-[#c5a880] text-[#141312] border-[#c5a880] font-semibold shadow-md shadow-[#c5a880]/15"
                    : "bg-[#1e1c19] text-stone-300 border-[#2e2b26] hover:border-[#c5a880]/40 hover:text-white"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Special Requests */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-[#c5a880]" />
          <h4 className="text-sm font-semibold text-white">Special Requests or Preferences (Optional)</h4>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="E.g., Low fade on sides, keeping the top natural, scalp sensitivity..."
          className="w-full bg-[#1e1c19] border border-[#2e2b26] rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#c5a880] transition-colors placeholder:text-stone-600 resize-none"
        />
        <div className="text-right text-[11px] text-stone-500 mt-1">
          {notes.length}/500
        </div>
      </Card>
    </div>
  );
}
