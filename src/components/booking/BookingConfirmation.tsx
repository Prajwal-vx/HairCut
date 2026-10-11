"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Calendar, Clock, User, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { ConfirmedAppointment } from "@/services/appointmentService";

interface BookingConfirmationProps {
  appointment: ConfirmedAppointment;
}

export function BookingConfirmation({ appointment }: BookingConfirmationProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 rounded-full bg-[#c5a880]/20 border-2 border-[#c5a880] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#c5a880]/15">
          <Check className="w-10 h-10 text-[#c5a880]" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Booking Confirmed!
        </h2>
        <p className="text-sm text-stone-400 mb-6">
          Your reservation is locked in. We look forward to giving you a crisp transformation at Uptown Hair Unisex Salon.
        </p>

        <Card className="text-left space-y-3 mb-6 bg-[#141312]">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-stone-400">
              <Scissors className="w-4 h-4 text-[#c5a880]" />
              Service
            </span>
            <span className="font-semibold text-white">{appointment.serviceName || "Service"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-stone-400">
              <User className="w-4 h-4 text-[#c5a880]" />
              Stylist
            </span>
            <span className="font-medium text-white">{appointment.stylistName || "Stylist"}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-stone-400">
              <Calendar className="w-4 h-4 text-[#c5a880]" />
              Date
            </span>
            <span className="font-medium text-white">{appointment.visitDate}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-stone-400">
              <Clock className="w-4 h-4 text-[#c5a880]" />
              Time
            </span>
            <span className="font-medium text-white">{appointment.timeSlot}</span>
          </div>

          <div className="pt-2 border-t border-[#2e2b26] flex items-center justify-between text-sm">
            <span className="text-stone-400">Fee Payable at Salon</span>
            <span className="font-bold text-[#c5a880]">{formatCurrency(appointment.amountPaid)}</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard" className="flex-1">
            <Button variant="primary" className="w-full">
              View in Dashboard
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
