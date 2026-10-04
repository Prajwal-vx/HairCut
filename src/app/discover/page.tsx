"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Camera,
  SkipForward,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Sliders,
  BookOpen,
  Scissors,
  Clock,
  Zap,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Clipboard,
  Download,
  Share2,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────
type HairLength = "very-short" | "short" | "medium" | "long" | "very-long";
type HairTexture = "straight" | "wavy" | "curly" | "coily";
type FaceShape = "oval" | "square" | "round" | "heart" | "diamond";
type StylingTime = "under5" | "5to10" | "10to20" | "20plus";
type CutFrequency = "biweekly" | "monthly" | "every6weeks" | "2months";
type StylePriority = "professional" | "natural" | "fashion" | "health";

interface DiscoverAnswers {
  photoUrl: string | null;
  hairLength: HairLength;
  hairTexture: HairTexture;
  faceShape: FaceShape;
  stylingTime: StylingTime;
  cutFrequency: CutFrequency;
  stylePriority: StylePriority;
  changeSlider: number;
}

interface StyleRecommendation {
  tier: "safe" | "balanced" | "bold";
  label: string;
  name: string;
  fitScore: number;
  whyItWorks: string[];
  maintenanceLevel: "Low" | "Medium" | "High";
  image: string;
}

// ─────────────────────────────────────────────────
// Hairstyle Catalog (scored pool)
// ─────────────────────────────────────────────────
const STYLE_CATALOG: Array<{
  id: string;
  name: string;
  changeLevel: number; // 0-100: how much change from average
  maintenanceLevel: "Low" | "Medium" | "High";
  maintenanceScore: number; // 1=low, 2=medium, 3=high
  bestTextures: HairTexture[];
  bestLengths: HairLength[];
  bestFaceShapes: FaceShape[];
  bestPriorities: StylePriority[];
  image: string;
  whyItWorks: Record<string, string[]>;
}> = [
  {
    id: "trim",
    name: "Classic Clean Trim",
    changeLevel: 5,
    maintenanceLevel: "Low",
    maintenanceScore: 1,
    bestTextures: ["straight", "wavy", "curly", "coily"],
    bestLengths: ["medium", "long", "very-long"],
    bestFaceShapes: ["oval", "square", "round", "heart", "diamond"],
    bestPriorities: ["professional", "natural"],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Preserves your current style while removing split ends",
        "No adjustment period — looks great immediately",
        "Suits all face shapes with minimal disruption",
      ],
    },
  },
  {
    id: "taper",
    name: "Soft Taper & Shape-Up",
    changeLevel: 20,
    maintenanceLevel: "Low",
    maintenanceScore: 1,
    bestTextures: ["straight", "wavy"],
    bestLengths: ["short", "medium"],
    bestFaceShapes: ["oval", "square", "heart"],
    bestPriorities: ["professional", "natural"],
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Gradual taper keeps the shape clean without drastic change",
        "Works with your natural growth pattern",
        "Low daily styling effort required",
      ],
    },
  },
  {
    id: "textured-crop",
    name: "Textured Crop",
    changeLevel: 40,
    maintenanceLevel: "Medium",
    maintenanceScore: 2,
    bestTextures: ["straight", "wavy", "curly"],
    bestLengths: ["short", "medium"],
    bestFaceShapes: ["round", "oval", "heart"],
    bestPriorities: ["fashion", "professional"],
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Adds deliberate texture and volume on top",
        "Structured sides create strong facial definition",
        "5-minute styling routine with matte clay",
      ],
    },
  },
  {
    id: "mid-fade",
    name: "Mid Skin Fade",
    changeLevel: 55,
    maintenanceLevel: "Medium",
    maintenanceScore: 2,
    bestTextures: ["straight", "wavy", "coily"],
    bestLengths: ["short", "very-short"],
    bestFaceShapes: ["oval", "round", "diamond"],
    bestPriorities: ["professional", "fashion"],
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Clean fade elevates sharpness and facial symmetry",
        "Contrasts with top length for high-impact visuals",
        "Versatile — styled formal or casual",
      ],
    },
  },
  {
    id: "curtain-bangs",
    name: "Curtain Bangs & Layers",
    changeLevel: 45,
    maintenanceLevel: "Medium",
    maintenanceScore: 2,
    bestTextures: ["wavy", "straight"],
    bestLengths: ["medium", "long"],
    bestFaceShapes: ["heart", "oval", "square"],
    bestPriorities: ["fashion", "natural"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Face-framing layers highlight cheekbones",
        "Curtain bangs soften strong foreheads elegantly",
        "Grows out gracefully — low commitment",
      ],
    },
  },
  {
    id: "wolf-cut",
    name: "The Wolf Cut",
    changeLevel: 68,
    maintenanceLevel: "Medium",
    maintenanceScore: 2,
    bestTextures: ["wavy", "curly"],
    bestLengths: ["medium", "long"],
    bestFaceShapes: ["oval", "round", "diamond"],
    bestPriorities: ["fashion", "natural"],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Layers create maximum natural movement and volume",
        "Shaggy silhouette frames face with effortless attitude",
        "Celebrates your natural wave or curl pattern",
      ],
    },
  },
  {
    id: "buzz-cut",
    name: "Clean Buzz / Crew Cut",
    changeLevel: 75,
    maintenanceLevel: "Low",
    maintenanceScore: 1,
    bestTextures: ["straight", "wavy", "coily"],
    bestLengths: ["very-short", "short"],
    bestFaceShapes: ["oval", "square", "diamond"],
    bestPriorities: ["professional", "natural"],
    image: "https://images.unsplash.com/photo-1548484352-ea579e5233a8?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Zero daily styling — ultimate wash & go freedom",
        "Highlights bone structure and features boldly",
        "Dramatically different — immediate high impact",
      ],
    },
  },
  {
    id: "skin-fade-design",
    name: "Skin Fade with Design",
    changeLevel: 88,
    maintenanceLevel: "High",
    maintenanceScore: 3,
    bestTextures: ["straight", "coily", "wavy"],
    bestLengths: ["very-short", "short"],
    bestFaceShapes: ["oval", "round", "square"],
    bestPriorities: ["fashion"],
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Razor-etched design is a bold statement piece",
        "Zero-skin fade creates maximum contrast",
        "Unique art makes you immediately recognizable",
      ],
    },
  },
  {
    id: "balayage-layers",
    name: "Balayage & Dimensional Layers",
    changeLevel: 80,
    maintenanceLevel: "High",
    maintenanceScore: 3,
    bestTextures: ["straight", "wavy"],
    bestLengths: ["medium", "long", "very-long"],
    bestFaceShapes: ["oval", "heart", "square"],
    bestPriorities: ["fashion"],
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Hand-painted highlights illuminate your complexion",
        "Low root maintenance grows out beautifully",
        "Dimensional depth adds fullness to fine hair",
      ],
    },
  },
  {
    id: "coily-defined",
    name: "Defined Coil Shape-Up",
    changeLevel: 30,
    maintenanceLevel: "Medium",
    maintenanceScore: 2,
    bestTextures: ["coily", "curly"],
    bestLengths: ["short", "medium"],
    bestFaceShapes: ["oval", "round", "heart"],
    bestPriorities: ["natural", "health"],
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Celebrates your natural coil pattern authentically",
        "Sharp edges create clean facial framing",
        "Hydration-focused shaping preserves hair health",
      ],
    },
  },
  {
    id: "keratin-smooth",
    name: "Keratin Smooth & Trim",
    changeLevel: 35,
    maintenanceLevel: "Low",
    maintenanceScore: 1,
    bestTextures: ["curly", "coily", "wavy"],
    bestLengths: ["medium", "long", "very-long"],
    bestFaceShapes: ["oval", "square", "round", "heart", "diamond"],
    bestPriorities: ["health", "natural"],
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
    whyItWorks: [
      "Eliminates frizz with zero heat styling daily",
      "Restores internal hair moisture barrier deeply",
      "Cuts morning routine by up to 70%",
    ] as unknown as Record<string, string[]>,
  },
  {
    id: "undercut-pompadour",
    name: "Undercut Pompadour",
    changeLevel: 72,
    maintenanceLevel: "High",
    maintenanceScore: 3,
    bestTextures: ["straight", "wavy"],
    bestLengths: ["short", "medium"],
    bestFaceShapes: ["oval", "square", "heart"],
    bestPriorities: ["fashion", "professional"],
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80",
    whyItWorks: {
      default: [
        "Dramatic height adds powerful presence and stature",
        "Sharp undercut creates clean modern silhouette",
        "Style adapts from boardroom to evening out",
      ],
    },
  },
];

