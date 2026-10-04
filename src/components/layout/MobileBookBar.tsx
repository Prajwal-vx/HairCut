"use client";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function MobileBookBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-[#0d0c0b]/95 backdrop-blur-xl border-t border-[#2e2b26] px-4 py-3 pb-safe">
        <Link
          href="/book"
          className="flex items-center justify-center gap-3 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-[#c5a880]/20"
        >
          <Scissors className="w-5 h-5" />
          Book Your Appointment
        </Link>
      </div>
    </div>
  );
}