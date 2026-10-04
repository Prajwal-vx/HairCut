"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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

type Notification = {
  id: string;
  type: string;
  status: string;
  message: string;
  sentAt: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (user) {
      fetch("/api/notifications", { credentials: "include" })
        .then((r) => r.json())
        .then((d) => setNotifications(d.notifications || []));
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => n.status !== "read").length;

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0d0c0b]/95 backdrop-blur-xl border-b border-[#2e2b26]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c5a880]/60 bg-[#c5a880] transform group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-black/20">
                <img src={salonBrand.logoSrc} alt={`${salonBrand.name} logo`} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-white font-display text-base sm:text-lg font-semibold tracking-wide leading-tight block">
                  {salonBrand.name}
                </span>
                <p className="text-[#c5a880] text-xs tracking-wide">{salonBrand.location}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#e0d8cd] hover:text-[#c5a880] text-sm font-medium transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden lg:flex items-center gap-4">
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
                              <p className="text-[#78716c] text-sm p-4">No notifications yet.</p>
                            ) : (
                              notifications.slice(0, 6).map((n) => (
                                <div key={n.id} className={`px-4 py-3 border-b border-[#2e2b26]/50 hover:bg-[#2e2b26]/30 transition-colors ${n.status !== "read" ? "bg-[#c5a880]/5" : ""}`}>
                                  {n.type === "35_day_reminder" && (
                                    <span className="inline-block text-[10px] bg-[#c86d51]/20 text-[#c86d51] px-2 py-0.5 rounded-full mb-1 font-semibold uppercase tracking-wide">
                                      Time for a Trim 💈
                                    </span>
                                  )}
                                  <p className="text-[#e0d8cd] text-xs leading-relaxed">{n.message}</p>
                                  <p className="text-[#78716c] text-[10px] mt-1">{new Date(n.sentAt).toLocaleDateString()}</p>
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
                      <div className="w-7 h-7 rounded-full bg-[#c5a880] overflow-hidden flex items-center justify-center">
                        {user.profilePhotoUrl ? (
                          <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-[#141312]" />
                        )}
                      </div>
                      <span className="text-[#e0d8cd] text-sm font-medium">{user.fullName.split(" ")[0]}</span>
                      {user.styleStreak > 0 && (
                        <span className="text-xs">🔥{user.styleStreak}</span>
                      )}
                      <ChevronDown className="w-3 h-3 text-[#78716c]" />
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
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-[#e0d8cd] hover:bg-[#2e2b26]/40 text-sm transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <User className="w-4 h-4" /> My Dashboard
                          </Link>
                          <Link href="/book" className="flex items-center gap-3 px-4 py-3 text-[#e0d8cd] hover:bg-[#2e2b26]/40 text-sm transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <Scissors className="w-4 h-4" /> Book Appointment
                          </Link>
                          {(user.role === "ADMIN" || user.role === "OWNER") && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[#c5a880] hover:bg-[#2e2b26]/40 text-sm transition-colors" onClick={() => setUserMenuOpen(false)}>
                              {user.role === "OWNER" ? "👑 Owner Studio" : "⚙️ Admin Panel"}
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
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
                  className="text-sm text-[#e0d8cd] hover:text-[#c5a880] font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/book"
                className="bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#c5a880]/25"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#2e2b26]"
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
              className="lg:hidden overflow-hidden bg-[#141312] border-t border-[#2e2b26]"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-[#e0d8cd] hover:text-[#c5a880] font-medium py-1 transition-colors" onClick={() => setIsOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-[#2e2b26] space-y-3">
                  {user ? (
                    <>
                      {(user.role === "ADMIN" || user.role === "OWNER") && (
                        <Link href="/admin" className="block text-[#c5a880] font-medium py-1" onClick={() => setIsOpen(false)}>
                          {user.role === "OWNER" ? "👑 Owner Studio" : "⚙️ Admin Panel"}
                        </Link>
                      )}
                      <Link href="/dashboard" className="block text-[#c5a880] font-medium py-1" onClick={() => setIsOpen(false)}>My Dashboard 🔥 {user.styleStreak}</Link>
                      <button onClick={() => { logout(); setIsOpen(false); }} className="text-[#c86d51] text-sm">Sign Out</button>
                    </>
                  ) : (
                    <Link href="/auth" className="block text-[#e0d8cd] font-medium py-1" onClick={() => setIsOpen(false)}>Sign In</Link>
                  )}
                  <Link href="/book" className="block bg-[#c5a880] text-[#141312] px-5 py-3 rounded-lg text-center font-semibold" onClick={() => setIsOpen(false)}>
                    Book Now 💈
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