// ─────────────────────────────────────────────────
// Scoring Algorithm
// ─────────────────────────────────────────────────
function scoreStyle(
  style: (typeof STYLE_CATALOG)[0],
  answers: DiscoverAnswers
): number {
  let score = 50;

  // Texture match
  if (style.bestTextures.includes(answers.hairTexture)) score += 15;

  // Length match
  if (style.bestLengths.includes(answers.hairLength)) score += 12;

  // Face shape match
  if (style.bestFaceShapes.includes(answers.faceShape)) score += 13;

  // Priority match
  if (style.bestPriorities.includes(answers.stylePriority)) score += 10;

  // Maintenance tolerance
  const toleranceMap: Record<StylingTime, number> = {
    under5: 1,
    "5to10": 2,
    "10to20": 3,
    "20plus": 3,
  };
  const tolerance = toleranceMap[answers.stylingTime];
  if (style.maintenanceScore <= tolerance) score += 8;
  if (style.maintenanceScore > tolerance) score -= 12;

  // Change slider alignment
  const changeDelta = Math.abs(style.changeLevel - answers.changeSlider);
  score += Math.max(0, 12 - changeDelta / 5);

  return Math.min(99, Math.max(55, Math.round(score)));
}

function getWhyItWorks(style: (typeof STYLE_CATALOG)[0]): string[] {
  const w = style.whyItWorks;
  if (Array.isArray(w)) return w as unknown as string[];
  return (w as Record<string, string[]>).default;
}

