"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import HomeTestimonials from "@/app/home-testimonials";
import { ArrowUpRight, CalendarDays, ChevronRight, Clock, Compass, MapPin, Play, Scissors, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { salonService } from "@/services/salonService";
import type { GalleryPhoto, Service } from "@/lib/types";

const heroImage = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=70";
const heroPortrait = "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&auto=format&fit=crop&q=70";

export default function HomePage() {
  const [homePhotos, setHomePhotos] = useState<GalleryPhoto[]>([]);
  const [homeServices, setHomeServices] = useState<Service[]>([]);
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

  useEffect(() => {
    let active = true;
    salonService.getServices().then((data) => {
      if (active) setHomeServices((data.services || []).slice(0, 5));
    }).catch(() => {
      if (active) setHomeServices([]);
    });
    return () => { active = false; };
  }, []);

  return (
    <>
      <Navbar showAnnouncement />
      <MobileBookBar />
      <main className="pb-24 lg:pb-0">

        {/* HERO */}
        <section className="home-hero relative min-h-[min(800px,100svh)] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
              <Image src={heroPortrait} alt="Long, dimensional hair styled at Uptown Hair" fill priority sizes="100vw" quality={60} className="object-cover object-[65%_center]" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0b]/95 via-[#0d0c0b]/80 to-[#0d0c0b]/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-[#0d0c0b]/40" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_.9fr] items-center gap-8 pt-28 pb-24 lg:pt-32 lg:pb-24">
            <div className="max-w-3xl text-center lg:text-left">
            <div>
              <span className="inline-flex items-center gap-2 text-[#dfc8a8] text-xs sm:text-sm font-semibold tracking-[0.12em] mb-7">
                <span className="w-7 h-px bg-[#c5a880]" /> Expert stylists · Exceptional you
              </span>
            </div>

            <h1 className="text-[clamp(2.5rem,8vw,5.2rem)] sm:text-7xl lg:text-[5.2rem] font-semibold leading-[.95] sm:leading-[.86] tracking-[-.035em] mb-7" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-white block">Your Hair.</span>
              <span className="text-white block">Your Style.</span>
              <span className="italic text-gold-gradient block">Your Confidence.</span>
            </h1>

            <p className="text-[#b7aa9c] text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-9 leading-[1.8]">
              Personalised cuts, colour, and care to bring your own style into focus. Thoughtful service for everyone, right here in Birtamode.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <Link href="/book" className="flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-3 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#141312] px-6 sm:px-8 py-3.5 rounded-md font-bold text-xs tracking-wide transition-all duration-300 shadow-xl shadow-[#c5a880]/20 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#dfc8a8]">
                Book Appointment <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 border border-[#c5a880]/55 hover:border-[#dfc8a8] text-[#f3efe6] px-6 sm:px-7 py-3.5 rounded-md font-semibold text-xs tracking-wide transition-all duration-200 bg-[#141312]/50 backdrop-blur-sm active:scale-[0.98]">
                Our Services <ChevronRight className="w-4 h-4 text-[#c5a880]" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mt-8 text-xs sm:text-sm text-[#b7aa9c]">
              {["Personalised care", "All styles welcome"].map((p) => (
                <span key={p} className="inline-flex items-center gap-2"><span className="text-[#c5a880]">✦</span>{p}</span>
              ))}
            </div>
            </div>

            <aside className="hidden lg:flex min-h-[440px] items-end justify-end pb-10">
              <Link href="/about" className="group flex items-center gap-3 text-right text-white hover:text-[#dfc8a8] transition-colors">
                <span className="text-xs font-semibold tracking-wide">Discover our salon story</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfc8a8]/75 bg-[#0d0c0b]/35 transition-all group-hover:bg-[#c5a880] group-hover:text-[#141312]"><Play className="ml-0.5 h-4 w-4" /></span>
              </Link>
            </aside>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
            <div className="w-6 h-10 border-2 border-[#c5a880]/40 rounded-full flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-[#c5a880] rounded-full" />
            </div>
          </div>
        </section>

        {/* VISIT DETAILS */}
        <section aria-label="Plan your visit" className="cv-auto border-y border-[#2e2b26] bg-[#11100e]">
          <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 sm:grid-cols-3 sm:gap-8 sm:py-6">
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 shrink-0 text-[#c5a880]" /><div><p className="text-sm font-medium text-[#f3efe6]">Visit us in Birtamode</p><p className="text-xs text-[#b7aa9c]">Ratan Complex, Bhadrapur Bus Stand</p></div></div>
            <div className="flex items-center gap-3"><Clock className="h-5 w-5 shrink-0 text-[#c5a880]" /><div><p className="text-sm font-medium text-[#f3efe6]">Open daily, 9 AM–8 PM</p><p className="text-xs text-[#b7aa9c]">Hours may vary on special occasions</p></div></div>
            <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 shrink-0 text-[#c5a880]" /><div><p className="text-sm font-medium text-[#f3efe6]">Choose a time that suits you</p><p className="text-xs text-[#b7aa9c]">See available services and slots online</p></div></div>
          </div>
        </section>

        {/* SERVICES HIGHLIGHTS */}
        <section className="cv-auto py-16 sm:py-20 px-4 max-w-7xl mx-auto">
          <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8 sm:mb-10">
            <div>
            <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Our Craft</span>
            <h2 className="text-4xl sm:text-5xl font-semibold text-white mt-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Beauty. Care. Expertise.</h2>
            <p className="text-[#a99c8e] text-sm mt-2 max-w-xl">A considered menu of services, tailored to your style.</p>
            </div>
            <Link href="/services" className="inline-flex min-h-[44px] items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[.15em] text-[#dfc8a8] border border-[#806b4e] px-4 py-3 rounded-md hover:bg-[#c5a880] hover:text-[#141312] transition-colors">View all services <ArrowUpRight className="w-4 h-4" /></Link>
          </FadeIn>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {homeServices.map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.1}>
                <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden">
                  <div className="relative h-52 overflow-hidden">
                    <Image src={s.image} alt={s.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" quality={60} className="object-cover group-hover:scale-105 transition-transform duration-500" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 bg-[#c5a880]/20 text-[#c5a880] text-xs px-2 py-1 rounded-full border border-[#c5a880]/30">{s.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-semibold text-base">{s.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#c5a880] font-bold">{formatCurrency(s.price)}</span>
                      <Link href={`/book?service=${s.id}`} className="min-h-[36px] text-[#a99c8e] hover:text-[#c5a880] text-xs font-medium flex items-center gap-1 transition-colors">
                        Book <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          {homeServices.length === 0 && <p className="rounded-lg border border-[#2e2b26] px-5 py-8 text-center text-sm text-[#b7aa9c]">Explore the full service menu to see current offerings and prices.</p>}
          <FadeIn className="text-center mt-10">
            <Link href="/services" className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#2e2b26] hover:border-[#c5a880] text-[#f3efe6] px-6 py-3 rounded-xl text-sm font-medium transition-all">
              Browse the full service menu <ChevronRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </section>

        {/* CLIENT LOYALTY */}
        <section className="cv-auto bg-[#0f0e0d] px-4 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <FadeIn direction="right">
              <span className="text-xs font-semibold uppercase tracking-[.22em] text-[#c5a880]">A little extra for coming back</span>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Good hair days add up.</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#b7aa9c] sm:text-base">Your account keeps your appointments, loyalty points, and visit streak together. Sign in any time to see your own progress and upcoming visits.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={user ? "/dashboard" : "/auth"} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#c5a880] px-5 py-3 text-sm font-semibold text-[#141312] transition-colors hover:bg-[#dfc8a8]">{user ? "View your account" : "Sign in to your account"}<ArrowUpRight className="h-4 w-4" /></Link>
                {!user && <Link href="/auth" className="inline-flex min-h-11 items-center rounded-md border border-[#51483e] px-5 py-3 text-sm font-medium text-[#f3efe6] transition-colors hover:border-[#c5a880]">Create an account</Link>}
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.1}>
              <div className="rounded-xl border border-[#3a3329] bg-[#171513] p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs uppercase tracking-[.14em] text-[#a99c8e]">{user ? "Your Style Streak" : "Client account"}</p><p className="mt-2 text-3xl font-semibold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{user ? `${user.styleStreak || 0} visits` : "All in one place"}</p></div>
                  <Scissors className="h-6 w-6 text-[#c5a880]" aria-hidden="true" />
                </div>
                <div className="my-5 h-px bg-[#332f29]" />
                <p className="text-sm leading-relaxed text-[#b7aa9c]">{user ? `${user.loyaltyPoints} loyalty points · Your appointment history and account details are ready to view.` : "Keep track of appointments and loyalty points, and book your next visit when you’re ready."}</p>
                <Link href={user ? "/dashboard" : "/auth"} className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#dfc8a8] hover:text-white">{user ? "Go to dashboard" : "Explore your account"}<ChevronRight className="h-4 w-4" /></Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* UNIQUE FEATURE: HAIRSTYLE & FACE SHAPE CONSULTATION CALLOUT */}
        <section className="cv-auto py-16 sm:py-20 px-4">
          <div className="max-w-6xl mx-auto glass-card rounded-3xl p-6 sm:p-8 lg:p-12 border border-[#c5a880]/30 relative overflow-hidden bg-gradient-to-r from-[#181614] via-[#121110] to-[#1c1612]">
            <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase inline-flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Salon Experience
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Not Sure Which Style Suits You?
                </h2>
                <p className="text-[#b7aa9c] text-base mt-4 max-w-xl leading-relaxed">
                  Take our 60-second Face Shape & Hair Texture Consultation Quiz. Our smart diagnostic tool matches your jawline, density, and lifestyle with the exact right haircut and stylist specialist.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
                  <Link
                    href="/consultation"
                    className="flex min-h-[44px] items-center justify-center gap-2 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#c5a880]/20 w-full sm:w-auto"
                  >
                    <Compass className="w-4 h-4" /> Start Style Consultation Now
                  </Link>
                  <Link
                    href="/stylists"
                    className="flex min-h-[44px] items-center justify-center gap-2 border border-[#2e2b26] text-[#f3efe6] px-5 py-3.5 rounded-xl text-sm font-medium hover:border-[#c5a880] transition-colors w-full sm:w-auto"
                  >
                    View Stylist Specialties
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-[#141312] border border-[#c5a880]/30 rounded-2xl p-6 text-center max-w-xs shadow-2xl">
                  <span className="text-4xl block mb-2">📐</span>
                  <p className="text-white font-bold text-base">Face Shape Analysis</p>
                  <p className="text-[#a99c8e] text-xs mt-1">Oval · Square · Round · Heart · Diamond</p>
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
        <section className="cv-auto py-16 overflow-hidden">
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
            <p className="text-[#a99c8e] text-sm mt-2 max-w-md mx-auto">
              Real results hand-picked and verified by our salon directors at Ratan Complex.
            </p>
          </FadeIn>

          {/* Automatic Dynamic Editorial Grid Formatting */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[clamp(140px,40vw,160px)] sm:auto-rows-[190px]">
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
                      quality={60}
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
                className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#1a1816] border border-[#2e2b26] hover:border-[#c5a880] text-[#f3efe6] hover:text-[#c5a880] px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                View Complete Salon Lookbook ({homePhotos.length}+ Styles) <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <HomeTestimonials />

        {/* SALON STORY & LOCATION */}
        <section className="cv-auto py-16 sm:py-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            <FadeIn className="relative min-h-[300px] sm:min-h-[420px] rounded-md overflow-hidden bg-gradient-to-br from-[#4a3527] via-[#221a15] to-[#0d0c0b]">
              <Image src={heroImage} alt="Salon interior and barber stations at Uptown Hair" fill sizes="(max-width: 768px) 100vw, 50vw" quality={60} className="object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[.18em] text-[#f3efe6]">Uptown Hair · Birtamode</span>
            </FadeIn>
            <FadeIn direction="left">
              <span className="text-[#c5a880] text-[10px] font-semibold tracking-[.24em] uppercase">A salon for your style</span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mt-3 leading-[.98]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Where passion<br />meets perfection.</h2>
              <p className="text-[#b7aa9c] text-sm leading-[1.85] mt-5 max-w-xl">At Uptown Hair, every visit starts with listening. Our team brings together thoughtful consultation, skilled hands, and a full menu of cuts, colour, grooming, and care.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {["Personalised consultation", "Care for every texture", "A skilled salon team", "For everyone"].map((item) => (
                    <span key={item} className="flex items-center gap-2 text-xs text-[#b7aa9c]"><Sparkles className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />{item}</span>
                ))}
              </div>
              <div className="mt-7 border-t border-[#2e2b26] pt-5 space-y-3 text-xs text-[#b7aa9c]">
                <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#c5a880] shrink-0" /> Ratan Complex, Bhadrapur Bus Stand, Birtamode, Jhapa</p>
                <p className="flex items-start gap-2"><Clock className="w-4 h-4 text-[#c5a880] shrink-0" /> Mon–Fri 9 AM–8 PM · Sat–Sun 8 AM–9 PM</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/about" className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-[#806b4e] px-4 py-3 text-xs font-semibold tracking-wide text-[#dfc8a8] hover:bg-[#c5a880] hover:text-[#141312] transition-colors">More about us <ArrowUpRight className="w-4 h-4" /></Link>
                <Link href="/contact" className="inline-flex min-h-[44px] items-center justify-center gap-2 px-4 py-3 text-xs font-semibold tracking-wide text-[#b7aa9c] hover:text-white transition-colors">Get directions <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="cv-auto py-14 sm:py-20 px-4">
          <FadeIn>
            <div className="max-w-7xl mx-auto grid sm:grid-cols-[auto_1fr_auto] items-center gap-5 sm:gap-8 rounded-2xl border border-[#2e2b26] bg-gradient-to-r from-[#171411] to-[#100f0d] px-5 py-6 sm:px-8 sm:py-7">
              <span className="hidden sm:flex w-14 h-14 items-center justify-center rounded-full border border-[#806b4e] text-[#dfc8a8]"><CalendarDays className="w-6 h-6" /></span>
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready for a new you?</h2>
                <p className="text-[#a99c8e] text-xs sm:text-sm mt-2">Choose your service and let our team take it from there.</p>
              </div>
              <Link href="/book" className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#c5a880] hover:bg-[#dfc8a8] text-[#141312] px-6 py-3.5 rounded-xl font-bold text-xs tracking-wide transition-colors w-full sm:w-auto">
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
