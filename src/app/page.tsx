"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, ChevronRight, Sparkles, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn, AnimatedCounter } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/types";

const heroImages = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=1920&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1920&auto=format&fit=crop&q=80",
];

const testimonials = [
  {
    name: "Ramesh K.",
    rating: 5,
    text: "Aarav gave me the sharpest fade I have ever had. Been coming every 5 weeks without fail — my Style Streak is at 6 now! The bonus points are a great touch.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Sunita R.",
    rating: 5,
    text: "Priya is an absolute artist with colour. The balayage she did for my wedding looked stunning in every photo. The salon atmosphere is so warm and welcoming.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
  },
  {
    name: "Dinesh T.",
    rating: 5,
    text: "The 35-day reminder is incredibly thoughtful. Never miss a trim now. Love the loyalty streak — just unlocked a free beard trim on my 4th visit!",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
  },
];

const serviceHighlights = [
  { name: "Precision Barber Cut", category: "Short Cuts", price: 450, icon: "✂️", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80" },
  { name: "Full Dimension Balayage", category: "Color", price: 4500, icon: "🎨", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80" },
  { name: "Sculpted Beard & Razor Edge", category: "Beard Trim", price: 350, icon: "🪒", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80" },
  { name: "Keratin Smooth Gloss", category: "Treatments", price: 4200, icon: "✨", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80" },
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [homePhotos, setHomePhotos] = useState<GalleryPhoto[]>([]);
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/gallery?home=true")
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.photos?.length > 0) {
          setHomePhotos(data.photos);
        }
      })
      .catch(() => {
        // keep empty
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="pb-24 lg:pb-0">

        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={heroIndex} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 1.2 }} className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImages[heroIndex]} alt="Salon" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0d0c0b]/60 via-[#0d0c0b]/30 to-[#0d0c0b]" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <span className="inline-block text-[#c5a880] text-xs font-semibold tracking-wide mb-6 border border-[#c5a880]/30 px-4 py-2 rounded-full">
                ✦ Ratan Complex · Birtamode, Nepal ✦
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="text-5xl sm:text-6xl lg:text-6xl font-bold leading-[0.95] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-white">Where Every </span>
              <span className="text-gold-gradient">Cut</span><br />
              <span className="text-white">Tells a </span>
              <span className="italic" style={{ color: "#c86d51" }}>Story</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="text-[#b0a090] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Boutique barbershop meets modern salon — premium haircuts, expert colour, luxe beard grooming, and treatments crafted for everyone.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book" className="flex items-center gap-3 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-xl shadow-[#c5a880]/30 hover:-translate-y-0.5">
                <Scissors className="w-5 h-5" /> Book Your Appointment
              </Link>
              <Link href="/consultation" className="flex items-center gap-2 border border-[#c5a880]/60 hover:border-[#c5a880] text-[#f3efe6] px-8 py-4 rounded-xl font-medium text-base transition-all duration-200 bg-[#1a1816]/80 hover:bg-[#c5a880]/15">
                <Compass className="w-4 h-4 text-[#c5a880]" /> Face Shape Quiz <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }} className="flex flex-wrap items-center justify-center gap-4 mt-12">
              {["20-120 min sessions", "Loyalty Rewards", "Online Booking", "35-Day Reminders", "Owner-Curated Lookbook"].map((p) => (
                <span key={p} className="text-[#78716c] text-sm border border-[#2e2b26] px-3 py-1.5 rounded-full">{p}</span>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 border-2 border-[#c5a880]/40 rounded-full flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-[#c5a880] rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="bg-[#141312] border-y border-[#2e2b26] py-8">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ value: 3, suffix: "+", label: "Years in Birtamode" }, { value: 2000, suffix: "+", label: "Happy Clients" }, { value: 4, suffix: "", label: "Expert Stylists" }, { value: 15, suffix: "+", label: "Services Available" }].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[#c5a880] text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[#78716c] text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES HIGHLIGHTS */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Our Craft</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Services Built for Everyone</h2>
            <p className="text-[#78716c] text-base mt-4 max-w-xl mx-auto">Six curated categories, countless ways to elevate your style.</p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.1}>
                <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-2xl">{s.icon}</span>
                    <span className="absolute top-3 right-3 bg-[#c5a880]/20 text-[#c5a880] text-xs px-2 py-1 rounded-full border border-[#c5a880]/30">{s.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-base">{s.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#c5a880] font-bold">{formatCurrency(s.price)}</span>
                      <Link href="/book" className="text-[#78716c] hover:text-[#c5a880] text-xs font-medium flex items-center gap-1 transition-colors">
                        Book <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="text-center mt-10">
            <Link href="/services" className="inline-flex items-center gap-2 border border-[#2e2b26] hover:border-[#c5a880] text-[#e0d8cd] px-6 py-3 rounded-xl text-sm font-medium transition-all">
              View All 15 Services <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </section>

        {/* UNIQUE FEATURE: STYLE STREAK */}
        <section className="py-20 px-4 bg-[#0f0e0d]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <span className="text-[#c86d51] text-xs font-semibold tracking-[0.25em] uppercase">Unique Feature</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mt-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Build Your <br /><span className="text-terracotta-gradient">Style Streak 🔥</span>
              </h2>
              <p className="text-[#78716c] text-base mt-5 leading-relaxed max-w-lg">
                Come back within 35-40 days of your last cut to keep your streak alive. Each visit earns loyalty points, and every 4th consecutive visit unlocks a free add-on or discount.
              </p>
              <div className="mt-8 space-y-4">
                {[{ icon: "🔥", text: "Streak Bonus Points — 20 extra on every return visit within the window" }, { icon: "🎁", text: "4th Visit Perk — Free beard trim, conditioning mask, or scalp treatment" }, { icon: "🏆", text: "Milestone Badges — Style Icon, Consistent Groomer, Ratan VIP Club" }, { icon: "📲", text: "Smart Reminder — Auto alert 35 days after your last cut" }].map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-[#b0a090] text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Link href="/auth" className="bg-[#c86d51] hover:bg-[#d47a5e] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#c86d51]/25">Start Your Streak</Link>
                <Link href="/dashboard" className="text-[#c5a880] text-sm font-medium hover:underline">View Dashboard →</Link>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <div className="glass-card rounded-3xl p-8 bg-streak-glow">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#78716c] text-sm">Your Style Streak</p>
                    <p className="text-white text-5xl font-bold mt-1 flex items-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      3 <span className="flame-animated text-4xl">🔥</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#78716c] text-sm">Loyalty Points</p>
                    <p className="text-[#c5a880] text-3xl font-bold mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>145</p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-[#78716c] mb-2">
                    <span>Progress to Free Beard Trim</span><span>3/4 visits</span>
                  </div>
                  <div className="h-2 bg-[#2e2b26] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full rounded-full" style={{ background: "linear-gradient(to right, #c86d51, #f29a7e)" }} />
                  </div>
                </div>
                <div className="flex gap-3 mb-6">
                  {[{ icon: "✂️", label: "Fresh Beginnings" }, { icon: "⏱️", label: "35-Day Precision" }].map((b) => (
                    <div key={b.label} className="flex-1 bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-xl p-3 text-center">
                      <span className="text-2xl">{b.icon}</span>
                      <p className="text-[#c5a880] text-xs mt-1 font-medium">{b.label}</p>
                    </div>
                  ))}
                  <div className="flex-1 bg-[#78716c]/10 border border-dashed border-[#78716c]/30 rounded-xl p-3 text-center opacity-60">
                    <span className="text-2xl">🔥</span>
                    <p className="text-[#78716c] text-xs mt-1 font-medium">Style Icon</p>
                  </div>
                </div>
                <div className="bg-[#c86d51]/10 border border-[#c86d51]/30 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-[#c86d51] text-lg">💈</span>
                  <div>
                    <p className="text-[#f0d0c0] text-sm font-semibold">Time for a Fresh Look!</p>
                    <p className="text-[#c86d51] text-xs mt-0.5">37 days since last cut — visit now to keep your streak!</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* UNIQUE FEATURE: HAIRSTYLE & FACE SHAPE CONSULTATION CALLOUT */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto glass-card rounded-3xl p-8 lg:p-12 border border-[#c5a880]/30 relative overflow-hidden bg-gradient-to-r from-[#181614] via-[#121110] to-[#1c1612]">
            <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase inline-flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Salon Experience
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Not Sure Which Style Suits You?
                </h2>
                <p className="text-[#b0a090] text-base mt-4 max-w-xl leading-relaxed">
                  Take our 60-second Face Shape & Hair Texture Consultation Quiz. Our smart diagnostic tool matches your jawline, density, and lifestyle with the exact right haircut and stylist specialist.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <Link
                    href="/consultation"
                    className="flex items-center gap-2 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#c5a880]/20"
                  >
                    <Compass className="w-4 h-4" /> Start Style Consultation Now
                  </Link>
                  <Link
                    href="/stylists"
                    className="flex items-center gap-2 border border-[#2e2b26] text-[#e0d8cd] px-5 py-3.5 rounded-xl text-sm font-medium hover:border-[#c5a880] transition-colors"
                  >
                    View Stylist Specialties
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-[#141312] border border-[#c5a880]/30 rounded-2xl p-6 text-center max-w-xs shadow-2xl">
                  <span className="text-4xl block mb-2">📐</span>
                  <p className="text-white font-bold text-base">Face Shape Analysis</p>
                  <p className="text-[#78716c] text-xs mt-1">Oval · Square · Round · Heart · Diamond</p>
                  <div className="mt-4 pt-4 border-t border-[#2e2b26] text-left space-y-2">
                    <p className="text-xs text-[#c5a880] flex items-center gap-1.5 font-medium">
                      ✓ Instant Tailored Cut Suggestion
                    </p>
                    <p className="text-xs text-[#c5a880] flex items-center gap-1.5 font-medium">
                      ✓ Best Matched Salon Stylist
                    </p>
                    <p className="text-xs text-[#c5a880] flex items-center gap-1.5 font-medium">
                      ✓ Optimal Maintenance Window
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC OWNER-CURATED LOOKBOOK GALLERY STRIP */}
        <section className="py-16 overflow-hidden">
          <FadeIn className="text-center mb-8 px-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">
                Owner-Curated Lookbook
              </span>
              {isOwner && (
                <Link href="/admin" className="text-xs bg-[#c5a880] text-[#141312] px-2 py-0.5 rounded-full font-bold">
                  👑 Edit on Owner Studio
                </Link>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Fresh Transformations from the Chair
            </h2>
            <p className="text-[#78716c] text-sm mt-2 max-w-md mx-auto">
              Real results hand-picked and verified by our salon directors at Ratan Complex.
            </p>
          </FadeIn>

          {/* Automatic Dynamic Editorial Grid Formatting */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[190px]">
              {homePhotos.map((photo, i) => {
                // Dynamic automatic grid layout based on item index and aspect ratio
                const isHero = i === 0;
                const isWide = photo.aspectRatio === "wide";
                const isTall = photo.aspectRatio === "portrait" && i % 3 === 0;

                const colSpanClass = isHero
                  ? "col-span-2 row-span-2"
                  : isWide
                  ? "sm:col-span-2 row-span-1"
                  : isTall
                  ? "row-span-2"
                  : "row-span-1 sm:row-span-2";

                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 6) * 0.06 }}
                    viewport={{ once: true }}
                    className={`group relative rounded-2xl overflow-hidden border border-[#2e2b26] bg-[#141312] ${colSpanClass}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b]/90 via-[#0d0c0b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs bg-[#c5a880]/20 text-[#c5a880] px-2 py-0.5 rounded-full border border-[#c5a880]/30 font-semibold uppercase">
                        {photo.category}
                      </span>
                      <p className="text-white text-xs mt-1.5 line-clamp-2 leading-tight font-medium">
                        {photo.caption}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 bg-[#1a1816] border border-[#2e2b26] hover:border-[#c5a880] text-[#e0d8cd] hover:text-[#c5a880] px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                View Complete Salon Lookbook ({homePhotos.length}+ Styles) <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-4 max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Client Love</span>
            <h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Stories from Birtamode</h2>
          </FadeIn>
          <div className="relative min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }} className="glass-card rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-[#c5a880]">★</span>
                  ))}
                </div>
                <p className="text-[#d0c8be] text-lg leading-relaxed italic mb-6">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} className="w-10 h-10 rounded-full object-cover border-2 border-[#c5a880]/30" />
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonials[activeTestimonial].name}</p>
                    <p className="text-[#78716c] text-xs">Verified Client — Birtamode</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${i === activeTestimonial ? "w-8 bg-[#c5a880]" : "w-2 bg-[#2e2b26]"}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* LOCATION TEASER */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto glass-card rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <FadeIn>
                  <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase mb-4 block">Visit Us</span>
                  <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Find Us in Birtamode</h2>
                  <div className="space-y-3 text-sm text-[#78716c]">
                    <div className="flex gap-3"><span>📍 Ratan Complex, Bhadrapur Bus Stand, Birtamode, Jhapa, Nepal</span></div>
                    <div className="flex gap-3"><span>🕐 Mon-Fri: 9 AM - 8 PM · Sat-Sun: 8 AM - 9 PM</span></div>
                  </div>
                  <Link href="/contact" className="inline-flex items-center gap-2 mt-6 bg-[#c5a880] text-[#141312] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#d4b898] transition-colors">
                    Get Directions <ChevronRight className="w-4 h-4" />
                  </Link>
                </FadeIn>
              </div>
              <div className="relative h-64 md:h-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80" alt="Salon" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 px-4">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Ready for Your <span className="text-gold-gradient">Transformation?</span>
              </h2>
              <p className="text-[#78716c] text-lg mb-8 max-w-xl mx-auto">Book in seconds. Walk out confident. Come back in 35 days to keep your Style Streak alive.</p>
              <Link href="/book" className="inline-flex items-center gap-3 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-[#c5a880]/30 hover:-translate-y-1">
                <Scissors className="w-6 h-6" /> Book Your Appointment
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </>
  );
}
