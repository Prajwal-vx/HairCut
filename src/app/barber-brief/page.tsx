"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  Clipboard,
  Download,
  Share2,
  Edit,
  Save,
  X,
  FileText,
  CheckCircle,
  Camera,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import type { BarberBrief } from "@/lib/types";

export default function BarberBriefPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [barberBrief, setBarberBrief] = useState<BarberBrief | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    requestedStyle: "",
    sidesInstruction: "",
    topInstruction: "",
    textureNote: "",
    hairlineNote: "",
    finishNote: "",
    maintenanceNote: "",
    referenceImageUrl: "",
    additionalNotes: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/barber-brief", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.barberBrief) {
          setBarberBrief(data.barberBrief);
          setFormData({
            requestedStyle: data.barberBrief.requestedStyle,
            sidesInstruction: data.barberBrief.sidesInstruction,
            topInstruction: data.barberBrief.topInstruction,
            textureNote: data.barberBrief.textureNote,
            hairlineNote: data.barberBrief.hairlineNote,
            finishNote: data.barberBrief.finishNote,
            maintenanceNote: data.barberBrief.maintenanceNote,
            referenceImageUrl: data.barberBrief.referenceImageUrl || "",
            additionalNotes: data.barberBrief.additionalNotes || "",
          });
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => setError("Failed to load Barber Brief"));
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);

    try {
      const url = barberBrief ? "/api/barber-brief" : "/api/barber-brief";
      const method = barberBrief ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save Barber Brief");
      }

      setBarberBrief(data.barberBrief);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!barberBrief) return;

    const text = `
BARBER BRIEF
${"=".repeat(40)}

REQUESTED STYLE
${barberBrief.requestedStyle}

SIDES
${barberBrief.sidesInstruction}

TOP
${barberBrief.topInstruction}

TEXTURE
${barberBrief.textureNote}

HAIRLINE
${barberBrief.hairlineNote}

FINISH
${barberBrief.finishNote}

MAINTENANCE
${barberBrief.maintenanceNote}

${barberBrief.additionalNotes ? `NOTES\n${barberBrief.additionalNotes}` : ""}
    `.trim();

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!barberBrief) return;

    const text = `
BARBER BRIEF
${"=".repeat(40)}

REQUESTED STYLE
${barberBrief.requestedStyle}

SIDES
${barberBrief.sidesInstruction}

TOP
${barberBrief.topInstruction}

TEXTURE
${barberBrief.textureNote}

HAIRLINE
${barberBrief.hairlineNote}

FINISH
${barberBrief.finishNote}

MAINTENANCE
${barberBrief.maintenanceNote}

${barberBrief.additionalNotes ? `NOTES\n${barberBrief.additionalNotes}` : ""}
    `.trim();

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "barber-brief.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!barberBrief) return;

    const text = `
BARBER BRIEF
${"=".repeat(40)}

REQUESTED STYLE
${barberBrief.requestedStyle}

SIDES
${barberBrief.sidesInstruction}

TOP
${barberBrief.topInstruction}

TEXTURE
${barberBrief.textureNote}

HAIRLINE
${barberBrief.hairlineNote}

FINISH
${barberBrief.finishNote}

MAINTENANCE
${barberBrief.maintenanceNote}

${barberBrief.additionalNotes ? `NOTES\n${barberBrief.additionalNotes}` : ""}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Barber Brief",
          text,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopyToClipboard();
    }
  };

  if (loading || !user) {
    return <PageLoader message="Loading your Barber Brief..." />;
  }

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        <section className="pt-32 pb-16 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <FadeIn className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#c5a880]" />
                <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">
                  Show Your Barber
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Barber Brief
              </h1>
              <p className="text-[#78716c] text-sm">
                A clear, professional instruction card for your stylist
              </p>
            </FadeIn>

            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-800/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {isEditing ? (
              <FadeIn>
                <div className="glass-card rounded-2xl p-6 lg:p-8">
                  <h2 className="text-xl font-bold text-white mb-6">Edit Your Barber Brief</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Requested Style</label>
                      <input
                        type="text"
                        value={formData.requestedStyle}
                        onChange={(e) => setFormData({ ...formData, requestedStyle: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="e.g., Low Taper + Textured Top"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Sides</label>
                      <textarea
                        value={formData.sidesInstruction}
                        onChange={(e) => setFormData({ ...formData, sidesInstruction: e.target.value })}
                        rows={2}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Low taper, #2 to #1 blend"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Top</label>
                      <textarea
                        value={formData.topInstruction}
                        onChange={(e) => setFormData({ ...formData, topInstruction: e.target.value })}
                        rows={2}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Keep medium length, add texture"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Texture</label>
                      <textarea
                        value={formData.textureNote}
                        onChange={(e) => setFormData({ ...formData, textureNote: e.target.value })}
                        rows={2}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Natural/slightly messy"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Hairline</label>
                      <textarea
                        value={formData.hairlineNote}
                        onChange={(e) => setFormData({ ...formData, hairlineNote: e.target.value })}
                        rows={2}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Keep natural"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Finish</label>
                      <textarea
                        value={formData.finishNote}
                        onChange={(e) => setFormData({ ...formData, finishNote: e.target.value })}
                        rows={2}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Matte finish"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Maintenance</label>
                      <textarea
                        value={formData.maintenanceNote}
                        onChange={(e) => setFormData({ ...formData, maintenanceNote: e.target.value })}
                        rows={2}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="e.g., Low maintenance"
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Reference Image URL (Optional)</label>
                      <input
                        type="url"
                        value={formData.referenceImageUrl}
                        onChange={(e) => setFormData({ ...formData, referenceImageUrl: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Additional Notes (Optional)</label>
                      <textarea
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        rows={3}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-lg px-4 py-3 text-white focus:border-[#c5a880] focus:outline-none transition-colors resize-none"
                        placeholder="Any additional instructions..."
                        maxLength={500}
                      />
                      <p className="text-[#78716c] text-xs mt-1">{formData.additionalNotes.length}/500 characters</p>
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
                          <Save className="w-4 h-4" /> Save Brief
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
            ) : barberBrief ? (
              <FadeIn>
                <div className="glass-card rounded-2xl p-6 lg:p-8 border border-[#c5a880]/30">
                  {/* Brief Header */}
                  <div className="text-center mb-8 pb-6 border-b border-[#2e2b26]">
                    <div className="inline-flex items-center gap-2 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full px-4 py-2 mb-4">
                      <Scissors className="w-4 h-4 text-[#c5a880]" />
                      <span className="text-[#c5a880] text-xs font-semibold">BARBER BRIEF</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {barberBrief.requestedStyle}
                    </h2>
                    <p className="text-[#78716c] text-sm">Show this to your stylist for the perfect cut</p>
                  </div>

                  {/* Brief Content */}
                  <div className="space-y-6 mb-8">
                    <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                      <p className="text-[#c5a880] text-xs font-semibold mb-2">SIDES</p>
                      <p className="text-white">{barberBrief.sidesInstruction}</p>
                    </div>

                    <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                      <p className="text-[#c5a880] text-xs font-semibold mb-2">TOP</p>
                      <p className="text-white">{barberBrief.topInstruction}</p>
                    </div>

                    <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                      <p className="text-[#c5a880] text-xs font-semibold mb-2">TEXTURE</p>
                      <p className="text-white">{barberBrief.textureNote}</p>
                    </div>

                    <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                      <p className="text-[#c5a880] text-xs font-semibold mb-2">HAIRLINE</p>
                      <p className="text-white">{barberBrief.hairlineNote}</p>
                    </div>

                    <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                      <p className="text-[#c5a880] text-xs font-semibold mb-2">FINISH</p>
                      <p className="text-white">{barberBrief.finishNote}</p>
                    </div>

                    <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                      <p className="text-[#c5a880] text-xs font-semibold mb-2">MAINTENANCE</p>
                      <p className="text-white">{barberBrief.maintenanceNote}</p>
                    </div>

                    {barberBrief.referenceImageUrl && (
                      <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                        <p className="text-[#c5a880] text-xs font-semibold mb-3">REFERENCE</p>
                        <img
                          src={barberBrief.referenceImageUrl}
                          alt="Reference"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {barberBrief.additionalNotes && (
                      <div className="bg-[#141312] rounded-xl p-5 border border-[#2e2b26]">
                        <p className="text-[#c5a880] text-xs font-semibold mb-2">NOTES</p>
                        <p className="text-white">{barberBrief.additionalNotes}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-4 h-4" /> Copy to Clipboard
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-2.5 rounded-lg font-medium hover:border-[#c5a880] transition-colors"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-2.5 rounded-lg font-medium hover:border-[#c5a880] transition-colors"
                    >
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-2.5 rounded-lg font-medium hover:border-[#c5a880] transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                  </div>
                </div>
              </FadeIn>
            ) : (
              <FadeIn>
                <div className="glass-card rounded-2xl p-8 text-center">
                  <FileText className="w-16 h-16 text-[#c5a880] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-3">Create Your Barber Brief</h2>
                  <p className="text-[#78716c] mb-6 max-w-md mx-auto">
                    Generate a professional instruction card for your stylist based on your Hair Passport preferences.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#c5a880] text-[#141312] px-6 py-3 rounded-lg font-semibold hover:bg-[#d4b898] transition-colors mx-auto"
                  >
                    <Sparkles className="w-4 h-4" /> Create Barber Brief
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
