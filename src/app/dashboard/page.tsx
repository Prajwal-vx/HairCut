"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scissors, Calendar, Gift, Bell, Share2, LogOut, Award, CheckCircle, Sparkles, Shield, TrendingUp, FileText, ChevronRight, Clock3, ArrowUpRight, MapPin, RefreshCw, Pencil, Camera, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency, getDaysSince, calculateStreakInfo, getUserBadges } from "@/lib/utils";
import type { Appointment, NotificationLog } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";

function DashboardContent() {
  const { user, logout, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [copied, setCopied] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [photoProcessing, setPhotoProcessing] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "", birthday: "", gender: "prefer-not-to-say", preferredChannel: "whatsapp", profilePhotoUrl: "" });
  const toast = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const refresh = () => Promise.all([
      fetch("/api/appointments", { credentials: "include" }).then((response) => {
        if (!response.ok) throw new Error("Appointments could not be loaded.");
        return response.json();
      }),
      fetch("/api/notifications", { credentials: "include" }).then((response) => {
        if (!response.ok) throw new Error("Notifications could not be loaded.");
        return response.json();
      }),
    ]).then(([apts, notifs]) => {
      if (cancelled) return;
      setAppointments(apts.appointments || []);
      setNotifications(notifs.notifications || []);
      setLoadFailed(false);
    }).catch(() => {
      if (!cancelled) setLoadFailed(true);
    }).finally(() => {
      if (!cancelled) setDataLoading(false);
    });
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 15000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [user]);

  const copyReferral = async () => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(
        `Join Uptown Hair, Birtamode with my referral code ${user.referralCode} and get 25 bonus loyalty points on your first appointment!`
      );
      setCopied(true);
      toast.success("Referral message copied. Share it with a friend.", "Copied");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Clipboard access is unavailable in this browser. You can copy your code manually.", "Couldn’t copy code");
    }
  };

  if (loading || !user) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  const upcoming = appointments.filter((a) => a.status === "upcoming");
  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const activeAppointments = [...pendingAppointments, ...upcoming].sort((a, b) => `${a.visitDate} ${a.timeSlot}`.localeCompare(`${b.visitDate} ${b.timeSlot}`));
  const completed = appointments.filter((a) => a.status === "completed");
  const appointmentHistory = appointments
    .filter((appointment) => appointment.status !== "pending" && appointment.status !== "upcoming")
    .sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  const activeStreak = user.lastVisitDate ? user.styleStreak || 0 : 0;
  const streakInfo = calculateStreakInfo(activeStreak, user.lastVisitDate);
  const badges = getUserBadges(activeStreak, completed.length);
  const daysSince = getDaysSince(user.lastVisitDate);

  const cancelBooking = async () => {
    if (!cancelTarget) return;
    setCanceling(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appointmentId: cancelTarget.id, status: "cancelled" }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        toast.error(result?.error || "Please try again in a moment.", "Couldn’t cancel appointment");
        return;
      }
      setAppointments((current) => current.map((appointment) => appointment.id === cancelTarget.id ? { ...appointment, status: "cancelled" } : appointment));
      toast.success("Your appointment has been cancelled.", "Appointment cancelled");
      setCancelTarget(null);
    } catch {
      toast.error("Check your connection and try again.", "Couldn’t cancel appointment");
    } finally {
      setCanceling(false);
    }
  };

  const unreadNotifications = notifications.filter((notification) => notification.status !== "read").length;

  const openProfileEditor = () => {
    setProfileForm({ fullName: user.fullName, phone: user.phone, birthday: user.birthday || "", gender: user.gender || "prefer-not-to-say", preferredChannel: user.preferredChannel || "whatsapp", profilePhotoUrl: user.profilePhotoUrl || "" });
    setPhotoChanged(false);
    setProfileOpen(true);
  };

  const chooseProfilePhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      toast.error("Choose a JPEG, PNG, or WebP image under 10 MB.", "Photo not accepted");
      return;
    }
    setPhotoProcessing(true);
    try {
      const image = await createImageBitmap(file);
      const scale = Math.min(1, 640 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image preview is unavailable.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();
      const compressed = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Photo could not be prepared.")), "image/jpeg", 0.78));
      if (compressed.size > 300 * 1024) throw new Error("This photo is still too large after compression. Choose a smaller image.");
      const reader = new FileReader();
      const photoData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Photo could not be read."));
        reader.onerror = () => reject(new Error("Photo could not be read."));
        reader.readAsDataURL(compressed);
      });
      setProfileForm((form) => ({ ...form, profilePhotoUrl: photoData }));
      setPhotoChanged(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Try another image.", "Photo could not be added");
    } finally {
      setPhotoProcessing(false);
    }
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...profileForm, ...(photoChanged ? { profilePhotoUrl: profileForm.profilePhotoUrl || null } : { profilePhotoUrl: undefined }) }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Please check your details and try again.", "Profile not saved");
        return;
      }
      await refreshUser();
      toast.success("Your account details have been updated.", "Profile saved");
      setProfileOpen(false);
    } catch {
      toast.error("Check your connection and try again.", "Profile not saved");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <main className="min-h-screen pb-24 lg:pb-0">
      <section className="px-4 pb-16 pt-28 sm:pt-32">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="relative mb-6 overflow-hidden rounded-2xl border border-[#493e30] bg-[linear-gradient(115deg,#211b14_0%,#151310_65%,#20170f_100%)] p-5 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-[#c5a880]/10 sm:-right-8 sm:-top-36 sm:h-96 sm:w-96" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#c5a880]/60 bg-[#2b241b] sm:h-[4.5rem] sm:w-[4.5rem]">
                {user.profilePhotoUrl ? (
                    <Image src={user.profilePhotoUrl} alt={`${user.fullName} profile photo`} fill unoptimized sizes="72px" className="object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-[#dfc8a8]">
                      {user.fullName.trim().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#d0b58a]">Your Uptown account</p>
                  <h1 className="mt-1 truncate text-3xl font-medium leading-tight text-white sm:text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Welcome, {user.fullName.split(" ")[0]}
                </h1>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#b7aa9c]"><MapPin className="h-3.5 w-3.5 text-[#c5a880]" />Your visits, bookings, and style profile in one place</p>
                  <p className="mt-1 truncate text-[11px] text-[#8f8579]">{user.email}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#8f8579]"><RefreshCw className="h-3 w-3" />Account updates automatically while this page is open</p>
                  {loadFailed && <p role="status" className="mt-2 text-xs text-amber-300">Couldn’t refresh your latest activity. We’ll try again shortly.</p>}
                  {!dataLoading && !loadFailed && <p className="sr-only" aria-live="polite">Account activity is up to date.</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <button type="button" onClick={openProfileEditor} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#51483e] px-3 py-2.5 text-sm text-[#dfc8a8] transition-colors hover:border-[#c5a880] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfc8a8]"><Pencil className="h-3.5 w-3.5" /><span>Edit profile</span></button>
                <Link href="/book" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#c5a880] px-4 py-2.5 text-sm font-semibold text-[#141312] transition-colors hover:bg-[#dfc8a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfc8a8] sm:flex-none">
                  <Scissors className="h-4 w-4" /> Book a visit
                </Link>
                {(user.role === "ADMIN" || user.role === "OWNER" || user.isAdmin) && (
                  <Link href="/admin" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#51483e] px-4 py-2.5 text-sm text-[#dfc8a8] transition-colors hover:border-[#c5a880]">Admin portal</Link>
                )}
                <button type="button" aria-label="Sign out" title="Sign out" onClick={async () => { await logout(); router.push("/auth"); }} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#51483e] text-[#b7aa9c] transition-colors hover:border-red-400/60 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfc8a8]">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </FadeIn>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Your account summary">
            <div className="glass-card flex items-center gap-4 rounded-xl p-4 sm:p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#c5a880]/20 bg-[#c5a880]/10 text-[#dfc8a8]"><Sparkles className="h-5 w-5" /></span>
              <div><p className="text-xs text-[#a99c8e]">Loyalty points</p><p className="mt-0.5 text-2xl font-semibold leading-none text-white">{user.loyaltyPoints}<span className="ml-1.5 text-xs font-normal text-[#a99c8e]">pts</span></p></div>
            </div>
            <div className="glass-card flex items-center gap-4 rounded-xl p-4 sm:p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#c86d51]/20 bg-[#c86d51]/10 text-[#e39378]"><span aria-hidden="true" className="text-xl">🔥</span></span>
              <div><p className="text-xs text-[#a99c8e]">Visit streak</p><p className="mt-0.5 text-2xl font-semibold leading-none text-white">{activeStreak}<span className="ml-1.5 text-xs font-normal text-[#a99c8e]">visits</span></p></div>
            </div>
            <div className="glass-card flex items-center gap-4 rounded-xl p-4 sm:p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-800/30 bg-emerald-950/30 text-emerald-300"><CheckCircle className="h-5 w-5" /></span>
              <div><p className="text-xs text-[#a99c8e]">Completed visits</p><p className="mt-0.5 text-2xl font-semibold leading-none text-white">{completed.length}</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
            <div className="space-y-5 lg:col-span-2 lg:space-y-6">
              {streakInfo.isWindowActive && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-xl border border-[#c86d51]/35 bg-[#c86d51]/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex items-start gap-3"><span aria-hidden="true" className="text-2xl">💈</span><div><p className="text-sm font-semibold text-[#f0d0c0]">Your visit streak is active</p><p className="mt-1 text-xs leading-relaxed text-[#d69a85]">{daysSince} days since your last visit. Book within {streakInfo.daysRemainingInWindow} days to keep it going.</p></div></div>
                  <Link href="/book" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[#c86d51] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#d47a5e]">Find a time</Link>
                </motion.div>
              )}

              {/* Loyalty progress */}
              <FadeIn>
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Client rewards</p><h2 className="mt-1 text-xl font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your next visit perk</h2></div>
                    <span className="rounded-lg border border-[#c5a880]/20 bg-[#c5a880]/10 p-2.5 text-[#dfc8a8]"><Gift className="h-5 w-5" /></span>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-xs text-[#a99c8e]">Progress</p><p className="mt-1 text-sm font-medium text-[#f3efe6]">{4 - streakInfo.visitsToNextPerk} of 4 visits</p></div><span className="text-sm font-semibold text-[#dfc8a8]">{streakInfo.nextPerkTitle}</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#2e2b26]" role="progressbar" aria-label="Progress toward your next visit perk" aria-valuemin={0} aria-valuemax={4} aria-valuenow={4 - streakInfo.visitsToNextPerk}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((4 - streakInfo.visitsToNextPerk) / 4) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-[#c5a880]" />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#2e2b26] pt-4 text-xs"><span className="text-[#a99c8e]">Last salon visit</span><span className="text-[#e0d8cd]">{user.lastVisitDate ? `${daysSince} days ago` : "Not yet visited"}</span></div>
                </div>
              </FadeIn>

              {/* Upcoming Appointments */}
              <FadeIn delay={0.1}>
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Your schedule</p><h2 className="mt-1 text-xl font-semibold text-white">Appointments</h2></div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end"><span className="text-xs text-[#a99c8e]">{pendingAppointments.length} awaiting confirmation · {upcoming.length} confirmed</span><Link href="/book" className="inline-flex min-h-9 items-center gap-1 rounded-md border border-[#806b4e] px-3 py-2 text-xs font-semibold text-[#dfc8a8] transition-colors hover:border-[#c5a880]"><Scissors className="h-3.5 w-3.5" /> Book</Link></div>
                  </div>
                  {dataLoading ? (
                    <div role="status" className="space-y-3 py-2"><span className="sr-only">Loading appointments</span>{[0, 1].map((item) => <div key={item} className="h-[5.5rem] animate-pulse rounded-lg border border-[#2e2b26] bg-[#141312]" />)}</div>
                  ) : loadFailed && activeAppointments.length === 0 ? (
                    <p role="status" className="rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-6 text-center text-sm text-amber-200">We couldn’t load your appointments just now. This page will try again automatically.</p>
                  ) : activeAppointments.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#3b352c] px-5 py-9 text-center">
                      <Calendar className="mx-auto mb-3 h-8 w-8 text-[#756b5e]" />
                      <p className="text-sm font-medium text-[#e0d8cd]">Nothing scheduled yet</p>
                      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#a99c8e]">Choose a service and request a time. The salon will confirm your appointment in this account.</p>
                      <Link href="/book" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#c5a880] px-4 py-2 text-xs font-semibold text-[#141312] hover:bg-[#dfc8a8]">Browse available times <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeAppointments.map((apt) => (
                        <div key={apt.id} className={`rounded-lg border p-4 ${apt.status === "pending" ? "border-amber-800/50 bg-amber-950/15" : "border-[#3b352c] bg-[#141312]/80"}`}>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${apt.status === "pending" ? "border-amber-700/40 bg-amber-950/40 text-amber-300" : "border-[#c5a880]/20 bg-[#c5a880]/10 text-[#c5a880]"}`}>
                                {apt.status === "pending" ? <Clock3 className="h-4 w-4" /> : <Scissors className="h-4 w-4" />}
                              </div>
                              <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{apt.serviceName || "Salon service"}</p><p className="mt-1 text-xs text-[#c9beb1]">{apt.visitDate} · {apt.timeSlot}</p><p className="mt-1 text-xs text-[#8f8579]">Stylist: {apt.stylistName || "To be assigned"} · {formatCurrency(apt.amountPaid)} due at salon</p></div>
                            </div>
                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <span role="status" className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold ${apt.status === "pending" ? "border-amber-700/50 bg-amber-950/40 text-amber-200" : "border-[#c5a880]/30 bg-[#c5a880]/10 text-[#dfc8a8]"}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${apt.status === "pending" ? "bg-amber-300" : "bg-[#c5a880]"}`} />{apt.status === "pending" ? "Awaiting confirmation" : "Confirmed"}
                              </span>
                              <button type="button" onClick={() => setCancelTarget(apt)} className="min-h-9 rounded-md px-2 text-xs text-[#a99c8e] underline-offset-2 transition-colors hover:text-red-300 hover:underline">Cancel</button>
                            </div>
                          </div>
                          {apt.status === "pending" && <p className="ml-[3.25rem] mt-3 text-xs leading-relaxed text-amber-100/70">Your time is requested. We’ll update your account when the salon responds.</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Appointment history */}
              <FadeIn delay={0.15}>
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Your records</p><h2 className="mt-1 text-xl font-semibold text-white">Appointment history</h2>
                  <p className="mb-5 mt-1 text-xs text-[#a99c8e]">Completed, cancelled, and declined appointments.</p>

                  {dataLoading ? (
                    <div role="status" className="space-y-3 py-2"><span className="sr-only">Loading appointment history</span>{[0, 1].map((item) => <div key={item} className="h-12 animate-pulse rounded-md bg-[#141312]" />)}</div>
                  ) : loadFailed && appointmentHistory.length === 0 ? (
                    <p role="status" className="rounded-lg border border-amber-800/40 bg-amber-950/20 px-4 py-6 text-center text-sm text-amber-200">We couldn’t load your history. We’re retrying automatically.</p>
                  ) : appointmentHistory.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#3b352c] px-4 py-7 text-center"><p className="text-sm text-[#c9beb1]">Your past appointments will appear here.</p><p className="mt-1 text-xs text-[#8f8579]">Completed visits and any changes to a booking stay in your history.</p></div>
                  ) : (
                    <div className="divide-y divide-[#2e2b26]">
                      {appointmentHistory.map((apt) => (
                        <div key={apt.id} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                          <div><p className="text-sm font-medium text-[#f3efe6]">{apt.serviceName || "Salon service"}</p><p className="mt-1 text-xs text-[#a99c8e]">{apt.visitDate} · {apt.timeSlot} · {apt.stylistName || "Stylist not recorded"}</p></div>
                          <div className="flex items-center justify-between gap-3 sm:justify-end"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${apt.status === "completed" ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-300" : apt.status === "declined" || apt.status === "cancelled" ? "border-[#51483e] bg-[#1a1816] text-[#b7aa9c]" : "border-[#51483e] bg-[#1a1816] text-[#a99c8e]"}`}>{apt.status === "completed" ? "Completed" : apt.status === "declined" ? "Declined by salon" : apt.status === "cancelled" ? "Cancelled" : "No-show"}</span><span className="text-xs font-semibold text-[#dfc8a8]">{formatCurrency(apt.amountPaid)}</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Quick Actions - Hair Profile */}
              <FadeIn delay={0.05}>
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Personal style</p><h2 className="mb-4 mt-1 flex items-center gap-2 text-xl font-semibold text-white">
                    <Sparkles className="h-4 w-4 text-[#c5a880]" /> Your hair profile
                  </h2>
                  <div className="space-y-3">
                    <Link href="/passport" className="flex items-center gap-3 p-3 rounded-xl bg-[#141312] border border-[#2e2b26] hover:border-[#c5a880] transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c5a880]/20 transition-colors">
                        <Shield className="w-5 h-5 text-[#c5a880]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">Hair Passport</p>
                        <p className="text-[#78716c] text-xs">Your style preferences</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#78716c] group-hover:text-[#c5a880] transition-colors" />
                    </Link>
                    <Link href="/style-dna" className="flex items-center gap-3 p-3 rounded-xl bg-[#141312] border border-[#2e2b26] hover:border-[#c5a880] transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c5a880]/20 transition-colors">
                        <TrendingUp className="w-5 h-5 text-[#c5a880]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">Style DNA</p>
                        <p className="text-[#78716c] text-xs">Your style preferences</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#78716c] group-hover:text-[#c5a880] transition-colors" />
                    </Link>
                    <Link href="/barber-brief" className="flex items-center gap-3 p-3 rounded-xl bg-[#141312] border border-[#2e2b26] hover:border-[#c5a880] transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#c5a880]/20 transition-colors">
                        <FileText className="w-5 h-5 text-[#c5a880]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">Barber Brief</p>
                        <p className="text-[#78716c] text-xs">Show your stylist</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#78716c] group-hover:text-[#c5a880] transition-colors" />
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {/* In-App Notifications Center */}
              <FadeIn delay={0.05}>
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Updates</p><h2 className="mt-1 flex items-center gap-2 text-xl font-semibold text-white">
                      <Bell className="h-4 w-4 text-[#c5a880]" /> Notifications
                    </h2></div>
                    {unreadNotifications > 0 && <span className="rounded-full border border-[#c5a880]/30 bg-[#c5a880]/10 px-2.5 py-1 text-[10px] font-semibold text-[#dfc8a8]">{unreadNotifications} new</span>}
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-[#78716c] text-xs py-4 text-center">No notifications yet.</p>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {notifications.slice(0, 6).map((n) => (
                        <div key={n.id} className={`rounded-lg border p-3 ${n.status !== "read" ? "border-[#806b4e]/60 bg-[#c5a880]/[.04]" : "border-[#2e2b26] bg-[#141312]"}`}>
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
                          {n.type === "booking_request_received" && (
                            <span className="text-[10px] bg-amber-950/50 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase block w-fit mb-1">Awaiting salon confirmation</span>
                          )}
                          {n.type === "booking_declined" && (
                            <span className="text-[10px] bg-red-950/50 text-red-300 px-2 py-0.5 rounded-full font-bold uppercase block w-fit mb-1">Request update</span>
                          )}
                          <p className="text-[#d0c8be] text-xs leading-relaxed">{n.message}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#8f8579]"><Clock3 className="h-3 w-3" />{new Date(n.sentAt).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Milestone Badges */}
              <FadeIn delay={0.1}>
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Milestones</p><h2 className="mb-4 mt-1 flex items-center gap-2 text-xl font-semibold text-white">
                    <Award className="h-4 w-4 text-[#c5a880]" /> Visit badges
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
                <div className="glass-card rounded-xl p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#c5a880]">Invite a friend</p><h2 className="mb-2 mt-1 flex items-center gap-2 text-xl font-semibold text-white">
                    <Gift className="h-4 w-4 text-[#c5a880]" /> Referral rewards
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
                      type="button"
                      onClick={() => void copyReferral()}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#51483e] px-3 py-2 text-xs font-medium text-[#dfc8a8] transition-colors hover:border-[#c5a880] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dfc8a8]"
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
      <Modal
        isOpen={profileOpen}
        onClose={() => { if (!profileSaving) setProfileOpen(false); }}
        title="Your profile"
        description="Update your photo, contact details, and salon updates. Your email is used to sign in and can’t be changed here."
        maxWidth="md"
      >
        <form onSubmit={(event) => void saveProfile(event)} className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-[#3b352c] bg-[#141312] p-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#c5a880]/50 bg-[#2b241b] text-xl font-semibold text-[#dfc8a8]">
              {profileForm.profilePhotoUrl ? <Image src={profileForm.profilePhotoUrl} alt="Profile photo preview" fill sizes="64px" unoptimized className="object-cover" /> : user.fullName.trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">Profile photo</p>
              <p className="mt-1 text-xs leading-relaxed text-[#8f8579]">JPEG, PNG, or WebP · up to 10 MB. We’ll resize it before saving.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <label className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#51483e] px-3 py-2 text-xs font-medium text-[#dfc8a8] transition-colors hover:border-[#c5a880] ${photoProcessing ? "pointer-events-none opacity-60" : ""}`}>
                  <Camera className="h-3.5 w-3.5" />{photoProcessing ? "Preparing photo…" : profileForm.profilePhotoUrl ? "Change photo" : "Upload photo"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload profile photo" disabled={photoProcessing || profileSaving} onChange={(event) => { void chooseProfilePhoto(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                </label>
                {profileForm.profilePhotoUrl && <button type="button" disabled={profileSaving || photoProcessing} onClick={() => { setProfileForm((form) => ({ ...form, profilePhotoUrl: "" })); setPhotoChanged(true); }} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 py-2 text-xs text-[#a99c8e] hover:text-red-300 disabled:opacity-50"><X className="h-3.5 w-3.5" />Remove</button>}
              </div>
            </div>
          </div>
          <label className="block text-sm text-[#d0c5b9]">Full name <span className="text-red-300" aria-hidden="true">*</span>
            <input required maxLength={100} autoComplete="name" value={profileForm.fullName} onChange={(event) => setProfileForm((form) => ({ ...form, fullName: event.target.value }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#51483e] bg-[#141312] px-3 py-2 text-sm text-white outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20" />
          </label>
          <label className="block text-sm text-[#d0c5b9]">Phone number <span className="text-red-300" aria-hidden="true">*</span>
            <input required type="tel" maxLength={32} autoComplete="tel" value={profileForm.phone} onChange={(event) => setProfileForm((form) => ({ ...form, phone: event.target.value }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#51483e] bg-[#141312] px-3 py-2 text-sm text-white outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20" />
          </label>
          <div className="rounded-lg border border-[#3b352c] bg-[#141312] px-3 py-2.5"><p className="text-xs text-[#8f8579]">Sign-in email</p><p className="mt-1 break-all text-sm text-[#d0c5b9]">{user.email}</p></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-[#d0c5b9]">Birthday <span className="text-xs text-[#8f8579]">(optional)</span>
              <input type="date" max={new Date().toISOString().slice(0, 10)} value={profileForm.birthday} onChange={(event) => setProfileForm((form) => ({ ...form, birthday: event.target.value }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#51483e] bg-[#141312] px-3 py-2 text-sm text-white outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20" />
            </label>
            <label className="block text-sm text-[#d0c5b9]">Gender <span className="text-xs text-[#8f8579]">(optional)</span>
              <select value={profileForm.gender} onChange={(event) => setProfileForm((form) => ({ ...form, gender: event.target.value }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#51483e] bg-[#141312] px-3 py-2 text-sm text-white outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20"><option value="prefer-not-to-say">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option></select>
            </label>
          </div>
          <label className="block text-sm text-[#d0c5b9]">Appointment updates
            <select value={profileForm.preferredChannel} onChange={(event) => setProfileForm((form) => ({ ...form, preferredChannel: event.target.value }))} className="mt-1.5 min-h-11 w-full rounded-lg border border-[#51483e] bg-[#141312] px-3 py-2 text-sm text-white outline-none focus:border-[#c5a880] focus:ring-2 focus:ring-[#c5a880]/20"><option value="whatsapp">WhatsApp</option><option value="sms">SMS</option><option value="email">Email</option><option value="app">In-app</option></select>
          </label>
          <div className="flex flex-col-reverse gap-2 border-t border-[#3b352c] pt-4 sm:flex-row sm:justify-end">
            <button type="button" disabled={profileSaving} onClick={() => setProfileOpen(false)} className="min-h-11 rounded-lg border border-[#51483e] px-4 py-2 text-sm text-[#d0c5b9] hover:border-[#c5a880] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={profileSaving || photoProcessing} className="min-h-11 rounded-lg bg-[#c5a880] px-4 py-2 text-sm font-semibold text-[#141312] transition-colors hover:bg-[#dfc8a8] disabled:cursor-wait disabled:opacity-60">{profileSaving ? "Saving…" : "Save profile"}</button>
          </div>
        </form>
      </Modal>
      <Modal
        isOpen={Boolean(cancelTarget)}
        onClose={() => { if (!canceling) setCancelTarget(null); }}
        title="Cancel this appointment?"
        description="You can request a new time afterward. The salon will be notified."
        maxWidth="sm"
      >
        {cancelTarget && <div>
          <div className="rounded-lg border border-[#3b352c] bg-[#1a1816] p-4">
            <p className="text-sm font-semibold text-white">{cancelTarget.serviceName || "Salon service"}</p>
            <p className="mt-1 text-xs text-[#b7aa9c]">{cancelTarget.visitDate} · {cancelTarget.timeSlot} · {cancelTarget.stylistName || "Stylist"}</p>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" disabled={canceling} onClick={() => setCancelTarget(null)} className="min-h-10 rounded-lg border border-[#51483e] px-4 py-2 text-sm text-[#d0c5b9] hover:border-[#c5a880] disabled:opacity-50">Keep appointment</button>
            <button type="button" disabled={canceling} onClick={() => void cancelBooking()} className="min-h-10 rounded-lg bg-red-900/70 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50">{canceling ? "Cancelling…" : "Cancel appointment"}</button>
          </div>
        </div>}
      </Modal>
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
