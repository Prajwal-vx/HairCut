"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Page rendering failed", error);
  }, [error]);

  return (
    <main className="min-h-screen grid place-items-center bg-[#0d0c0b] px-4 py-20 text-center">
      <div className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c5a880]">Something went wrong</p>
        <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">We could not load this page.</h1>
        <p className="mt-4 text-[#a8a29e]">Please try again. If you were submitting a change, check whether it was saved before submitting again.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="rounded-xl bg-[#c5a880] px-5 py-3 font-semibold text-[#141312] hover:bg-[#d4b898]">Try again</button>
          <Link href="/" className="rounded-xl border border-[#57534e] px-5 py-3 font-semibold text-white hover:border-[#c5a880]">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