function computeRecommendations(answers: DiscoverAnswers): StyleRecommendation[] {
  const scored = STYLE_CATALOG.map((style) => ({
    style,
    score: scoreStyle(style, answers),
  })).sort((a, b) => b.score - a.score);

  // Safe: lowest change from current
  const safePool = scored
    .filter((s) => s.style.changeLevel <= 30)
    .sort((a, b) => a.style.changeLevel - b.style.changeLevel);

  // Balanced: moderate change 30–65
  const balancedPool = scored
    .filter((s) => s.style.changeLevel > 30 && s.style.changeLevel <= 65)
    .sort((a, b) => b.score - a.score);

  // Bold: high change or slider-driven
  const boldThreshold = answers.changeSlider > 60 ? 55 : 65;
  const boldPool = scored
    .filter((s) => s.style.changeLevel > boldThreshold)
    .sort((a, b) => b.score - a.score);

  const safeEntry = safePool[0] ?? scored[0];
  const balancedEntry =
    balancedPool.find((s) => s.style.id !== safeEntry.style.id) ??
    scored.find((s) => s.style.id !== safeEntry.style.id) ??
    scored[1];
  const boldEntry =
    boldPool.find(
      (s) =>
        s.style.id !== safeEntry.style.id && s.style.id !== balancedEntry?.style.id
    ) ??
    scored.find(
      (s) =>
        s.style.id !== safeEntry.style.id && s.style.id !== balancedEntry?.style.id
    ) ??
    scored[2];

  const make = (
    tier: "safe" | "balanced" | "bold",
    label: string,
    entry: { style: (typeof STYLE_CATALOG)[0]; score: number } | undefined
  ): StyleRecommendation => {
    const s = entry ?? scored[0];
    return {
      tier,
      label,
      name: s.style.name,
      fitScore: s.score,
      whyItWorks: getWhyItWorks(s.style),
      maintenanceLevel: s.style.maintenanceLevel,
      image: s.style.image,
    };
  };

  return [
    make("safe", "Safe Option", safeEntry),
    make("balanced", "Balanced Option", balancedEntry),
    make("bold", "Bold Option", boldEntry),
  ];
}

// ─────────────────────────────────────────────────
// Change Slider Labels
// ─────────────────────────────────────────────────
function getSliderLabel(value: number): string {
  if (value <= 10) return "Almost the same";
  if (value <= 35) return "Small refresh";
  if (value <= 60) return "Noticeable change";
  if (value <= 80) return "Major change";
  return "Completely new look";
}

// ─────────────────────────────────────────────────
// Slide animation variants
// ─────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

