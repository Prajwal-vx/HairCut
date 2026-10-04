"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Image as ImageIcon,
  Bell,
  BarChart3,
  Check,
  X,
  Trash2,
  Upload,
  Play,
  ArrowLeft,
  Sparkles,
  Eye,
  Crown,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import type { GalleryCategory } from "@/lib/types";

type AdminTab = "overview" | "appointments" | "clients" | "gallery" | "reminders";

interface ClientStat {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  styleStreak: number;
  lastVisitDate: string | null;
  visitCount: number;
}

interface DueClient {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  lastVisitDate: string;
  daysSince: number;
  styleStreak: number;
  preferredChannel: string;
}

interface StatsData {
  totalClients: number;
  totalAppointments: number;
  upcomingCount: number;
  completedCount: number;
  totalRevenue: number;
  repeatRate: number;
  topService: string;
  galleryCount: number;
  usersNeedingReminderCount: number;
  usersNeedingReminder: DueClient[];
  clients: ClientStat[];
}

interface AppointmentItem {
  id: string;
  userId: string;
  stylistId: string;
  serviceId: string;
  visitDate: string;
  timeSlot: string;
  status: "upcoming" | "completed" | "cancelled" | "no-show";
  notes?: string;
  amountPaid: number;
  serviceName?: string;
  stylistName?: string;
  userName?: string;
}

interface GalleryPhotoItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: GalleryCategory;
  uploadedByAdminId: string;
  likesCount: number;
  showOnHome?: boolean;
  displayOrder?: number;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
  createdAt: string;
}

interface ReminderDetail {
  userId: string;
  userName: string;
  daysSinceLastVisit: number;
  action: "sent" | "skipped_already_booked" | "skipped_already_sent" | "not_due";
  reason?: string;
}

interface ReminderResultData {
  totalUsersChecked: number;
  remindersSent: number;
  remindersSkippedAlreadyBooked: number;
  remindersSkippedAlreadySent: number;
  details: ReminderDetail[];
}

function AdminContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [gallery, setGallery] = useState<GalleryPhotoItem[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "home">("all");
  const [reminderResult, setReminderResult] = useState<ReminderResultData | null>(null);
  const [runningReminders, setRunningReminders] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    imageUrl: "",
    caption: "",
    category: "Haircut" as GalleryCategory,
    showOnHome: true,
    aspectRatio: "portrait" as "square" | "portrait" | "landscape" | "wide",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [updatingApt, setUpdatingApt] = useState<string | null>(null);
  const [togglingHomeId, setTogglingHomeId] = useState<string | null>(null);

  const isAuthorized = user && (user.role === "ADMIN" || user.role === "OWNER");
  const isOwner = user?.role === "OWNER";

  // Additional check: verify email is in admin whitelist for Google OAuth users
  const isAdminWhitelisted = user?.isAdmin === true;

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // ignore
    }
  }, []);

  const loadAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch {
      // ignore
    }
  }, []);

  const loadGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGallery(data.photos || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      // Check if user is authorized: either traditional auth with ADMIN/OWNER role
      // OR Google OAuth user with admin whitelist flag
      const authorized = isAuthorized || isAdminWhitelisted;
      if (!user) {
        router.push("/auth");
      } else if (!authorized) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, isAuthorized, isAdminWhitelisted, router]);

  useEffect(() => {
    if (isAuthorized || isAdminWhitelisted) {
      queueMicrotask(() => {
        void Promise.all([loadStats(), loadAppointments(), loadGallery()]);
      });
    }
  }, [isAuthorized, isAdminWhitelisted, loadStats, loadAppointments, loadGallery]);

  const updateAppointment = async (id: string, status: "upcoming" | "completed" | "cancelled" | "no-show") => {
    setUpdatingApt(id);
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ appointmentId: id, status }),
    });
    await loadAppointments();
    await loadStats();
    setUpdatingApt(null);
  };

  const toggleShowOnHome = async (photo: GalleryPhotoItem) => {
    setTogglingHomeId(photo.id);
    const newStatus = !photo.showOnHome;
    try {
      await fetch(`/api/gallery/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ showOnHome: newStatus }),
      });
      setGallery((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, showOnHome: newStatus } : p))
      );
    } catch {
      // ignore
    } finally {
      setTogglingHomeId(null);
    }
  };

  const runReminders = async () => {
    setRunningReminders(true);
    const res = await fetch("/api/cron/reminders", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setReminderResult(data.result);
    setRunningReminders(false);
    await loadStats();
  };

  const uploadPhoto = async () => {
    if (!photoForm.imageUrl || !photoForm.caption) return;
    setUploading(true);
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(photoForm),
    });
    if (res.ok) {
      setUploadSuccess(true);
      setPhotoForm({
        imageUrl: "",
        caption: "",
        category: "Haircut",
        showOnHome: true,
        aspectRatio: "portrait",
      });
      await loadGallery();
      setTimeout(() => setUploadSuccess(false), 3000);
    }
    setUploading(false);
  };

  const deletePhoto = async (id: string) => {
    await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await loadGallery();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized && !isAdminWhitelisted) return null;

  const homePhotosCount = gallery.filter((p) => p.showOnHome).length;
  const filteredGallery =
    galleryFilter === "home" ? gallery.filter((p) => p.showOnHome) : gallery;

  const tabItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "clients", label: "Clients", icon: Users },
    { id: "gallery", label: isOwner ? "Owner Lookbook Studio" : "Gallery Studio", icon: ImageIcon },
    { id: "reminders", label: "Reminder Engine", icon: Bell },
  ];

  return (
    <main className="min-h-screen pb-16">
      <section className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold tracking-[0.25em] uppercase px-3 py-1 rounded-full border ${
                    isOwner
                      ? "bg-[#c5a880]/20 text-[#c5a880] border-[#c5a880]/40"
                      : "bg-[#c86d51]/20 text-[#c86d51] border-[#c86d51]/40"
                  }`}
                >
                  {isOwner ? "👑 Salon Owner Control Center" : "⚙️ Salon Staff Administration"}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {isOwner ? "Owner Executive Portal" : "Salon Operations Dashboard"}
              </h1>
              <p className="text-[#8e8479] text-xs mt-1">
                Logged in as: <span className="text-white font-medium">{user.fullName}</span> ({user.email}) ·{" "}
                {isOwner ? "Full Owner Privileges & Homepage Lookbook Curation Enabled" : "Staff Operations"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 border border-[#2e2b26] text-[#b0a090] px-4 py-2 rounded-xl text-sm hover:border-[#c5a880] hover:text-[#c5a880] transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" /> View Public Site
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-1 bg-[#141312] rounded-xl p-1 mb-8 border border-[#2e2b26]">
            {tabItems.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  tab === t.id ? "bg-[#c5a880] text-[#141312] font-bold shadow-md" : "text-[#78716c] hover:text-[#e0d8cd]"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {tab === "overview" && stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Registered Clients", value: stats.totalClients, color: "#c5a880" },
                  { label: "Upcoming Appointments", value: stats.upcomingCount, color: "#c5a880" },
                  { label: "Completed Transformations", value: stats.completedCount, color: "#c5a880" },
                  { label: "Repeat Client Rate", value: `${stats.repeatRate}%`, color: "#c86d51" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-2xl p-5">
                    <p className="text-[#78716c] text-xs mb-1">{s.label}</p>
                    <p className="text-3xl font-bold" style={{ color: s.color, fontFamily: "'Cormorant Garamond', serif" }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-[#78716c] text-xs mb-1">Total Revenue Collected</p>
                  <p className="text-2xl font-bold text-[#c5a880]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-[#78716c] text-xs mb-1">Most Booked Service</p>
                  <p className="text-white font-semibold text-lg">{stats.topService}</p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-[#78716c] text-xs mb-1">Clients Due for 35-Day Reminder</p>
                  <p className="text-2xl font-bold text-[#c86d51]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {stats.usersNeedingReminderCount}
                  </p>
                  {stats.usersNeedingReminderCount > 0 && (
                    <button onClick={() => setTab("reminders")} className="text-[#c86d51] text-xs hover:underline mt-1 font-semibold">
                      Review & Run Scan →
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: APPOINTMENTS */}
          {tab === "appointments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">All Client Appointments</h2>
                <span className="text-xs text-[#78716c]">Only Staff & Owner can complete appointments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2e2b26]">
                      {["Client", "Service", "Stylist", "Date & Slot", "Amount", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-[#78716c] text-xs font-semibold uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-[#2e2b26]/50 hover:bg-[#1a1816]/50 transition-colors">
                        <td className="py-4 px-4 text-[#e0d8cd] text-sm font-medium">{apt.userName || "Client"}</td>
                        <td className="py-4 px-4 text-[#e0d8cd] text-sm">{apt.serviceName}</td>
                        <td className="py-4 px-4 text-[#e0d8cd] text-sm">{apt.stylistName}</td>
                        <td className="py-4 px-4 text-[#78716c] text-xs">
                          {apt.visitDate}<br />{apt.timeSlot}
                        </td>
                        <td className="py-4 px-4 text-[#c5a880] text-sm font-semibold">{formatCurrency(apt.amountPaid)}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                              apt.status === "upcoming"
                                ? "bg-[#c5a880]/20 text-[#c5a880]"
                                : apt.status === "completed"
                                ? "bg-green-950/60 text-green-400 border border-green-800/40"
                                : apt.status === "cancelled"
                                ? "bg-red-950/60 text-red-400 border border-red-800/40"
                                : "bg-[#78716c]/20 text-[#78716c]"
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {apt.status === "upcoming" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateAppointment(apt.id, "completed")}
                                disabled={updatingApt === apt.id}
                                className="flex items-center gap-1 text-green-400 border border-green-800 hover:bg-green-900/30 px-3 py-1 rounded-lg text-xs transition-all disabled:opacity-50 font-medium"
                              >
                                <Check className="w-3 h-3" /> Mark Completed
                              </button>
                              <button
                                onClick={() => updateAppointment(apt.id, "cancelled")}
                                disabled={updatingApt === apt.id}
                                className="flex items-center gap-1 text-red-400 border border-red-800 hover:bg-red-900/30 px-3 py-1 rounded-lg text-xs transition-all disabled:opacity-50"
                              >
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CLIENTS */}
          {tab === "clients" && stats?.clients && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Client Database</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2e2b26]">
                      {["Client Details", "Phone", "Completed Visits", "Style Streak", "Loyalty Points", "Last Visit"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-[#78716c] text-xs font-semibold uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.clients.map((c) => (
                      <tr key={c.id} className="border-b border-[#2e2b26]/50 hover:bg-[#1a1816]/50 transition-colors">
                        <td className="py-4 px-4">
                          <p className="text-[#e0d8cd] text-sm font-medium">{c.fullName}</p>
                          <p className="text-[#78716c] text-xs">{c.email}</p>
                        </td>
                        <td className="py-4 px-4 text-[#78716c] text-sm">{c.phone}</td>
                        <td className="py-4 px-4 text-[#e0d8cd] text-sm font-medium">{c.visitCount}</td>
                        <td className="py-4 px-4">
                          <span className="text-[#c86d51] font-bold text-sm">🔥 {c.styleStreak}</span>
                        </td>
                        <td className="py-4 px-4 text-[#c5a880] font-semibold text-sm">⭐ {c.loyaltyPoints}</td>
                        <td className="py-4 px-4 text-[#78716c] text-xs">
                          {c.lastVisitDate ? new Date(c.lastVisitDate).toLocaleDateString() : "Never"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: GALLERY STUDIO (OWNER & ADMIN CONTROL) */}
          {tab === "gallery" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Owner Feature Notice */}
              <div className="bg-[#181614] border border-[#c5a880]/30 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a880]/20 flex items-center justify-center flex-shrink-0 text-[#c5a880]">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      Homepage Lookbook Curation Control
                      <span className="text-[10px] bg-[#c5a880] text-[#141312] px-2 py-0.5 rounded-full font-bold">Owner Feature</span>
                    </h4>
                    <p className="text-[#9e9488] text-xs mt-0.5">
                      You decide which photos appear in the Home Page Lookbook strip. Toggle the &quot;Featured on Home&quot; switch on any photo. The system will automatically format and balance the editorial grid on the public home page!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#c5a880] bg-[#c5a880]/10 border border-[#c5a880]/30 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap">
                    🌟 {homePhotosCount} Photos on Homepage
                  </span>
                </div>
              </div>

              {/* Upload Photo Card */}
              <div className="glass-card rounded-2xl p-6 mb-8">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#c5a880]" /> Upload New Lookbook Photo
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[#b0a090] text-xs mb-2">Image URL (Unsplash or direct image link)</label>
                    <input
                      type="url"
                      value={photoForm.imageUrl}
                      onChange={(e) => setPhotoForm({ ...photoForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[#b0a090] text-xs mb-2">Category</label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value as GalleryCategory })}
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] focus:outline-none focus:border-[#c5a880] text-sm"
                    >
                      {["Haircut", "Color", "Before-After", "Salon Event"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[#b0a090] text-xs mb-2">Caption / Description</label>
                    <input
                      type="text"
                      value={photoForm.caption}
                      onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                      placeholder="Describe the cut, technique, or client transformation..."
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[#b0a090] text-xs mb-2">Grid Format / Aspect Ratio</label>
                    <select
                      value={photoForm.aspectRatio}
                      onChange={(e) => setPhotoForm({ ...photoForm, aspectRatio: e.target.value as "portrait" | "square" | "landscape" | "wide" })}
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] focus:outline-none focus:border-[#c5a880] text-sm"
                    >
                      <option value="portrait">Portrait (4:5)</option>
                      <option value="square">Square (1:1)</option>
                      <option value="wide">Wide (16:9)</option>
                    </select>
                  </div>
                </div>

                {/* Show on Home Checkbox */}
                <div className="mb-4 flex items-center gap-3 bg-[#141312] border border-[#2e2b26] rounded-xl p-3">
                  <input
                    type="checkbox"
                    id="showOnHome"
                    checked={photoForm.showOnHome}
                    onChange={(e) => setPhotoForm({ ...photoForm, showOnHome: e.target.checked })}
                    className="w-4 h-4 accent-[#c5a880] cursor-pointer"
                  />
                  <label htmlFor="showOnHome" className="text-sm text-[#e0d8cd] cursor-pointer flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c5a880]" />
                    <span className="font-semibold">Display immediately in Home Page Lookbook section</span>
                    <span className="text-xs text-[#78716c]">(Owner curation control)</span>
                  </label>
                </div>

                {photoForm.imageUrl && (
                  <div className="mb-4">
                    <p className="text-[#78716c] text-xs mb-2">Live Preview:</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoForm.imageUrl} alt="Preview" className="h-36 rounded-xl object-cover border border-[#2e2b26]" />
                  </div>
                )}
                <button
                  onClick={uploadPhoto}
                  disabled={uploading || !photoForm.imageUrl || !photoForm.caption}
                  className="flex items-center gap-2 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-6 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Publishing..." : uploadSuccess ? "Published Successfully! ✓" : "Publish to Salon Studio"}
                </button>
              </div>

              {/* Gallery Filter & Grid */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setGalleryFilter("all")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      galleryFilter === "all" ? "bg-[#c5a880] text-[#141312]" : "border border-[#2e2b26] text-[#78716c] hover:text-white"
                    }`}
                  >
                    All Photos ({gallery.length})
                  </button>
                  <button
                    onClick={() => setGalleryFilter("home")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      galleryFilter === "home" ? "bg-[#c5a880] text-[#141312]" : "border border-[#2e2b26] text-[#78716c] hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Homepage Lookbook ({homePhotosCount})
                  </button>
                </div>
                <p className="text-[#78716c] text-xs hidden sm:block">Click &quot;Home&quot; toggle on any card to add/remove from Homepage</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredGallery.map((p) => (
                  <div key={p.id} className="relative group rounded-xl overflow-hidden border border-[#2e2b26] bg-[#141312] flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {p.showOnHome && (
                        <span className="absolute top-2 left-2 bg-[#c5a880] text-[#141312] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Sparkles className="w-3 h-3" /> Home Page
                        </span>
                      )}
                      <span className="absolute top-2 right-2 bg-[#0d0c0b]/80 text-[#e0d8cd] text-[10px] px-2 py-0.5 rounded-full border border-[#2e2b26]">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-white text-xs font-medium line-clamp-2">{p.caption}</p>
                        <p className="text-[#78716c] text-[10px] mt-1">Ratio: {p.aspectRatio || "portrait"}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#2e2b26] flex items-center justify-between gap-2">
                        <button
                          onClick={() => toggleShowOnHome(p)}
                          disabled={togglingHomeId === p.id}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                            p.showOnHome
                              ? "bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 hover:bg-[#c5a880]/30"
                              : "border border-[#2e2b26] text-[#78716c] hover:border-[#c5a880] hover:text-[#c5a880]"
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          {togglingHomeId === p.id ? "Updating..." : p.showOnHome ? "On Home Page ✓" : "Add to Home"}
                        </button>
                        <button
                          onClick={() => deletePhoto(p.id)}
                          className="text-[#78716c] hover:text-red-400 p-1 rounded transition-colors"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: REMINDER ENGINE */}
          {tab === "reminders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass-card rounded-2xl p-6 mb-6">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#c86d51]" /> 35–40 Day Automated Return Reminder
                </h3>
                <p className="text-[#78716c] text-sm mb-5 leading-relaxed max-w-3xl">
                  This background job evaluates all completed haircut visits. When a client&apos;s last visit is between 35 and 40 days ago, it automatically triggers a personalized reminder message via their preferred channel (WhatsApp/SMS/Email/In-App). If the user has already booked an upcoming appointment before day 40, the reminder is automatically skipped to avoid spam.
                </p>
                <button
                  onClick={runReminders}
                  disabled={runningReminders}
                  className="flex items-center gap-3 bg-[#c86d51] hover:bg-[#d47a5e] text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#c86d51]/25 disabled:opacity-70"
                >
                  {runningReminders ? <span className="animate-spin">⏳</span> : <Play className="w-5 h-5" />}
                  {runningReminders ? "Running Scan..." : "Execute Reminder Scan Now"}
                </button>
              </div>

              {reminderResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Total Clients Scanned", value: reminderResult.totalUsersChecked, color: "#e0d8cd" },
                      { label: "Reminders Dispatched", value: reminderResult.remindersSent, color: "#c86d51" },
                      { label: "Skipped (Already Booked)", value: reminderResult.remindersSkippedAlreadyBooked, color: "#c5a880" },
                      { label: "Skipped (Already Sent)", value: reminderResult.remindersSkippedAlreadySent, color: "#78716c" },
                    ].map((s) => (
                      <div key={s.label} className="glass-card rounded-xl p-4">
                        <p className="text-[#78716c] text-xs">{s.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: s.color, fontFamily: "'Cormorant Garamond', serif" }}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h4 className="text-white font-semibold mb-4">Execution Audit Log</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {reminderResult.details.map((d, i) => (
                        <div
                          key={i}
                          className={`flex items-start justify-between p-3.5 rounded-xl border ${
                            d.action === "sent"
                              ? "bg-[#c86d51]/10 border-[#c86d51]/30"
                              : d.action === "skipped_already_booked"
                              ? "bg-[#c5a880]/10 border-[#c5a880]/30"
                              : "bg-[#141312] border-[#2e2b26]"
                          }`}
                        >
                          <div>
                            <p className="text-white text-sm font-semibold flex items-center gap-2">
                              {d.action === "sent" ? "📲" : d.action === "skipped_already_booked" ? "📅" : "•"}
                              {d.userName}
                            </p>
                            <p className="text-[#78716c] text-xs mt-1">
                              {d.daysSinceLastVisit} days since last haircut · {d.reason}
                            </p>
                          </div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                            d.action === "sent" ? "bg-[#c86d51] text-white" : "bg-[#2e2b26] text-[#78716c]"
                          }`}>
                            {d.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {stats?.usersNeedingReminder && stats.usersNeedingReminder.length > 0 && (
                <div className="glass-card rounded-2xl p-6 mt-6">
                  <h4 className="text-white font-semibold mb-4">Clients Currently Eligible (35–40 Day Range)</h4>
                  <div className="space-y-3">
                    {stats.usersNeedingReminder.map((u) => (
                      <div key={u.id} className="bg-[#141312] border border-[#2e2b26] rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-white font-semibold text-sm">{u.fullName}</p>
                          <p className="text-[#78716c] text-xs mt-0.5">
                            Phone: {u.phone} · {u.daysSince} days since last cut · Streak: {u.styleStreak}🔥 · Preferred: {u.preferredChannel}
                          </p>
                        </div>
                        <span className="text-xs bg-[#c86d51]/20 text-[#c86d51] border border-[#c86d51]/30 px-3 py-1 rounded-full font-bold">
                          Due for Re-visit
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <AdminContent />
    </>
  );
}
