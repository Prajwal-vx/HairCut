"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

export function ConfirmationModal({ open, title, message, onClose }: { open: boolean; title: string; message: string; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><div className="w-full max-w-sm rounded-2xl border border-[#c5a880]/30 bg-[#141312] p-6 text-center shadow-2xl"><button type="button" onClick={onClose} aria-label="Close confirmation" className="float-right text-[#78716c] hover:text-white"><X className="h-5 w-5" /></button><CheckCircle2 className="mx-auto mt-3 h-12 w-12 text-emerald-400" /><h2 id="confirmation-title" className="mt-4 text-xl font-semibold text-white">{title}</h2><p className="mt-2 text-sm leading-relaxed text-[#a8a29e]">{message}</p><button type="button" onClick={onClose} className="mt-6 rounded-xl bg-[#c5a880] px-5 py-2.5 text-sm font-semibold text-[#141312] transition-colors hover:bg-[#dfc8a8]">Done</button></div></div>;
}