// ─────────────────────────────────────────────────
// Reusable option card
// ─────────────────────────────────────────────────
function OptionCard<T extends string>({
  id,
  selected,
  onSelect,
  icon,
  label,
  description,
}: {
  id: T;
  selected: T;
  onSelect: (v: T) => void;
  icon: string;
  label: string;
  description?: string;
}) {
  const active = selected === id;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 ${
        active
          ? "border-[#c5a880] bg-[#c5a880]/10 shadow-lg shadow-[#c5a880]/10"
          : "border-[#2e2b26] bg-[#1a1816]/60 hover:border-[#3e3a34] hover:bg-[#1f1d1a]/80"
      }`}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span className={`font-semibold text-sm mt-1 ${active ? "text-white" : "text-[#e0d8cd]"}`}>
        {label}
      </span>
      {description && (
        <span className="text-[11px] text-[#8c827a] leading-relaxed">{description}</span>
      )}
      {active && (
        <CheckCircle2 className="w-4 h-4 text-[#c5a880] mt-1 self-end" />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────
export default function DiscoverPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [barberBrief, setBarberBrief] = useState<StyleRecommendation | null>(null);
  const [briefCopied, setBriefCopied] = useState(false);
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);

  const [answers, setAnswers] = useState<DiscoverAnswers>({
    photoUrl: null,
    hairLength: "medium",
    hairTexture: "straight",
    faceShape: "oval",
    stylingTime: "5to10",
    cutFrequency: "monthly",
    stylePriority: "natural",
    changeSlider: 25,
  });

  const update = useCallback(
    <K extends keyof DiscoverAnswers>(key: K, value: DiscoverAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => update("photoUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    const recs = computeRecommendations(answers);
    setRecommendations(recs);
    goTo(5);
  };

  const getBriefText = (rec: StyleRecommendation) => [
    "BARBER BRIEF — UNISEX HAIRCUT",
    `Requested style: ${rec.name}`,
    `Current length: ${answers.hairLength.replace("-", " ")}`,
    `Hair texture: ${answers.hairTexture}`,
    `Sides: Shape to suit the selected style; confirm length before cutting`,
    `Top: Keep the length and texture appropriate for ${rec.name}`,
    `Finish: ${answers.stylePriority === "natural" ? "Natural" : answers.stylePriority === "professional" ? "Polished" : answers.stylePriority === "fashion" ? "Fashion-led" : "Low-stress"}`,
    `Maintenance: ${rec.maintenanceLevel}`,
    "Please confirm the plan together before cutting. This is a preference brief, not a technical prescription.",
  ].join("\n");

  const copyBrief = async () => {
    if (!barberBrief) return;
    try {
      await navigator.clipboard.writeText(getBriefText(barberBrief));
      setBriefCopied(true);
      window.setTimeout(() => setBriefCopied(false), 2000);
    } catch {
      setBriefCopied(false);
    }
  };

  const downloadBrief = () => {
    if (!barberBrief) return;
    const blob = new Blob([getBriefText(barberBrief)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `barber-brief-${barberBrief.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const shareBrief = async () => {
    if (!barberBrief) return;
    const text = getBriefText(barberBrief);
    if (navigator.share) {
      try { await navigator.share({ title: "My Barber Brief", text }); } catch { /* user dismissed share sheet */ }
    } else {
      await copyBrief();
    }
  };

  const TOTAL_STEPS = 5;

  const tierColors: Record<"safe" | "balanced" | "bold", string> = {
    safe: "from-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]",
    balanced: "from-[#c5a880]/10 border-[#c5a880]/40 text-[#c5a880]",
    bold: "from-[#c86d51]/10 border-[#c86d51]/40 text-[#c86d51]",
  };

  const tierBadgeBg: Record<"safe" | "balanced" | "bold", string> = {
    safe: "bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]",
    balanced: "bg-[#c5a880]/10 border-[#c5a880]/30 text-[#c5a880]",
    bold: "bg-[#c86d51]/10 border-[#c86d51]/30 text-[#c86d51]",
  };

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#e0d8cd] flex flex-col font-sans selection:bg-[#c5a880] selection:text-[#0d0c0b]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            I Don&apos;t Know What I Want
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Discover Your Style
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#a09080] max-w-2xl mx-auto leading-relaxed">
            Answer 5 quick steps and we&apos;ll suggest styles tailored to your hair, face, and lifestyle.
          </p>
        </div>

        {/* ── Progress Bar ── */}
        {step < 5 && (
          <div className="mb-8 max-w-lg mx-auto">
            <div className="flex items-center justify-between text-xs text-[#a09080] mb-2 font-medium">
              <span>Step {step} of {TOTAL_STEPS - 1}</span>
              <span>
                {step === 1 && "Photo (optional)"}
                {step === 2 && "Hair Preferences"}
                {step === 3 && "Lifestyle & Maintenance"}
                {step === 4 && "How Much Change?"}
              </span>
            </div>
            <div className="w-full bg-[#1e1c19] h-2 rounded-full overflow-hidden border border-[#2e2b26]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#a88960] to-[#c5a880]"
                initial={false}
                animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* ── Step Container ── */}
        <div className="bg-[#141312] border border-[#2e2b26] rounded-2xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>

            {/* ═══════════════════════════════ STEP 1: Photo Upload ═══════════════════════════ */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="p-6 sm:p-10 space-y-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
                    Add a photo for better suggestions
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a09080] mt-1">
                    Optional — we can still suggest great styles without one.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload photo */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-[#2e2b26] hover:border-[#c5a880] bg-[#1a1816]/40 hover:bg-[#c5a880]/5 transition-all duration-200 group"
                  >
                    {answers.photoUrl ? (
                      <>
                        <img
                          src={answers.photoUrl}
                          alt="Uploaded preview"
                          className="w-24 h-24 rounded-full object-cover border-2 border-[#c5a880]"
                        />
                        <span className="text-sm text-[#c5a880] font-medium">Change photo</span>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Camera className="w-6 h-6 text-[#c5a880]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-white">Upload a photo</p>
                          <p className="text-xs text-[#8c827a] mt-0.5">JPG, PNG up to 5 MB</p>
                        </div>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />

                  {/* Skip */}
                  <button
                    type="button"
                    onClick={() => {
                      update("photoUrl", null);
                      goTo(2);
                    }}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border border-[#2e2b26] bg-[#1a1816]/40 hover:border-[#3e3a34] hover:bg-[#1f1d1a]/80 transition-all duration-200"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#1e1c19] border border-[#2e2b26] flex items-center justify-center">
                      <SkipForward className="w-6 h-6 text-[#a09080]" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#e0d8cd]">Skip — answer questions instead</p>
                      <p className="text-xs text-[#8c827a] mt-0.5">No photo needed</p>
                    </div>
                  </button>
                </div>

                {/* Privacy note */}
                <div className="flex items-center gap-2 text-xs text-[#6e665e] bg-[#1a1816] border border-[#2e2b26] rounded-lg px-4 py-3">
                  <Shield className="w-4 h-4 text-[#c5a880] shrink-0" />
                  <span>Your photo stays on your device — it is never uploaded to our servers.</span>
                </div>

                {answers.photoUrl && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => goTo(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════════════════════ STEP 2: Hair Preferences ═══════════════════════ */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="p-6 sm:p-10 space-y-8"
              >
                {/* Hair Length */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      What&apos;s your current hair length?
                    </h2>
                    <p className="text-xs text-[#a09080] mt-0.5">Pick the closest match to right now.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(
                      [
                        { id: "very-short", icon: "✂️", label: "Very Short" },
                        { id: "short", icon: "💈", label: "Short" },
                        { id: "medium", icon: "🪮", label: "Medium" },
                        { id: "long", icon: "💇", label: "Long" },
                        { id: "very-long", icon: "🌊", label: "Very Long" },
                      ] as const
                    ).map((item) => (
                      <OptionCard
                        key={item.id}
                        id={item.id}
                        selected={answers.hairLength}
                        onSelect={(v) => update("hairLength", v)}
                        icon={item.icon}
                        label={item.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Hair Texture */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      What&apos;s your hair texture?
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { id: "straight", icon: "〰️", label: "Straight", description: "Lies flat naturally" },
                        { id: "wavy", icon: "〜", label: "Wavy", description: "S-shaped waves" },
                        { id: "curly", icon: "🌀", label: "Curly", description: "Defined spirals" },
                        { id: "coily", icon: "🔄", label: "Coily", description: "Tight zig-zag coils" },
                      ] as const
                    ).map((item) => (
                      <OptionCard
                        key={item.id}
                        id={item.id}
                        selected={answers.hairTexture}
                        onSelect={(v) => update("hairTexture", v)}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>

                {/* Face Shape */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      What&apos;s your face shape?
                    </h2>
                    <p className="text-xs text-[#a09080] mt-0.5">Not sure? Go with your best guess.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(
                      [
                        { id: "oval", icon: "🥚", label: "Oval", description: "Balanced, slightly longer" },
                        { id: "square", icon: "⬛", label: "Square", description: "Strong jaw, equal widths" },
                        { id: "round", icon: "⭕", label: "Round", description: "Full cheeks, equal width/height" },
                        { id: "heart", icon: "♥️", label: "Heart", description: "Wide brow, pointed chin" },
                        { id: "diamond", icon: "💎", label: "Diamond", description: "Narrow brow and chin" },
                      ] as const
                    ).map((item) => (
                      <OptionCard
                        key={item.id}
                        id={item.id}
                        selected={answers.faceShape}
                        onSelect={(v) => update("faceShape", v)}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════ STEP 3: Lifestyle & Maintenance ═══════════════ */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="p-6 sm:p-10 space-y-8"
              >
                {/* Styling Time */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      How much daily styling time do you have?
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { id: "under5", icon: "⚡", label: "Under 5 min", description: "Wash & go" },
                        { id: "5to10", icon: "☕", label: "5–10 min", description: "Quick routine" },
                        { id: "10to20", icon: "🪥", label: "10–20 min", description: "Some effort" },
                        { id: "20plus", icon: "🎨", label: "20+ min", description: "Full styling" },
                      ] as const
                    ).map((item) => (
                      <OptionCard
                        key={item.id}
                        id={item.id}
                        selected={answers.stylingTime}
                        onSelect={(v) => update("stylingTime", v)}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>

                {/* Cut Frequency */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      How often do you get a haircut?
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(
                      [
                        { id: "biweekly", icon: "📅", label: "Every 2 weeks", description: "High upkeep" },
                        { id: "monthly", icon: "🗓️", label: "Monthly", description: "Regular" },
                        { id: "every6weeks", icon: "📆", label: "Every 6 weeks", description: "Moderate" },
                        { id: "2months", icon: "🌙", label: "Every 2+ months", description: "Low upkeep" },
                      ] as const
                    ).map((item) => (
                      <OptionCard
                        key={item.id}
                        id={item.id}
                        selected={answers.cutFrequency}
                        onSelect={(v) => update("cutFrequency", v)}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>

                {/* Style Priority */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      What matters most to you?
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        { id: "professional", icon: "💼", label: "Looking sharp & professional", description: "Crisp edges, clean lines, polished every day" },
                        { id: "natural", icon: "🌿", label: "Natural & effortless", description: "Looks great with minimal effort" },
                        { id: "fashion", icon: "✨", label: "Fashion-forward", description: "Trendy cuts, color, bold statements" },
                        { id: "health", icon: "💚", label: "Hair health", description: "Nourishing treatments, damage repair" },
                      ] as const
                    ).map((item) => (
                      <OptionCard
                        key={item.id}
                        id={item.id}
                        selected={answers.stylePriority}
                        onSelect={(v) => update("stylePriority", v)}
                        icon={item.icon}
                        label={item.label}
                        description={item.description}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(4)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors shadow-lg shadow-[#c5a880]/20"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════ STEP 4: Safe ↔ Bold Slider ═══════════════════ */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="p-6 sm:p-10 space-y-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-[#c5a880] text-xs uppercase tracking-widest font-semibold mb-2">
                    <Sliders className="w-4 h-4" />
                    Safe Change → Bold Change
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-semibold text-white">
                    How much change are you ready for?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a09080] mt-2">
                    Drag the slider to tell us how dramatic you want your new look to be.
                  </p>
                </div>

                {/* Current label */}
                <motion.div
                  className="text-center"
                  key={getSliderLabel(answers.changeSlider)}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-3xl sm:text-4xl font-display font-bold text-white">
                    {getSliderLabel(answers.changeSlider)}
                  </span>
                  <div className="text-lg font-semibold text-[#c5a880] mt-1">
                    {answers.changeSlider}
                    <span className="text-sm text-[#a09080] ml-1">/ 100</span>
                  </div>
                </motion.div>

                {/* Slider */}
                <div className="px-2">
                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={answers.changeSlider}
                      onChange={(e) => update("changeSlider", Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #c5a880 0%, #c5a880 ${answers.changeSlider}%, #2e2b26 ${answers.changeSlider}%, #2e2b26 100%)`,
                      }}
                    />
                  </div>

                  {/* Tick labels */}
                  <div className="flex justify-between mt-3 text-[10px] sm:text-xs text-[#6e665e] font-medium px-1">
                    <span>Almost same</span>
                    <span>Small refresh</span>
                    <span>Noticeable</span>
                    <span>Major</span>
                    <span>Completely new</span>
                  </div>
                </div>

                {/* Visual cue */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { range: "0–33", label: "Safe Zone", color: "#22c55e", icon: "🛡️" },
                    { range: "34–66", label: "Balanced", color: "#c5a880", icon: "⚖️" },
                    { range: "67–100", label: "Bold Territory", color: "#c86d51", icon: "🔥" },
                  ].map((zone) => {
                    const val = answers.changeSlider;
                    const [lo, hi] = zone.range.split("–").map(Number);
                    const active = val >= lo && val <= hi;
                    return (
                      <div
                        key={zone.range}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          active
                            ? "border-opacity-60 bg-opacity-10"
                            : "border-[#1e1c19] bg-[#141312] opacity-40"
                        }`}
                        style={
                          active
                            ? { borderColor: zone.color + "66", backgroundColor: zone.color + "14" }
                            : {}
                        }
                      >
                        <div className="text-xl">{zone.icon}</div>
                        <div
                          className="text-xs font-semibold mt-1"
                          style={{ color: active ? zone.color : "#6e665e" }}
                        >
                          {zone.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => goTo(3)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#c5a880] to-[#e4c9a4] text-[#0d0c0b] font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#c5a880]/25"
                  >
                    <Sparkles className="w-4 h-4" /> Show My Best Options
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════ STEP 5: Results ═══════════════════════════════ */}
            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-6 sm:p-10 space-y-8"
              >
                {/* Results header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2b26] pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs font-semibold uppercase tracking-wider mb-2">
                      <Zap className="w-3.5 h-3.5" /> YOUR BEST OPTIONS
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                      Styles Matched to You
                    </h2>
                    <p className="text-sm text-[#a09080] mt-1">
                      Based on your hair type, face shape, lifestyle &amp; change comfort
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="self-start sm:self-auto inline-flex items-center gap-2 text-xs sm:text-sm text-[#a09080] hover:text-[#c5a880] transition-colors border border-[#2e2b26] px-3.5 py-2 rounded-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake
                  </button>
                </div>

                {/* AI Disclaimer */}
                <div className="flex items-start gap-3 bg-[#1a1816] border border-[#c86d51]/30 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-[#c86d51] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#a09080] leading-relaxed">
                    <strong className="text-[#e0d8cd]">⚠️ AI-Assisted Suggestions:</strong>{" "}
                    These are style suggestions based on your preferences and are not guaranteed recommendations.
                    Consult your stylist for professional advice before making any changes.
                  </p>
                </div>

                {/* Recommendation cards */}
                <div className="space-y-6">
                  {recommendations.map((rec, idx) => (
                    <motion.div
                      key={rec.tier}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12, duration: 0.35 }}
                      className={`rounded-2xl border bg-gradient-to-br ${tierColors[rec.tier]} from-[#141312] overflow-hidden`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
                        {/* Style image */}
                        <div className="sm:col-span-4 relative aspect-[4/3] sm:aspect-auto min-h-[200px]">
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Tier badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${tierBadgeBg[rec.tier]} backdrop-blur-sm`}
                            >
                              {rec.tier === "safe" && "🛡️"}
                              {rec.tier === "balanced" && "⚖️"}
                              {rec.tier === "bold" && "🔥"}
                              {rec.label}
                            </span>
                          </div>
                        </div>

                        {/* Style details */}
                        <div className="sm:col-span-8 p-5 sm:p-6 flex flex-col gap-4">
                          {/* Name + Score */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">
                                {rec.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tierBadgeBg[rec.tier]}`}
                                >
                                  AI Suggestion
                                </span>
                              </div>
                            </div>
                            {/* Fit Score ring */}
                            <div className="shrink-0 flex flex-col items-center">
                              <div className="relative w-14 h-14">
                                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                  <circle cx="28" cy="28" r="22" fill="none" stroke="#2e2b26" strokeWidth="4" />
                                  <circle
                                    cx="28"
                                    cy="28"
                                    r="22"
                                    fill="none"
                                    stroke={rec.tier === "safe" ? "#22c55e" : rec.tier === "balanced" ? "#c5a880" : "#c86d51"}
                                    strokeWidth="4"
                                    strokeDasharray={`${(rec.fitScore / 100) * 138.2} 138.2`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">{rec.fitScore}</span>
                                </div>
                              </div>
                              <span className="text-[9px] text-[#6e665e] mt-1 uppercase tracking-wider">Fit Score</span>
                            </div>
                          </div>

                          {/* Why it works */}
                          <ul className="space-y-1.5">
                            {rec.whyItWorks.map((reason, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#e0d8cd]">
                                <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Maintenance */}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#a09080]" />
                            <span className="text-xs text-[#a09080]">
                              Maintenance:{" "}
                              <span className="text-[#e0d8cd] font-medium">{rec.maintenanceLevel}</span>
                            </span>
                            <div className="flex gap-1 ml-1">
                              {["Low", "Medium", "High"].map((lvl) => (
                                <div
                                  key={lvl}
                                  className={`w-2 h-2 rounded-full ${
                                    (lvl === "Low" && rec.maintenanceLevel !== "High" && rec.maintenanceLevel !== "Medium") ||
                                    (lvl === "Medium" && (rec.maintenanceLevel === "Medium" || rec.maintenanceLevel === "High")) ||
                                    (lvl === "High" && rec.maintenanceLevel === "High")
                                      ? "bg-[#c5a880]"
                                      : "bg-[#2e2b26]"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <Link
                              href="/book"
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c5a880] text-[#0d0c0b] font-semibold text-sm hover:bg-[#d4b898] transition-colors"
                            >
                              <Scissors className="w-4 h-4" /> Book This Style
                            </Link>
                            <button
                              type="button"
                              onClick={() => setBarberBrief(rec)}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-sm text-[#e0d8cd] hover:border-[#c5a880] hover:text-[#c5a880] transition-colors"
                            >
                              <BookOpen className="w-4 h-4" /> Show My Barber
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {barberBrief && (
                  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm" onClick={() => setBarberBrief(null)}>
                    <section role="dialog" aria-modal="true" aria-labelledby="barber-brief-title" className="w-full max-w-lg rounded-2xl border border-[#c5a880]/40 bg-[#141312] p-5 sm:p-7 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[#c5a880] text-xs uppercase tracking-[0.2em] font-semibold">Your appointment card</p>
                          <h2 id="barber-brief-title" className="font-display text-2xl text-white mt-1">Show My Barber</h2>
                        </div>
                        <button type="button" aria-label="Close barber brief" onClick={() => setBarberBrief(null)} className="rounded-lg p-2 text-[#a09080] hover:text-white focus-visible:outline"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="mt-5 rounded-xl border border-[#2e2b26] bg-[#0d0c0b] p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#2e2b26] pb-3">
                          <span className="text-xs tracking-[0.18em] text-[#c5a880] font-semibold">BARBER BRIEF</span>
                          <Scissors className="w-4 h-4 text-[#c5a880]" />
                        </div>
                        <div><p className="text-[11px] text-[#78716c] uppercase tracking-wider">Requested style</p><p className="text-white text-lg font-semibold mt-0.5">{barberBrief.name}</p></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-[11px] text-[#78716c] uppercase tracking-wider">Current length</p><p className="text-[#e0d8cd] mt-1 capitalize">{answers.hairLength.replace("-", " ")}</p></div>
                          <div><p className="text-[11px] text-[#78716c] uppercase tracking-wider">Texture</p><p className="text-[#e0d8cd] mt-1 capitalize">{answers.hairTexture}</p></div>
                          <div><p className="text-[11px] text-[#78716c] uppercase tracking-wider">Finish</p><p className="text-[#e0d8cd] mt-1">{answers.stylePriority === "natural" ? "Natural" : answers.stylePriority === "professional" ? "Polished" : answers.stylePriority === "fashion" ? "Fashion-led" : "Low-stress"}</p></div>
                          <div><p className="text-[11px] text-[#78716c] uppercase tracking-wider">Maintenance</p><p className="text-[#e0d8cd] mt-1">{barberBrief.maintenanceLevel}</p></div>
                        </div>
                        <p className="text-xs leading-relaxed text-[#a09080] border-t border-[#2e2b26] pt-3">Please agree on the exact lengths together before cutting. This brief describes preferences, not a guaranteed result.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <button type="button" onClick={copyBrief} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2e2b26] py-2.5 text-xs text-[#e0d8cd] hover:border-[#c5a880]"><Clipboard className="w-3.5 h-3.5" />{briefCopied ? "Copied" : "Copy"}</button>
                        <button type="button" onClick={shareBrief} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#2e2b26] py-2.5 text-xs text-[#e0d8cd] hover:border-[#c5a880]"><Share2 className="w-3.5 h-3.5" />Share</button>
                        <button type="button" onClick={downloadBrief} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#c5a880] py-2.5 text-xs font-semibold text-[#0d0c0b] hover:bg-[#d4b898]"><Download className="w-3.5 h-3.5" />Save</button>
                      </div>
                    </section>
                  </div>
                )}

                {/* Photo preview if provided */}
                {answers.photoUrl && (
                  <div className="flex items-center gap-3 text-xs text-[#6e665e] bg-[#1a1816] border border-[#2e2b26] rounded-lg px-4 py-3">
                    <img
                      src={answers.photoUrl}
                      alt="Your photo"
                      className="w-8 h-8 rounded-full object-cover border border-[#2e2b26]"
                    />
                    <div>
                      <span className="text-[#a09080]">Suggestions also factored in your uploaded photo.</span>
                      <br />
                      <span className="flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-[#c5a880]" />
                        Photo stays on your device — never uploaded.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => goTo(4)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2e2b26] text-xs sm:text-sm text-[#a09080] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Adjust Answers
                  </button>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center gap-2 text-xs text-[#a09080] hover:text-[#c5a880] transition-colors"
                  >
                    Want a deeper analysis? <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Footer note ── */}
        <p className="mt-10 text-center text-xs text-[#4a4540]">
          Every result comes with a complimentary in-chair consultation before your stylist picks up the scissors.
        </p>
      </main>

      <Footer />

      {/* Slider thumb style injection */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #c5a880;
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.25), 0 2px 8px rgba(0,0,0,0.6);
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 0 5px rgba(197, 168, 128, 0.3), 0 4px 12px rgba(0,0,0,0.6);
        }
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #c5a880;
          border: none;
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.25);
          cursor: pointer;
        }
        input[type="range"]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
