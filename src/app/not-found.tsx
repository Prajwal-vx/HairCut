import Link from "next/link";
import { Home, Scissors } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center bg-[#0d0c0b] px-4 py-20 text-center">
      <div className="max-w-lg">
        <Scissors className="mx-auto mb-6 h-10 w-10 text-[#c5a880]" aria-hidden="true" />
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#c5a880]">404 · Page not found</p>
        <h1 className="mt-4 font-display text-5xl text-white sm:text-6xl">This page took a wrong turn.</h1>
        <p className="mt-4 text-[#a8a29e]">The page may have moved, or the address may be incorrect.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#c5a880] px-5 py-3 font-semibold text-[#141312] hover:bg-[#d4b898]"><Home className="h-4 w-4" />Back to home</Link>
      </div>
    </main>
  );
}
