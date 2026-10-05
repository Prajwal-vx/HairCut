"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Edit,
  Save,
  Shield,
  Clock,
  Star,
  Camera,
  FileText,
  Award,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import type { HairPassport, Stylist } from "@/lib/types";

export default function HairPassportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [passport, setPassport] = useState<HairPassport | null>(null);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    currentStyle: "",
    sideLength: "",
    topLength: "",
    necklinePreference: "",
    finishType: "",
    hairTexture: "medium" as HairPassport["hairTexture"],
    hairDensity: "medium" as HairPassport["hairDensity"],
    hairLength: "medium" as HairPassport["hairLength"],
    hairType: "",
    maintenanceLevel: "medium" as HairPassport["maintenanceLevel"],
    beardPreference: "",
    fadeType: "",
    faceShape: "",
    stylingProducts: "",
    lastHaircutDate: "",
    lastHaircutStyle: "",
    satisfactionScore: 5,
    preferredStylistId: "",
    notes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    // Fetch passport
    fetch("/api/passport", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.passport) {
          setPassport(data.passport);
          setFormData({
            currentStyle: data.passport.currentStyle,
            sideLength: data.passport.sideLength,
            topLength: data.passport.topLength,
            necklinePreference: data.passport.necklinePreference,
            finishType: data.passport.finishType,
            hairTexture: data.passport.hairTexture,
            hairDensity: data.passport.hairDensity,
            hairLength: data.passport.hairLength,
            hairType: data.passport.hairType,
            maintenanceLevel: data.passport.maintenanceLevel,
            beardPreference: data.passport.beardPreference || "",
            fadeType: data.passport.fadeType || "",
            faceShape: data.passport.faceShape || "",
            stylingProducts: data.passport.stylingProducts || "",
            lastHaircutDate: data.passport.lastHaircutDate || "",
            lastHaircutStyle: data.passport.lastHaircutStyle || "",
            satisfactionScore: data.passport.satisfactionScore || 5,
            preferredStylistId: data.passport.preferredStylistId || "",
            notes: data.passport.notes || "",
          });
        }
      })
      .catch(() => setError("Failed to load Hair Passport"));

    // Fetch stylists
    fetch("/api/stylists")
      .then((res) => res.json())
      .then((data) => setStylists(data.stylists || []))
      .catch(() => {});
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);

    try {
      const url = passport ? "/api/passport" : "/api/passport";
      const method = passport ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save Hair Passport");
      }

      setPassport(data.passport);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const getDaysSinceLastCut = () => {
    if (!passport?.lastHaircutDate) return null;
    const lastCut = new Date(passport.lastHaircutDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastCut.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading || !user) {
    return <PageLoader message="Loading your Hair Passport..." />;
  }

  const daysSince = getDaysSinceLastCut();

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <FadeIn className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-[#c5a880]" />
                  <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">
                    Your Personal Profile
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Hair Passport
                </h1>
                <p className="text-[#78716c] text-sm mt-2">
                  Your permanent record of styles, preferences, and haircut history
                </p>
              </div>
              {passport && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
              )}
            </FadeIn>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-900/20 border border-red-800/50 text-red-200 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isEditing ? (
              <FadeIn>
                <div className="glass-card rounded-2xl p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-white mb-6">Create Your Hair Passport</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Style */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Current Style</label>
                      <input
                        type="text"
                        value={formData.currentStyle}
                        onChange={(e) => setFormData({ ...formData, currentStyle: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Textured Low Taper"
                      />
                    </div>

                    {/* Hair Texture */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Hair Texture</label>
                      <select
                        value={formData.hairTexture}
                        onChange={(e) => setFormData({ ...formData, hairTexture: e.target.value as HairPassport["hairTexture"] })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                      >
                        <option value="straight">Straight</option>
                        <option value="wavy">Wavy</option>
                        <option value="curly">Curly</option>
                        <option value="coily">Coily</option>
                      </select>
                    </div>

                    {/* Hair Density */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Hair Density</label>
                      <select
                        value={formData.hairDensity}
                        onChange={(e) => setFormData({ ...formData, hairDensity: e.target.value as HairPassport["hairDensity"] })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                      >
                        <option value="thin">Thin</option>
                        <option value="medium">Medium</option>
                        <option value="thick">Thick</option>
                      </select>
                    </div>

                    {/* Hair Length */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Hair Length</label>
                      <select
                        value={formData.hairLength}
                        onChange={(e) => setFormData({ ...formData, hairLength: e.target.value as HairPassport["hairLength"] })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                      >
                        <option value="very-short">Very Short</option>
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="long">Long</option>
                        <option value="very-long">Very Long</option>
                      </select>
                    </div>

                    {/* Side Length */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Side Length</label>
                      <input
                        type="text"
                        value={formData.sideLength}
                        onChange={(e) => setFormData({ ...formData, sideLength: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., #2 fade"
                      />
                    </div>

                    {/* Top Length */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Top Length</label>
                      <input
                        type="text"
                        value={formData.topLength}
                        onChange={(e) => setFormData({ ...formData, topLength: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Medium textured"
                      />
                    </div>

                    {/* Neckline Preference */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Neckline Preference</label>
                      <input
                        type="text"
                        value={formData.necklinePreference}
                        onChange={(e) => setFormData({ ...formData, necklinePreference: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Natural line"
                      />
                    </div>

                    {/* Finish Type */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Finish Type</label>
                      <input
                        type="text"
                        value={formData.finishType}
                        onChange={(e) => setFormData({ ...formData, finishType: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Matte finish"
                      />
                    </div>

                    {/* Maintenance Level */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Maintenance Level</label>
                      <select
                        value={formData.maintenanceLevel}
                        onChange={(e) => setFormData({ ...formData, maintenanceLevel: e.target.value as HairPassport["maintenanceLevel"] })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    {/* Hair Type */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Hair Type</label>
                      <input
                        type="text"
                        value={formData.hairType}
                        onChange={(e) => setFormData({ ...formData, hairType: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Fine, coarse, etc."
                      />
                    </div>

                    {/* Face Shape */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Face Shape (Optional)</label>
                      <input
                        type="text"
                        value={formData.faceShape}
                        onChange={(e) => setFormData({ ...formData, faceShape: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Oval, Square, Round"
                      />
                    </div>

                    {/* Fade Type */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Fade Type (Optional)</label>
                      <input
                        type="text"
                        value={formData.fadeType}
                        onChange={(e) => setFormData({ ...formData, fadeType: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Low taper, Skin fade"
                      />
                    </div>

                    {/* Beard Preference */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Beard Preference (Optional)</label>
                      <input
                        type="text"
                        value={formData.beardPreference}
                        onChange={(e) => setFormData({ ...formData, beardPreference: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Full beard, Clean shave"
                      />
                    </div>

                    {/* Styling Products */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Styling Products (Optional)</label>
                      <input
                        type="text"
                        value={formData.stylingProducts}
                        onChange={(e) => setFormData({ ...formData, stylingProducts: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Matte paste, Pomade"
                      />
                    </div>

                    {/* Preferred Stylist */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Preferred Stylist (Optional)</label>
                      <select
                        value={formData.preferredStylistId}
                        onChange={(e) => setFormData({ ...formData, preferredStylistId: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                      >
                        <option value="">No preference</option>
                        {stylists.map((stylist) => (
                          <option key={stylist.id} value={stylist.id}>
                            {stylist.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Last Haircut Date */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Last Haircut Date (Optional)</label>
                      <input
                        type="date"
                        value={formData.lastHaircutDate}
                        onChange={(e) => setFormData({ ...formData, lastHaircutDate: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Last Haircut Style */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Last Haircut Style (Optional)</label>
                      <input
                        type="text"
                        value={formData.lastHaircutStyle}
                        onChange={(e) => setFormData({ ...formData, lastHaircutStyle: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Taper cut with texture"
                      />
                    </div>

                    {/* Satisfaction Score */}
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Satisfaction Score (1-5)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button
                            key={score}
                            type="button"
                            onClick={() => setFormData({ ...formData, satisfactionScore: score })}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              formData.satisfactionScore >= score
                                ? "bg-[#c5a880] text-[#141312]"
                                : "bg-[#141312] border border-[#2e2b26] text-[#78716c]"
                            }`}
                          >
                            <Star className="w-5 h-5" fill={formData.satisfactionScore >= score ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Additional Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="Any additional preferences or notes for your stylist..."
                        maxLength={1000}
                      />
                      <p className="text-[#78716c] text-xs mt-1">{formData.notes.length}/1000 characters</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b898] transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#141312] border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Hair Passport
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-6 py-3 rounded-lg font-medium hover:border-[#c5a880] transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              </FadeIn>
            ) : passport ? (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card rounded-2xl p-6 lg:p-8 border border-[#c5a880]/30">
                  {/* Passport Header */}
                  <div className="flex items-start justify-between mb-8 pb-6 border-b border-[#2e2b26]">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {passport.currentStyle}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-[#78716c]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {daysSince !== null ? `${daysSince} days ago` : "Not recorded"}
                        </span>
                        {passport.satisfactionScore && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-[#c5a880]" fill="currentColor" />
                            {passport.satisfactionScore}/5
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-8 h-8 text-[#c5a880]" />
                      <div className="text-right">
                        <p className="text-[#c5a880] text-xs font-semibold">MAINTENANCE</p>
                        <p className="text-white text-lg font-bold capitalize">{passport.maintenanceLevel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passport Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs font-medium mb-1">Sides</p>
                      <p className="text-white font-semibold">{passport.sideLength}</p>
                    </div>
                    <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs font-medium mb-1">Top</p>
                      <p className="text-white font-semibold">{passport.topLength}</p>
                    </div>
                    <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs font-medium mb-1">Neckline</p>
                      <p className="text-white font-semibold">{passport.necklinePreference}</p>
                    </div>
                    <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs font-medium mb-1">Finish</p>
                      <p className="text-white font-semibold">{passport.finishType}</p>
                    </div>
                    <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs font-medium mb-1">Texture</p>
                      <p className="text-white font-semibold capitalize">{passport.hairTexture}</p>
                    </div>
                    <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                      <p className="text-[#78716c] text-xs font-medium mb-1">Density</p>
                      <p className="text-white font-semibold capitalize">{passport.hairDensity}</p>
                    </div>
                    {passport.fadeType && (
                      <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                        <p className="text-[#78716c] text-xs font-medium mb-1">Fade Type</p>
                        <p className="text-white font-semibold">{passport.fadeType}</p>
                      </div>
                    )}
                    {passport.beardPreference && (
                      <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                        <p className="text-[#78716c] text-xs font-medium mb-1">Beard</p>
                        <p className="text-white font-semibold">{passport.beardPreference}</p>
                      </div>
                    )}
                    {passport.stylingProducts && (
                      <div className="bg-[#141312] rounded-xl p-4 border border-[#2e2b26]">
                        <p className="text-[#78716c] text-xs font-medium mb-1">Products</p>
                        <p className="text-white font-semibold">{passport.stylingProducts}</p>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {passport.faceShape && (
                    <div className="mb-6">
                      <p className="text-[#78716c] text-xs font-medium mb-2">Face Shape</p>
                      <p className="text-white">{passport.faceShape}</p>
                    </div>
                  )}

                  {passport.notes && (
                    <div className="mb-6">
                      <p className="text-[#78716c] text-xs font-medium mb-2">Notes</p>
                      <p className="text-white">{passport.notes}</p>
                    </div>
                  )}

                  {/* Preferred Stylist */}
                  {passport.preferredStylistId && (
                    <div className="bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-xl p-4 mb-6">
                      <p className="text-[#c5a880] text-xs font-semibold mb-1">PREFERRED STYLIST</p>
                      <p className="text-white font-semibold">
                        {stylists.find((s) => s.id === passport.preferredStylistId)?.name || "Unknown"}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Update Passport
                    </button>
                    <button className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-2.5 rounded-lg font-medium hover:border-[#c5a880] transition-colors">
                      <FileText className="w-4 h-4" /> Generate Barber Brief
                    </button>
                    <button className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-2.5 rounded-lg font-medium hover:border-[#c5a880] transition-colors">
                      <Camera className="w-4 h-4" /> Add Photo
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Shield className="w-16 h-16 text-[#c5a880] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-3">Create Your Hair Passport</h2>
                  <p className="text-[#78716c] mb-6 max-w-md mx-auto">
                    Your Hair Passport is a permanent record of your hairstyle preferences, helping you communicate exactly what you want to your stylist.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b898] transition-colors mx-auto"
                  >
                    <Sparkles className="w-4 h-4" /> Create Hair Passport
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
