"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Scissors,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Award,
  Clock,
  Zap,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { computeConsultationRecommendation } from "@/modules/consultation/consultationEngine";
import type { DiagnosisResult, FaceShape, HairGoal, HairTexture } from "@/modules/consultation/consultationTypes";

export default function ConsultationPage() {
  const [step, setStep] = useState<number>(1);
  const [faceShape, setFaceShape] = useState<FaceShape>("oval");
  const [hairTexture, setHairTexture] = useState<HairTexture>("straight");
  const [hairGoal, setHairGoal] = useState<HairGoal>("clean");
  const [genderPreference, setGenderPreference] = useState<"mens" | "womens" | "unisex">("unisex");
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const calculateRecommendation = () => {
    setResult(computeConsultationRecommendation({ faceShape, hairTexture, hairGoal, genderPreference }));
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#e0d8cd] flex flex-col font-sans selection:bg-[#c5a880] selection:text-[#0d0c0b]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Uptown AI Style & Face Shape Diagnostic
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Discover Your Signature Look
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#a09080] max-w-2xl mx-auto leading-relaxed">
            Answer 4 quick styling questions. Our diagnostic engine cross-analyzes facial geometry,
            hair texture, and lifestyle maintenance to pair you with the ideal cut and master stylist.
          </p>
        </div>

        {/* Progress Tracker */}
        {step < 5 && (
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs text-[#a09080] mb-2 font-medium">
              <span>Step {step} of 4</span>
              <span>
                {step === 1 && "Vibe & Style Category"}
                {step === 2 && "Face Shape Geometry"}
                {step === 3 && "Natural Hair Texture"}
                {step === 4 && "Primary Goal & Routine"}
              </span>
            </div>
            <div className="w-full bg-[#1e1c19] h-2 rounded-full overflow-hidden border border-[#2e2b26]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#a88960] to-[#c5a880]"
                initial={{ width: "25%" }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Questionnaire Steps */}
        <div className="bg-[#141312] border border-[#2e2b26] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Category Preference */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
                    What styling category best describes your target look?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a09080] mt-1">
                    Select your preferred service domain so we tailor cut lengths and barber techniques.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "mens", title: "Barber / Short Cuts", desc: "Fades, tapers, beard sculpts, textured crops", icon: "💈" },
                    { id: "womens", title: "Salon / Long Layers & Color", desc: "Bobs, balayage, curtain bangs, blowouts", icon: "✨" },
                    { id: "unisex", title: "Unisex / Treatment & Care", desc: "Keratin, scalp detox, modern gender-neutral styling", icon: "🌿" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGenderPreference(cat.id as "mens" | "womens" | "unisex")}
                      className={`p-5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        genderPreference === cat.id
                          ? "border-[#c5a880] bg-[#c5a880]/10 text-white shadow-lg shadow-[#c5a880]/10"
                          : "border-[#2e2b26] bg-[#1a1816]/60 text-[#a09080] hover:border-[#3e3a34] hover:text-[#e0d8cd]"
                      }`}
                    >
                      <div>
                        <span className="text-3xl mb-3 block">{cat.icon}</span>
                        <h3 className="font-semibold text-base text-white">{cat.title}</h3>
                        <p className="text-xs text-[#8c827a] mt-1 leading-relaxed">{cat.desc}</p>
                      </div>
                      {genderPreference === cat.id && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#c5a880] font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
                  >
                    Next: Face Shape <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Face Shape */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
                    What is your approximate facial geometry?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a09080] mt-1">
                    Matching fringe length and cheekbone layering depends heavily on your facial outline.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "oval", name: "Oval", clue: "Length is greater than cheekbone width; rounded jawline without sharp corners." },
                    { id: "square", name: "Square", clue: "Forehead, cheekbones, and jawline are roughly equal width; strong defined jaw." },
                    { id: "round", name: "Round", clue: "Face width and length are equal with soft curves; fuller cheeks." },
                    { id: "heart", name: "Heart", clue: "Broad forehead and prominent cheekbones tapering down to a pointed chin." },
                    { id: "diamond", name: "Diamond", clue: "Narrow forehead and jawline with dramatic wide cheekbones at the center." },
                  ].map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setFaceShape(shape.id as FaceShape)}
                      className={`p-5 rounded-xl border text-left transition-all duration-200 ${
                        faceShape === shape.id
                          ? "border-[#c5a880] bg-[#c5a880]/10 text-white shadow-lg shadow-[#c5a880]/10"
                          : "border-[#2e2b26] bg-[#1a1816]/60 text-[#a09080] hover:border-[#3e3a34] hover:text-[#e0d8cd]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-base">{shape.name}</span>
                        {faceShape === shape.id && <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />}
                      </div>
                      <p className="text-xs text-[#8c827a] leading-relaxed">{shape.clue}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
                  >
                    Next: Hair Texture <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Hair Texture */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
                    What is your natural hair texture?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a09080] mt-1">
                    This determines weight removal, thinning shear necessity, and product hold strength.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: "straight", name: "Straight (1A–1C)", desc: "Lies flat without curls, shows clean scissor graduation clearly." },
                    { id: "wavy", name: "Wavy (2A–2C)", desc: "S-shaped wave patterns, natural body, responds well to texturizing." },
                    { id: "curly", name: "Curly (3A–3C)", desc: "Defined spirals or loops, requires hydration and curl perimeter shaping." },
                    { id: "coily", name: "Coily / Dense (4A–4C)", desc: "Tight zigzag curls or compact coils requiring gentle detangling and moisture." },
                  ].map((tex) => (
                    <button
                      key={tex.id}
                      type="button"
                      onClick={() => setHairTexture(tex.id as HairTexture)}
                      className={`p-5 rounded-xl border text-left transition-all duration-200 ${
                        hairTexture === tex.id
                          ? "border-[#c5a880] bg-[#c5a880]/10 text-white shadow-lg shadow-[#c5a880]/10"
                          : "border-[#2e2b26] bg-[#1a1816]/60 text-[#a09080] hover:border-[#3e3a34] hover:text-[#e0d8cd]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-sm sm:text-base">{tex.name}</span>
                        {hairTexture === tex.id && <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />}
                      </div>
                      <p className="text-xs text-[#8c827a] leading-relaxed">{tex.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
                  >
                    Next: Style Goal <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Primary Goal */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
                    What is your number one styling goal?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a09080] mt-1">
                    Help us balance aesthetic impact with your everyday morning routine.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "clean", name: "Sharp, Professional & Neat", desc: "Crisp outlines, zero-fade precision, or refined office-ready texture." },
                    { id: "volume", name: "Maximum Volume & Movement", desc: "Dynamic face-framing layers and root lift for bounce and life." },
                    { id: "low_maintenance", name: "Low-Maintenance Wash & Go", desc: "Effortless shape that looks great right out of bed or the shower." },
                    { id: "fashion_forward", name: "Trendsetting & Dimensional Color", desc: "Balayage, artistic fades, or modern statement cuts." },
                    { id: "hair_health", name: "Scalp Health & Frizz Elimination", desc: "Deep silk therapy, keratin smoothing, and organic revitalization." },
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setHairGoal(goal.id as HairGoal)}
                      className={`p-5 rounded-xl border text-left transition-all duration-200 ${
                        hairGoal === goal.id
                          ? "border-[#c5a880] bg-[#c5a880]/10 text-white shadow-lg shadow-[#c5a880]/10"
                          : "border-[#2e2b26] bg-[#1a1816]/60 text-[#a09080] hover:border-[#3e3a34] hover:text-[#e0d8cd]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white text-base">{goal.name}</span>
                        {hairGoal === goal.id && <CheckCircle2 className="w-4 h-4 text-[#c5a880]" />}
                      </div>
                      <p className="text-xs text-[#8c827a] leading-relaxed">{goal.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={calculateRecommendation}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e4c9a4] text-[#0d0c0b] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#c5a880]/25"
                  >
                    <Sparkles className="w-4 h-4" /> Generate My Diagnostic Plan
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Diagnosis Result Card */}
            {step === 5 && result && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="space-y-8"
              >
                {/* Result Top Banner */}
                <div className="border-b border-[#2e2b26] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-xs font-semibold uppercase tracking-wider mb-2">
                      <Zap className="w-3.5 h-3.5" /> {result.matchScore}% Aesthetic Match Found
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
                      {result.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#c5a880] mt-1 font-medium">
                      {result.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#a09080] hover:text-[#c5a880] transition-colors self-start md:self-auto border border-[#2e2b26] px-3.5 py-2 rounded-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Diagnostic
                  </button>
                </div>

                {/* Main Split: Photo + Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Photo & Fast Stats */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-[#2e2b26] aspect-[4/5] shadow-xl">
                      <Image
                        src={result.sampleImage}
                        alt={result.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        quality={75}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                        <div className="text-white">
                          <p className="text-xs uppercase tracking-widest text-[#c5a880] font-semibold">Matched Silhouette</p>
                          <p className="text-sm font-medium">{result.faceShape} Face &bull; {result.hairTexture} Hair</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1a1816] rounded-xl p-4 border border-[#2e2b26] space-y-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-[#8c827a] flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#c5a880]" /> Recommended Trim Cycle:
                        </span>
                        <span className="font-semibold text-white">Every {result.maintenanceIntervalDays} Days</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-[#2e2b26]">
                        <span className="text-[#8c827a] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#c5a880]" /> Suggested Product:
                        </span>
                        <span className="font-semibold text-[#e0d8cd]">{result.productSuggestion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Why it works + Tips + Booking */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-[#1a1816]/70 rounded-xl p-5 border border-[#2e2b26]">
                      <h3 className="text-base font-semibold text-white mb-2">Architectural Assessment</h3>
                      <p className="text-xs sm:text-sm text-[#a09080] leading-relaxed">
                        {result.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c5a880] mb-3">
                        Why this cut complements your face geometry
                      </h3>
                      <ul className="space-y-2">
                        {result.whyItWorks.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#e0d8cd]">
                            <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#c5a880] mb-3">
                        Master Barber Styling Tips
                      </h3>
                      <ul className="space-y-2">
                        {result.stylingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#a09080]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shrink-0 mt-2" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Matched Specialist Box */}
                    <div className="bg-gradient-to-r from-[#1e1c18] to-[#171614] border border-[#c5a880]/40 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-[#c5a880] uppercase tracking-wider">
                          Assigned Master Specialist
                        </span>
                        <h4 className="text-lg font-bold text-white mt-0.5">{result.recommendedStylistName}</h4>
                        <p className="text-xs text-[#8c827a]">
                          Specializes in your exact profile and service ({result.recommendedServiceName})
                        </p>
                      </div>
                      <Link
                        href={`/book?service=${encodeURIComponent(result.recommendedServiceId)}&stylist=${encodeURIComponent(result.recommendedStylistId)}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] hover:bg-[#d4b898] text-[#0d0c0b] font-bold text-sm transition-all shadow-lg shadow-[#c5a880]/20"
                      >
                        <Scissors className="w-4 h-4" /> Book This Look Now
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Diagnostic Assurance Notice */}
        <div className="mt-12 text-center text-xs text-[#6e665e] flex items-center justify-center gap-2">
          <Clock className="w-4 h-4" />
          Every Uptown Hair cut includes an in-person mirror consultation to tailor micro-angles prior to scissor contact.
        </div>
      </main>

      <Footer />
    </div>
  );
}
