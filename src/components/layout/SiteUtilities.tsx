"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageProgressBar } from "@/components/ui/ProgressBar";

const searchItems = [
  { label: "Home", href: "/", keywords: "welcome salon uptown" },
  { label: "Services & pricing", href: "/services", keywords: "haircut beard color treatment price" },
  { label: "Style diagnostic", href: "/consultation", keywords: "consultation hair advice" },
  { label: "Stylists", href: "/stylists", keywords: "barber team staff" },
  { label: "Gallery", href: "/gallery", keywords: "photos lookbook hairstyles" },
  { label: "Book an appointment", href: "/book", keywords: "reservation schedule visit" },
  { label: "Contact us", href: "/contact", keywords: "phone address directions message" },
  { label: "About Uptown Hair", href: "/about", keywords: "salon story location" },
  { label: "Privacy policy", href: "/privacy", keywords: "data privacy cookies" },
  { label: "Terms of use", href: "/terms", keywords: "terms rules conditions" },
];

const CONSENT_KEY = "uptown-cookie-consent";
const CONSENT_EVENT = "uptown-cookie-consent";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent"><div className="h-full bg-gradient-to-r from-[#c5a880] to-[#c86d51] transition-[width] duration-150" style={{ width: `${progress}%` }} /></div>;
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <AnimatePresence>{visible && <motion.button type="button" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#c5a880]/40 bg-[#1a1816]/95 text-[#c5a880] shadow-xl backdrop-blur hover:bg-[#c5a880] hover:text-[#141312] transition-colors"><ArrowUp className="h-5 w-5" /></motion.button>}</AnimatePresence>;
}

export function FloatingContact() {
  return <Link href="/contact" aria-label="Contact Uptown Hair" className="fixed bottom-6 left-5 z-40 flex items-center gap-2 rounded-full bg-[#c86d51] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-[#c86d51]/20 transition-all hover:-translate-y-1 hover:bg-[#df8064]"><MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">Need help?</span></Link>;
}

export function CookieBanner() {
  const [consent, setConsent] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setConsent(localStorage.getItem(CONSENT_KEY));
    const reopen = () => setConsent(null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("uptown:open-cookie-settings", reopen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("uptown:open-cookie-settings", reopen);
    };
  }, []);
  const choose = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };
  return <AnimatePresence>{consent === null && <motion.aside role="region" aria-label="Cookie preferences" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-[#c5a880]/25 bg-[#1a1816]/95 p-5 shadow-2xl backdrop-blur-xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-white">Cookie preferences</h2><p className="mt-1 text-xs leading-relaxed text-[#a8a29e]">Essential cookies keep sign-in working. Optional analytics run only if you allow them. <Link className="text-[#c5a880] underline" href="/privacy">Privacy details</Link>.</p></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={() => choose("accepted")} className="rounded-lg bg-[#c5a880] px-4 py-2 text-xs font-semibold text-[#141312] transition-colors hover:bg-[#dfc8a8]">Allow analytics</button><button type="button" onClick={() => choose("rejected")} className="rounded-lg border border-[#2e2b26] px-4 py-2 text-xs text-[#e0d8cd] transition-colors hover:border-[#c5a880]">Essential only</button></div></div></motion.aside>}</AnimatePresence>;
}

export function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("uptown:open-cookie-settings"))} className="text-[#78716c] hover:text-[#c5a880] text-xs transition-colors">Cookie preferences</button>;
}

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); } if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { const openSearch = () => setOpen(true); window.addEventListener("uptown:open-search", openSearch); return () => window.removeEventListener("uptown:open-search", openSearch); }, []);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return searchItems.filter(({ label, keywords }) => `${label} ${keywords}`.toLowerCase().includes(term));
  }, [query]);
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/75 px-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}><motion.div role="dialog" aria-modal="true" aria-label="Site search" className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#c5a880]/30 bg-[#141312] shadow-2xl" initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onMouseDown={(e) => e.stopPropagation()}><div className="flex items-center gap-3 border-b border-[#2e2b26] p-4"><Search className="h-5 w-5 text-[#c5a880]" /><input autoFocus type="search" role="combobox" aria-label="Search pages" aria-controls="site-search-results" aria-expanded="true" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages, services, or topics..." className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-[#78716c]" /><button type="button" onClick={() => setOpen(false)} aria-label="Close search"><X className="h-5 w-5 text-[#78716c] hover:text-white" /></button></div><div id="site-search-results" className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="Search results">{results.length ? results.map(({ label, href }) => <Link key={href} role="option" aria-selected="false" href={href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-[#e0d8cd] transition-colors hover:bg-[#c5a880]/10 hover:text-[#c5a880]">{label}</Link>) : <p className="p-4 text-sm text-[#78716c]">No matching pages found.</p>}</div><p className="border-t border-[#2e2b26] px-4 py-3 text-[11px] text-[#78716c]">Press <kbd className="rounded border border-[#2e2b26] px-1.5 py-0.5">Esc</kbd> to close · <kbd className="rounded border border-[#2e2b26] px-1.5 py-0.5">Ctrl K</kbd> to search</p></motion.div></motion.div>}</AnimatePresence>;
}

export function UTMTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    const values = Object.fromEntries(keys.filter((key) => params.get(key)).map((key) => [key, params.get(key)]));
    if (Object.keys(values).length && !sessionStorage.getItem("uptown-utm")) sessionStorage.setItem("uptown-utm", JSON.stringify({ ...values, landingPage: window.location.pathname, capturedAt: new Date().toISOString() }));
  }, []);
  return null;
}

function ConsentAwareAnalytics() {
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  useEffect(() => {
    if (!analyticsId) return;
    const syncAnalytics = () => {
      const scriptId = "uptown-google-analytics";
      const allowed = localStorage.getItem(CONSENT_KEY) === "accepted";
      if (!allowed) {
        document.getElementById(scriptId)?.remove();
        return;
      }
      if (document.getElementById(scriptId)) return;
      const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      w.gtag = w.gtag || ((...args: unknown[]) => w.dataLayer?.push(args));
      w.gtag("js", new Date());
      w.gtag("config", analyticsId);
      const campaign = sessionStorage.getItem("uptown-utm");
      if (campaign && !sessionStorage.getItem("uptown-utm-event-sent")) {
        try {
          w.gtag("event", "campaign_visit", JSON.parse(campaign));
          sessionStorage.setItem("uptown-utm-event-sent", "1");
        } catch {
          sessionStorage.removeItem("uptown-utm");
        }
      }
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
      document.head.appendChild(script);
    };
    syncAnalytics();
    window.addEventListener(CONSENT_EVENT, syncAnalytics);
    return () => window.removeEventListener(CONSENT_EVENT, syncAnalytics);
  }, [analyticsId]);
  return null;
}

export default function SiteUtilities() {
  return <><PageProgressBar /><ScrollProgress /><SiteSearch /><CookieBanner /><BackToTop /><FloatingContact /><UTMTracker /><ConsentAwareAnalytics /></>;
}
