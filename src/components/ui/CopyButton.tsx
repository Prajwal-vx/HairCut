"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const copy = async () => {
    setError(false);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        let succeeded = false;
        try {
          textarea.select();
          succeeded = document.execCommand("copy");
        } finally {
          textarea.remove();
        }
        if (!succeeded) throw new Error("Copy command was rejected");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
      setError(true);
      window.setTimeout(() => setError(false), 3000);
    }
  };
  return <span className="inline-flex flex-col items-start gap-1"><button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-[#2e2b26] px-2.5 py-1.5 text-xs text-[#a8a29e] transition-colors hover:border-[#c5a880] hover:text-[#c5a880]" aria-label={`${label} ${value}`} aria-live="polite">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : error ? "Copy failed" : label}</button>{error && <span role="status" className="text-[11px] text-[#f29a7e]">Could not copy. Please select the text and copy it manually.</span>}</span>;
}
