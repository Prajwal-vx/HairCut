"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scissors, Calendar, Gift, Bell, Share2, LogOut, Award, CheckCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, getDaysSince, calculateStreakInfo, getUserBadges } from "@/lib/utils";
import type { Appointment, NotificationLog } from "@/lib/types";

function DashboardContent() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/appointments", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/notifications", { credentials: "include" }).then((r) => r.json()),
    ]).then(([apts, notifs]) => {
      setAppointments(apts.appointments || []);
      setNotifications(notifs.notifications || []);
    });
  }, [user]);

  const copyReferral = () => {
    if (!user) return;
    navigator.clipboard?.writeText(
      `Join Unisex Haircut, Birtamode with my referral code ${user.referralCode} and get 25 bonus loyalty points on your first appointment!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const completed = appointments.filter((a) => a.status === "completed");
  const streakInfo = calculateStreakInfo(user.styleStreak || 0, user.lastVisitDate);
  const badges = getUserBadges(user.styleStreak || 0, completed.length);
  const daysSince = getDaysSince(user.lastVisitDate);

  return (
    <main className="min-h-screen pb-24 lg:pb-0">
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c5a880]">
                {user.profilePhotoUrl ? (
                  <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-2xl font-bold">
                    {user.fullName[0]}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[#78716c] text-sm">Client Portal</p>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {user.fullName}
                </h1>
                <p className="text-[#c5a880] text-xs">
                  🔥 Style Streak: {user.styleStreak || 0} · ⭐ {user.loyaltyPoints} Loyalty Points
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/book"
                className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#d4b898] transition-colors"
              >
                <Scissors className="w-4 h-4" /> Book Appointment
              </Link>
              {(user.role === "ADMIN" || user.role === "OWNER" || user.isAdmin) && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 border border-[#c5a880] text-[#c5a880] px-4 py-2.5 rounded-xl text-sm hover:bg-[#c5a880]/10 transition-colors"
                >
                  {user.role === "OWNER" ? "Owner Studio" : "Admin Panel"}
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="flex items-center gap-2 border border-[#2e2b26] text-[#78716c] px-4 py-2.5 rounded-xl text-sm hover:border-[#c86d51] hover:text-[#c86d51] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLUMNS */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reminder Banner if 35-40 days */}
              {streakInfo.isWindowActive && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#c86d51]/15 border border-[#c86d51]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">💈</span>
                    <div>
                      <p className="text-[#f0d0c0] font-bold text-base">Time for a Fresh Look!</p>
                      <p className="text-[#c86d51] text-sm mt-0.5">
                        It has been {daysSince} days since your last cut at Unisex Haircut. Book within {streakInfo.daysRemainingInWindow} days to keep your Style Streak alive!
                      </p>
                    </div>
                  </div>
                  <Link href="/book" className="flex-shrink-0 bg-[#c86d51] hover:bg-[#d47a5e] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Book Now
                  </Link>
                </motion.div>
              )}

              {/* Style Streak & Loyalty Card */}
              <FadeIn>
                <div className="glass-card rounded-2xl p-6 bg-streak-glow">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs text-[#c86d51] font-semibold uppercase tracking-wider">Gamified Grooming</span>
                      <h2 className="text-xl font-bold text-white mt-1">Style Streak Tracker</h2>
                    </div>
                    <span className="flame-animated text-3xl">🔥</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-[#141312] p-4 rounded-xl border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs">Current Streak</p>
                      <p className="text-white text-3xl font-bold mt-1 flex items-center justify-center gap-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {user.styleStreak || 0} <span className="text-xl">🔥</span>
                      </p>
                    </div>
                    <div className="bg-[#141312] p-4 rounded-xl border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs">Loyalty Points</p>
                      <p className="text-[#c5a880] text-3xl font-bold mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {user.loyaltyPoints}
                      </p>
                    </div>
                    <div className="bg-[#141312] p-4 rounded-xl border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs">Last Haircut</p>
                      <p className="text-[#e0d8cd] text-sm font-semibold mt-2">
                        {user.lastVisitDate ? `${daysSince} days ago` : "No visits yet"}
                      </p>
                    </div>
                  </div>

                  {/* Progress to next 4th-visit perk */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#78716c] mb-2">
                      <span className="text-[#e0d8cd]">Progress to 4th Visit Perk</span>
                      <span className="text-[#c5a880]">{4 - streakInfo.visitsToNextPerk}/4 visits</span>
                    </div>
                    <div className="h-2.5 bg-[#141312] rounded-full overflow-hidden border border-[#2e2b26]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((4 - streakInfo.visitsToNextPerk) / 4) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, #c86d51, #c5a880)" }}
                      />
                    </div>
                  </div>
                  <p className="text-[#78716c] text-xs">
                    Next Perk: <span className="text-[#c5a880] font-medium">{streakInfo.nextPerkTitle}</span>
                  </p>
                </div>
              </FadeIn>

              {/* Upcoming Appointments */}
              <FadeIn delay={0.1}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">Upcoming Appointments</h2>
                    <Link href="/book" className="text-[#c5a880] text-xs hover:underline">+ New Appointment</Link>
                  </div>
                  {upcoming.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-[#2e2b26] mx-auto mb-3" />
                      <p className="text-[#78716c] text-sm">No upcoming appointments scheduled.</p>
                      <Link href="/book" className="mt-3 inline-block text-[#c5a880] text-sm hover:underline">
                        Book your next slot in 2 taps →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map((apt) => (
                        <div key={apt.id} className="bg-[#141312] border border-[#2e2b26] rounded-xl p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0">
                              <Scissors className="w-5 h-5 text-[#c5a880]" />
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{apt.serviceName}</p>
                              <p className="text-[#78716c] text-xs mt-0.5">
                                Stylist: {apt.stylistName} · {apt.visitDate} at {apt.timeSlot}
                              </p>
                            </div>
                          </div>
                          <span className="text-[#c5a880] text-xs font-semibold border border-[#c5a880]/30 px-3 py-1 rounded-full bg-[#c5a880]/10">
                            Upcoming
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Your Style Journey Timeline */}
              <FadeIn delay={0.15}>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-white mb-2">Your Style Journey</h2>
                  <p className="text-[#78716c] text-xs mb-6">Chronological timeline of past visits and services at Unisex Haircut.</p>

                  {completed.length === 0 ? (
                    <p className="text-[#78716c] text-sm py-4">
                      No past visits yet. Complete an appointment to start logging your style history!
                    </p>
                  ) : (
                    <div className="relative pl-6">
                      <div className="absolute left-2 top-2 bottom-2 w-px bg-[#2e2b26]" />
                      <div className="space-y-6">
                        {completed.map((apt) => (
                          <div key={apt.id} className="relative">
                            <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#c5a880] border-2 border-[#141312]" />
                            <div>
                              <div className="flex items-center justify-between">
                                <p className="text-white font-semibold text-sm">{apt.serviceName}</p>
                                <span className="text-[#c5a880] text-xs font-bold">{formatCurrency(apt.amountPaid)}</span>
                              </div>
                              <p className="text-[#78716c] text-xs mt-0.5">
                                {apt.visitDate} with {apt.stylistName}
                              </p>
                              {apt.notes && <p className="text-[#a0988e] text-xs italic mt-1">&quot;{apt.notes}&quot;</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* In-App Notifications Center */}
              <FadeIn delay={0.05}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#c5a880]" /> Notification Center
                    </h2>
                    <span className="text-[10px] text-[#78716c] uppercase">via {user.preferredChannel}</span>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-[#78716c] text-xs py-4 text-center">No notifications yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {notifications.slice(0, 6).map((n) => (
                        <div key={n.id} className="p-3 rounded-xl bg-[#141312] border border-[#2e2b26]">
                          {n.type === "35_day_reminder" && (
                            <span className="text-[10px] bg-[#c86d51]/20 text-[#c86d51] px-2 py-0.5 rounded-full font-bold uppercase block w-fit mb-1">
                              Time to Return 💈
                            </span>
                          )}
                          {n.type === "booking_confirmed" && (
                            <span className="text-[10px] bg-[#c5a880]/20 text-[#c5a880] px-2 py-0.5 rounded-full font-bold uppercase block w-fit mb-1">
                              Confirmed ✓
                            </span>
                          )}
                          <p className="text-[#d0c8be] text-xs leading-relaxed">{n.message}</p>
                          <p className="text-[#5a554e] text-[10px] mt-1">{new Date(n.sentAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Milestone Badges */}
              <FadeIn delay={0.1}>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#c5a880]" /> Grooming Badges
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((b) => (
                      <div
                        key={b.id}
                        className={`rounded-xl p-3 text-center border transition-all ${
                          b.unlocked
                            ? "bg-[#c5a880]/10 border-[#c5a880]/30"
                            : "bg-[#141312] border-[#2e2b26] opacity-40"
                        }`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <p className={`text-xs font-bold mt-1.5 leading-tight ${b.unlocked ? "text-[#c5a880]" : "text-[#78716c]"}`}>
                          {b.name}
                        </p>
                        <p className="text-[10px] text-[#78716c] mt-1 leading-tight">{b.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Referral Bonus */}
              <FadeIn delay={0.15}>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#c5a880]" /> Referral Rewards
                  </h2>
                  <p className="text-[#78716c] text-xs mb-4">
                    Share your code with friends. When they register and complete their first cut, you both earn bonus points!
                  </p>
                  <div className="bg-[#141312] border border-[#2e2b26] rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[#78716c] text-[10px]">Your Code</p>
                      <p className="text-[#c5a880] font-bold tracking-wider text-base">{user.referralCode}</p>
                    </div>
                    <button
                      onClick={copyReferral}
                      className="flex items-center gap-1.5 border border-[#2e2b26] hover:border-[#c5a880] text-[#c5a880] px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Share"}
                    </button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <MobileBookBar />
      <DashboardContent />
      <Footer />
    </>
  );
}