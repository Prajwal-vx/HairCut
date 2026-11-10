"use client";
import { useState, useEffect, useSyncExternalStore, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X, Scissors, Bell, User, ChevronDown, LogOut, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { salonBrand } from "@/lib/branding";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/consultation", label: "Style Diagnostic" },
  { href: "/stylists", label: "Stylists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const homeNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/stylists", label: "Stylists" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ showAnnouncement = false }: { showAnnouncement?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lightMode = useSyncExternalStore((onChange) => { window.addEventListener("uptown-theme-change", onChange); return () => window.removeEventListener("uptown-theme-change", onChange); }, () => localStorage.getItem("uptown-theme") === "light", () => false);
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const visibleNavLinks = showAnnouncement ? homeNavLinks : navLinks;

  useEffect(() => {
    let frame = 0;
    const handler = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        frame = 0;
      });
    };
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isOpen) menuButtonRef.current?.focus();
        setIsOpen(false);
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, [isOpen]);
  useEffect(() => {
    document.documentElement.dataset.theme = lightMode ? "light" : "dark";
  }, [lightMode]);

  const toggleTheme = () => {
    const next = !lightMode;
    document.documentElement.dataset.theme = next ? "light" : "dark";
    localStorage.setItem("uptown-theme", next ? "light" : "dark");
    window.dispatchEvent(new Event("uptown-theme-change"));
  };

  const openSearch = () => {
    setIsOpen(false);
    window.dispatchEvent(new Event("uptown:open-search"));
  };

  return (
    <>
      {showAnnouncement && (
        <div className="fixed inset-x-0 top-0 z-[60] h-9 border-b border-[#c5a880]/20 bg-[#17130f]/95 px-4 backdrop-blur-md">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-3 sm:justify-between">
            <p className="hidden text-xs font-medium tracking-wide text-[#b7aa9c] sm:block">A little time for yourself, right here in Birtamode</p>
            <span className="text-xs font-medium tracking-wide text-[#b7aa9c] sm:hidden">Your style, your way · Birtamode</span>
            <Link href="/book" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.1em] text-[#dfc8a8] transition-colors hover:text-white">
              Book your visit <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
      <motion.header
        initial={reduceMotion ? false : { y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed ${showAnnouncement ? "top-9" : "top-0"} left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0d0c0b]/95 backdrop-blur-xl border-b border-[#2e2b26]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c5a880]/60 bg-[#c5a880] transform group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-black/20">
                <Image src={salonBrand.logoSrc} alt={`${salonBrand.name} logo`} width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block max-w-[10.5rem] truncate whitespace-nowrap font-display text-base font-semibold leading-tight tracking-wide text-white sm:max-w-none sm:text-lg">
                  {showAnnouncement ? "Uptown Hair" : salonBrand.name}
                </span>
                <p className="hidden text-xs tracking-wide text-[#c5a880] sm:block">{salonBrand.location}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav aria-label="Main navigation" className={`hidden xl:flex ${showAnnouncement ? "items-center gap-4 2xl:gap-6" : "items-center gap-5 2xl:gap-8"}`}>
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`relative text-[#f3efe6] hover:text-[#c5a880] ${showAnnouncement ? "text-xs" : "text-sm"} font-medium transition-colors duration-200 tracking-wide after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#c5a880] after:transition-transform aria-[current=page]:text-[#dfc8a8] aria-[current=page]:after:scale-x-100`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className={`hidden xl:flex ${showAnnouncement ? "items-center gap-2 2xl:gap-3" : "items-center gap-3 2xl:gap-4"}`}>
              <button type="button" onClick={openSearch} aria-label="Search site" className="flex items-center gap-2 rounded-lg border border-[#2e2b26] p-2 xl:px-3 xl:py-2 text-[#a09080] transition-colors hover:border-[#c5a880] hover:text-[#c5a880]"><Search className="h-4 w-4" /><span className={showAnnouncement ? "hidden xl:inline text-xs" : "text-xs"}>Search</span><kbd className="hidden 2xl:inline rounded border border-[#2e2b26] px-1 text-[10px]">?K</kbd></button>
              <button type="button" onClick={toggleTheme} aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2e2b26] text-[#a09080] transition-colors hover:border-[#c5a880] hover:text-[#c5a880]">{lightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
              {user ? (
                <>
                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      aria-label="Open notifications"
                      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[#2e2b26] hover:border-[#c5a880] transition-colors"
                    >
                      <Bell className="w-4 h-4 text-[#a09080]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c86d51] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 top-12 w-80 bg-[#1a1816] border border-[#2e2b26] rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-[#2e2b26]">
                            <p className="text-white font-semibold text-sm">Notifications</p>
                          </div>
                          <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="text-[#a99c8e] text-sm p-4">No notifications yet.</p>
                            ) : (
                              notifications.slice(0, 6).map((n) => (
                                <div key={n.id} className={`px-4 py-3 border-b border-[#2e2b26]/50 hover:bg-[#2e2b26]/30 transition-colors ${n.status !== "read" ? "bg-[#c5a880]/5" : ""}`}>
                                  {n.type === "35_day_reminder" && (
                                    <span className="inline-block text-[10px] bg-[#c86d51]/20 text-[#c86d51] px-2 py-0.5 rounded-full mb-1 font-semibold uppercase tracking-wide">
                                      Time for a Trim 💈
                                    </span>
                                  )}
                                  {(n.type === "booking_request" || n.type === "booking_request_received") && (
                                    <span className="mb-1 inline-block rounded-full border border-amber-700/40 bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                                      {n.type === "booking_request" ? "New booking request" : "Awaiting confirmation"}
                                    </span>
                                  )}
                                  {n.type === "booking_request_cancelled" && (
                                    <span className="mb-1 inline-block rounded-full bg-[#2e2b26] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#b7aa9c]">Request cancelled</span>
                                  )}
                                  {n.type === "booking_confirmed" && (
                                    <span className="mb-1 inline-block rounded-full bg-[#c5a880]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c5a880]">Appointment confirmed</span>
                                  )}
                                  {n.type === "booking_declined" && (
                                    <span className="mb-1 inline-block rounded-full bg-red-950/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">Appointment update</span>
                                  )}
                                  <p className="text-[#f3efe6] text-xs leading-relaxed">{n.message}</p>
                                  <p className="text-[#a99c8e] text-[10px] mt-1">{new Date(n.sentAt).toLocaleDateString()}</p>
                                </div>
                              ))
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <Link href="/dashboard" className="block px-4 py-3 text-[#c5a880] text-xs font-medium hover:bg-[#2e2b26]/30 text-center">
                              View all in Dashboard →
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-label="Open account menu"
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[#2e2b26] hover:border-[#c5a880] transition-colors"
                    >
                      <div className="relative w-7 h-7 rounded-full bg-[#c5a880] overflow-hidden flex items-center justify-center">
                        {user.profilePhotoUrl ? (
                          <Image src={user.profilePhotoUrl} alt={`${user.fullName} profile photo`} width={28} height={28} unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-[#141312]" />
                        )}
                      </div>
                      <span className="text-[#f3efe6] text-sm font-medium">{user.fullName.split(" ")[0]}</span>
                      {user.styleStreak > 0 && (
                        <span className="text-xs">🔥{user.styleStreak}</span>
                      )}
                      <ChevronDown className="w-3 h-3 text-[#a99c8e]" />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute right-0 top-12 w-56 bg-[#1a1816] border border-[#2e2b26] rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-[#2e2b26]">
                            <p className="text-white font-semibold text-sm">{user.fullName}</p>
                            <p className="text-[#c5a880] text-xs">⭐ {user.loyaltyPoints} points</p>
                          </div>
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#f3efe6] hover:bg-[#2e2b26]/40 text-sm transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <User className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link href="/book" className="flex items-center gap-3 px-4 py-3 text-[#f3efe6] hover:bg-[#2e2b26]/40 text-sm transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Scissors className="w-4 h-4" /> Book Appointment
                          </Link>
                          {(user.role === "ADMIN" || user.role === "OWNER") && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[#c5a880] hover:bg-[#2e2b26]/40 text-sm transition-colors" onClick={() => setUserMenuOpen(false)}>
                              {user.role === "OWNER" ? "👑 Owner Studio" : "⚙️ Admin Panel"}
                            </Link>
                          )}
                          <button
                            onClick={async () => { setUserMenuOpen(false); await logout(); router.push("/auth"); }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[#c86d51] hover:bg-[#2e2b26]/40 text-sm transition-colors border-t border-[#2e2b26]"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-sm text-[#f3efe6] hover:text-[#c5a880] font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/book"
                className="bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-3 xl:px-5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#c5a880]/25 whitespace-nowrap"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              ref={menuButtonRef}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="xl:hidden flex h-11 w-11 items-center justify-center rounded-lg border border-[#3d3932]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden overflow-hidden bg-[#141312] border-t border-[#2e2b26]"
              id="mobile-navigation"
            >
              <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto px-4 py-4 pb-safe">
                <div className="flex gap-2">
                  <button type="button" onClick={openSearch} className="flex min-h-11 flex-1 items-center gap-2 rounded-lg border border-[#2e2b26] px-3 py-2 text-sm text-[#f3efe6]"><Search className="h-4 w-4" /> Search site</button>
                  <button type="button" onClick={toggleTheme} aria-label="Toggle color theme" className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#2e2b26] text-[#c5a880]">{lightMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
                </div>
                <nav aria-label="Main navigation" className="mt-4 space-y-1">
                  {visibleNavLinks.map((link) => (
                    <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className="flex min-h-11 items-center rounded-lg px-3 font-medium text-[#f3efe6] transition-colors hover:bg-white/5 hover:text-[#c5a880] aria-[current=page]:bg-[#c5a880]/10 aria-[current=page]:text-[#dfc8a8]" onClick={() => setIsOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-3 space-y-1 border-t border-[#2e2b26] pt-3">
                  {user ? (
                    <>
                      {(user.role === "ADMIN" || user.role === "OWNER") && (
                        <Link href="/admin" className="flex min-h-11 items-center px-3 font-medium text-[#c5a880]" onClick={() => setIsOpen(false)}>
                          {user.role === "OWNER" ? "👑 Owner Studio" : "⚙️ Admin Panel"}
                        </Link>
                      )}
                      <Link href="/dashboard" className="flex min-h-11 items-center px-3 font-medium text-[#c5a880]" onClick={() => setIsOpen(false)}>My Dashboard 🔥 {user.styleStreak}</Link>
                      <button type="button" onClick={async () => { setIsOpen(false); await logout(); router.push("/auth"); }} className="min-h-11 px-3 text-sm text-[#c86d51]">Sign Out</button>
                    </>
                  ) : (
                    <Link href="/auth" className="flex min-h-11 items-center px-3 font-medium text-[#f3efe6]" onClick={() => setIsOpen(false)}>Sign In</Link>
                  )}
                  <Link href="/book" className="mt-2 flex min-h-12 items-center justify-center rounded-lg bg-[#c5a880] px-5 py-3 text-center font-semibold text-[#141312]" onClick={() => setIsOpen(false)}>
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Close dropdowns on outside click */}
      {(userMenuOpen || notifOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserMenuOpen(false); setNotifOpen(false); }} />
      )}
    </>
  );
}
