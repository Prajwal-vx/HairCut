"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HomeTestimonials from "@/app/home-testimonials";
import { Award, ArrowUpRight, CalendarDays, ChevronRight, Clock, Compass, MapPin, Play, Scissors, Sparkles, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn, AnimatedCounter } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/types";

const heroImage = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&auto=format&fit=crop&q=75";
const heroPortrait = "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1600&auto=format&fit=crop&q=80";

const serviceHighlights = [
  { name: "Precision Barber Cut", category: "Short Cuts", price: 450, icon: "✂️", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80" },
  { name: "Full Dimension Balayage", category: "Color", price: 4500, icon: "🎨", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80" },
  { name: "Sculpted Beard & Razor Edge", category: "Beard Trim", price: 350, icon: "🪒", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80" },
  { name: "Keratin Smooth Gloss", category: "Treatments", price: 4200, icon: "✨", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80" },
  { name: "Luxe Moroccan Oil Blowout", category: "Styling", price: 750, icon: "✧", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80" },
];

export default function HomePage() {
  const [homePhotos, setHomePhotos] = useState<GalleryPhoto[]>([]);
  const { user } = useAuth();
  const isOwner = user?.role === "OWNER";

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
      <Navbar showAnnouncement />
      <MobileBookBar />
      <main className="pb-24 lg:pb-0">

        {/* HERO */}
        <section className="home-hero relative min-h-[min(800px,100svh)] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
              <Image src={heroPortrait} alt="Long, dimensional hair styled at Uptown Hair" fill priority sizes="100vw" quality={75} className="object-cover object-[65%_center]" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0b]/95 via-[#0d0c0b]/80 to-[#0d0c0b]/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-[#0d0c0b]/40" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_.9fr] items-center gap-8 pt-28 pb-24 lg:pt-32 lg:pb-24">
            <div className="max-w-3xl text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
              <span className="inline-flex items-center gap-2 text-[#dfc8a8] text-[10px] sm:text-xs font-semibold tracking-[0.17em] uppercase mb-7">
                <span className="w-7 h-px bg-[#c5a880]" /> Expert stylists · Exceptional you
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="text-[3.5rem] sm:text-7xl lg:text-[5.2rem] font-semibold leading-[.86] tracking-[-.035em] mb-7" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-white block">Your Hair.</span>
              <span className="text-white block">Your Style.</span>
              <span className="italic text-gold-gradient block">Your Confidence.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="text-[#d0c5b9] text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-9 leading-[1.8]">
              Personalised cuts, colour, and care to bring your own style into focus. Thoughtful service for everyone, right here in Birtamode.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link href="/book" className="flex w-full sm:w-auto items-center justify-center gap-3 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#141312] px-6 sm:px-8 py-3.5 rounded-md font-bold text-[11px] tracking-wide uppercase transition-all duration-300 shadow-xl shadow-[#c5a880]/20 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dfc8a8]">
                Book Appointment <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="flex w-full sm:w-auto items-center justify-center gap-2 border border-[#c5a880]/55 hover:border-[#dfc8a8] text-[#f3efe6] px-6 sm:px-7 py-3.5 rounded-md font-semibold text-[11px] tracking-wide uppercase transition-all duration-200 bg-[#141312]/50 backdrop-blur-sm">
                Our Services <ChevronRight className="w-4 h-4 text-[#c5a880]" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }} className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-8 text-xs sm:text-sm text-[#c4b8aa]">
              {["Personalised care", "All styles welcome"].map((p) => (
                <span key={p} className="inline-flex items-center gap-2"><span className="text-[#c5a880]">✦</span>{p}</span>
              ))}
            </motion.div>
            </div>

            <motion.aside initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="hidden lg:flex min-h-[440px] items-end justify-end pb-10">
              <Link href="/about" className="group flex items-center gap-3 text-right text-white hover:text-[#dfc8a8] transition-colors">
                <span className="text-[10px] font-semibold uppercase tracking-[.2em]">Discover our salon story</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfc8a8]/75 bg-[#0d0c0b]/35 transition-all group-hover:bg-[#c5a880] group-hover:text-[#141312]"><Play className="ml-0.5 h-4 w-4" /></span>
              </Link>
            </motion.aside>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 border-2 border-[#c5a880]/40 rounded-full flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-[#c5a880] rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="bg-[#11100e] border-y border-[#2e2b26] py-5 sm:py-6">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-y-5">
            {[{ value: 3, suffix: "+", label: "Years in Birtamode", icon: CalendarDays }, { value: 2000, suffix: "+", label: "Happy Clients", icon: Users }, { value: 4, suffix: "", label: "Expert Stylists", icon: Scissors }, { value: 15, suffix: "+", label: "Services Available", icon: Award }].map((stat, i) => (
              <div key={stat.label} className={`flex items-center justify-center gap-3 text-left ${i % 2 === 0 ? "lg:border-r lg:border-[#2e2b26]" : ""} ${i < 2 ? "sm:border-b sm:border-[#2e2b26] sm:pb-5 lg:border-b-0 lg:pb-0" : ""}`}>
                <stat.icon className="h-6 w-6 shrink-0 text-[#c5a880]" strokeWidth={1.4} />
                <div><p className="text-[#e2c79c] text-2xl sm:text-3xl font-semibold leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p><p className="text-[#a99c8e] text-[9px] sm:text-[10px] mt-1 uppercase tracking-[.12em]">{stat.label}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES HIGHLIGHTS */}
        <section className="py-16 sm:py-20 px-4 max-w-7xl mx-auto">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-10">
            <div>
            <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Our Craft</span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-white mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Beauty. Care. Expertise.</h2>
            <p className="text-[#a99c8e] text-sm mt-2 max-w-xl">A considered menu of services, tailored to your style.</p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.15em] text-[#dfc8a8] border border-[#806b4e] px-4 py-3 rounded-sm hover:bg-[#c5a880] hover:text-[#141312] transition-colors">View all services <ArrowUpRight className="w-4 h-4" /></Link>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {serviceHighlights.map((s, i) => (
              <FadeIn key={s.name} delay={i * 0.1}>
                <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={s.image} alt={s.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" quality={72} className="object-cover group-hover:scale-105 transition-transform duration-500" onError={(event) => { event.currentTarget.style.display = "none"; }} />
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
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      quality={70}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(event) => { event.currentTarget.style.display = "none"; }}
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

        <HomeTestimonials />

        {/* SALON STORY & LOCATION */}
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            <FadeIn className="relative min-h-[300px] sm:min-h-[420px] rounded-sm overflow-hidden bg-gradient-to-br from-[#4a3527] via-[#221a15] to-[#0d0c0b]">
              <Image src={heroImage} alt="Salon interior and barber stations at Uptown Hair" fill sizes="(max-width: 768px) 100vw, 50vw" quality={75} className="object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[.18em] text-white/85">Uptown Hair · Birtamode</span>
            </FadeIn>
            <FadeIn direction="left">
              <span className="text-[#c5a880] text-[10px] font-semibold tracking-[.24em] uppercase">A salon for your style</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mt-3 leading-[.98]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Where passion<br />meets perfection.</h2>
              <p className="text-[#b7aa9c] text-sm leading-[1.85] mt-5 max-w-xl">At Uptown Hair, every visit starts with listening. Our team brings together thoughtful consultation, skilled hands, and a full menu of cuts, colour, grooming, and care.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {["Personalised consultation", "Care for every texture", "A skilled salon team", "For everyone"].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-[11px] text-[#d0c5b9]"><Sparkles className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />{item}</span>
                ))}
              </div>
              <div className="mt-7 border-t border-[#2e2b26] pt-5 space-y-3 text-xs text-[#b7aa9c]">
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#c5a880] shrink-0" /> Ratan Complex, Bhadrapur Bus Stand, Birtamode, Jhapa</p>
                <p className="flex items-start gap-2"><Clock className="w-4 h-4 text-[#c5a880] shrink-0" /> Mon–Fri 9 AM–8 PM · Sat–Sun 8 AM–9 PM</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/about" className="inline-flex items-center gap-2 border border-[#806b4e] px-4 py-3 text-[10px] font-semibold uppercase tracking-[.13em] text-[#e2c79c] hover:bg-[#c5a880] hover:text-[#141312] transition-colors">More about us <ArrowUpRight className="w-4 h-4" /></Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[.13em] text-[#b7aa9c] hover:text-white transition-colors">Get directions <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-14 sm:py-20 px-4">
          <FadeIn>
            <div className="max-w-7xl mx-auto grid sm:grid-cols-[auto_1fr_auto] items-center gap-5 sm:gap-8 rounded-sm border border-[#2e2b26] bg-gradient-to-r from-[#171411] to-[#100f0d] px-5 py-6 sm:px-8 sm:py-7">
              <span className="hidden sm:flex w-14 h-14 items-center justify-center rounded-full border border-[#806b4e] text-[#dfc8a8]"><CalendarDays className="w-6 h-6" /></span>
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready for a new you?</h2>
                <p className="text-[#a99c8e] text-xs sm:text-sm mt-2">Choose your service and let our team take it from there.</p>
              </div>
              <Link href="/book" className="inline-flex items-center justify-center gap-2 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#141312] px-6 py-3.5 rounded-sm font-bold text-[10px] tracking-[.12em] uppercase transition-colors">
                Book Appointment <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </>
  );
}
