"use client";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function MobileBookBar() {
  return (
    <div className="mobile-book-bar fixed inset-x-0 bottom-0 z-40 xl:hidden">
      <div className="border-t border-[#2e2b26] bg-[#0d0c0b]/95 px-4 pt-2 backdrop-blur-md pb-safe">
        <Link
          href="/book"
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#c5a880] py-3 text-base font-bold text-[#141312] transition-colors duration-200 hover:bg-[#d4b898]"
        >
          <Scissors className="w-5 h-5" />
          Book Your Appointment
        </Link>
      </div>
    </div>
  );
}
