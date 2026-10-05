"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  Edit,
  Save,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import type { StyleDNA } from "@/lib/types";

export default function StyleDNAPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [styleDNA, setStyleDNA] = useState<StyleDNA | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    minimalist: 50,
    lowMaintenance: 50,
    textured: 50,
    classic: 50,
    experimental: 50,
    shortStyles: 50,
    naturalFinish: 50,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/style-dna", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.styleDNA) {
          setStyleDNA(data.styleDNA);
          setFormData({
            minimalist: data.styleDNA.minimalist,
            lowMaintenance: data.styleDNA.lowMaintenance,
            textured: data.styleDNA.textured,
            classic: data.styleDNA.classic,
            experimental: data.styleDNA.experimental,
            shortStyles: data.styleDNA.shortStyles,
            naturalFinish: data.styleDNA.naturalFinish,
          });
        }
      })
      .catch(() => setError("Failed to load Style DNA"));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);

    try {
      const url = styleDNA ? "/api/style-dna" : "/api/style-dna";
      const method = styleDNA ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save Style DNA");
      }

      setStyleDNA(data.styleDNA);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRecompute = async () => {
    if (!user) return;
    setIsComputing(true);
    setError(null);

    try {
      // Delete current DNA to trigger recomputation
      await fetch("/api/style-dna", {
        method: "DELETE",
        credentials: "include",
      });

      // Fetch to trigger recomputation
      const response = await fetch("/api/style-dna", { credentials: "include" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to recompute Style DNA");
      }

      setStyleDNA(data.styleDNA);
      setFormData({
        minimalist: data.styleDNA.minimalist,
        lowMaintenance: data.styleDNA.lowMaintenance,
        textured: data.styleDNA.textured,
        classic: data.styleDNA.classic,
        experimental: data.styleDNA.experimental,
        shortStyles: data.styleDNA.shortStyles,
        naturalFinish: data.styleDNA.naturalFinish,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to recompute");
    } finally {
      setIsComputing(false);
    }
  };

  const handleReset = async () => {
    if (!user) return;
    setIsComputing(true);
    setError(null);

    try {
      await fetch("/api/style-dna", {
        method: "DELETE",
        credentials: "include",
      });

      setStyleDNA(null);
      setFormData({
        minimalist: 50,
        lowMaintenance: 50,
        textured: 50,
        classic: 50,
        experimental: 50,
        shortStyles: 50,
        naturalFinish: 50,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset");
    } finally {
      setIsComputing(false);
    }
  };

  if (loading || !user) {
    return <PageLoader message="Loading your Style DNA..." />;
  }

  const traits = [
    { key: "minimalist" as const, label: "Minimalist", icon: "✨", description: "Prefers clean, simple styles" },
    { key: "lowMaintenance" as const, label: "Low Maintenance", icon: "⏱️", description: "Values easy, quick styling" },
    { key: "textured" as const, label: "Textured", icon: "🌊", description: "Enjoys natural, layered looks" },
    { key: "classic" as const, label: "Classic", icon: "🎩", description: "Prefers timeless, traditional cuts" },
    { key: "experimental" as const, label: "Experimental", icon: "🚀", description: "Open to bold, new styles" },
    { key: "shortStyles" as const, label: "Short Styles", icon: "✂️", description: "Prefers shorter hair lengths" },
    { key: "naturalFinish" as const, label: "Natural Finish", icon: "🌿", description: "Likes matte, natural looks" },
  ];

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
                  <TrendingUp className="w-5 h-5 text-[#c5a880]" />
                  <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">
                    Your Style Profile
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Style DNA
                </h1>
                <p className="text-[#78716c] text-sm mt-2">
                  Your unique style preferences learned from your haircut history
                </p>
              </div>
              {styleDNA && !isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleRecompute}
                    disabled={isComputing}
                    className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-4 py-2 rounded-lg font-medium hover:border-[#c5a880] transition-colors disabled:opacity-50"
                  >
                    {isComputing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
                        Computing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" /> Recompute
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>
              )}
            </FadeIn>

            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-800/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {isEditing ? (
              <FadeIn>
                <div className="glass-card rounded-2xl p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-white mb-6">Customize Your Style DNA</h2>

                  <div className="space-y-6">
                    {traits.map((trait) => (
                      <div key={trait.key}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{trait.icon}</span>
                            <span className="text-white font-semibold">{trait.label}</span>
                          </div>
                          <span className="text-[#c5a880] font-bold">{formData[trait.key]}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={formData[trait.key]}
                          onChange={(e) => setFormData({ ...formData, [trait.key]: Number(e.target.value) })}
                          className="w-full h-2 bg-[#2e2b26] rounded-lg appearance-none cursor-pointer accent-[#c5a880]"
                        />
                        <p className="text-[#78716c] text-xs mt-1">{trait.description}</p>
                      </div>
                    ))}
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
                          <Save className="w-4 h-4" /> Save Style DNA
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
            ) : styleDNA ? (
              <FadeIn>
                <div className="glass-card rounded-2xl p-6 lg:p-8 border border-[#c5a880]/30">
                  <div className="mb-6 pb-6 border-b border-[#2e2b26]">
                    <p className="text-[#78716c] text-sm">Last computed</p>
                    <p className="text-white font-semibold">
                      {new Date(styleDNA.computedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {traits.map((trait) => {
                      const score = styleDNA[trait.key];
                      const isHigh = score >= 70;
                      const isLow = score <= 30;

                      return (
                        <motion.div
                          key={trait.key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: traits.indexOf(trait) * 0.05 }}
                          className={`relative p-5 rounded-xl border ${
                            isHigh
                              ? "bg-[#c5a880]/10 border-[#c5a880]/30"
                              : isLow
                              ? "bg-[#2e2b26]/30 border-[#2e2b26]"
                              : "bg-[#141312] border-[#2e2b26]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{trait.icon}</span>
                              <span className="text-white font-semibold">{trait.label}</span>
                            </div>
                            <span
                              className={`text-2xl font-bold ${
                                isHigh ? "text-[#c5a880]" : isLow ? "text-[#78716c]" : "text-white"
                              }`}
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              {score}%
                            </span>
                          </div>
                          <div className="h-2 bg-[#2e2b26] rounded-full overflow-hidden mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className={`h-full rounded-full ${
                                isHigh
                                  ? "bg-gradient-to-r from-[#c5a880] to-[#d4b898]"
                                  : isLow
                                  ? "bg-[#2e2b26]"
                                  : "bg-gradient-to-r from-[#2e2b26] to-[#3d3a36]"
                              }`}
                            />
                          </div>
                          <p className="text-[#78716c] text-xs">{trait.description}</p>
                          {isHigh && (
                            <div className="absolute top-2 right-2">
                              <Zap className="w-4 h-4 text-[#c5a880]" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Adjust Preferences
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isComputing}
                      className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-2.5 rounded-lg font-medium hover:border-[#c5a880] transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" /> Reset Profile
                    </button>
                  </div>
                </div>
              </FadeIn>
            ) : (
              <FadeIn>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Sparkles className="w-16 h-16 text-[#c5a880] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-3">Discover Your Style DNA</h2>
                  <p className="text-[#78716c] mb-6 max-w-md mx-auto">
                    Your Style DNA is computed from your haircut history, preferences, and choices. It helps us recommend styles that truly fit you.
                  </p>
                  <button
                    onClick={handleRecompute}
                    disabled={isComputing}
                    className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b898] transition-colors mx-auto disabled:opacity-50"
                  >
                    {isComputing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#141312] border-t-transparent rounded-full animate-spin" />
                        Computing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> Compute My Style DNA
                      </>
                    )}
                  </button>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
