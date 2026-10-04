"use client";
import React from "react";
import Link from "next/link";
import { Scissors } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn, AnimatedCounter } from "@/components/motion/FadeIn";

const timeline = [
  { year: "2023", title: "Doors Open", desc: "Unisex Haircut launched at Ratan Complex, Bhadrapur Bus Stand, Birtamode with 2 stylists and a clear vision for inclusive, premium grooming." },
  { year: "2024", title: "Team Expands", desc: "Welcomed specialists Rohan (texture cuts) and Anita (scalp therapy). Introduced luxe colour services and premium treatment menu." },
  { year: "2025", title: "Digital Booking Launch", desc: "Launched online appointment booking, the Style Streak loyalty system, and the 35-day automated grooming reminder for our growing community." },
  { year: "2026", title: "2,000 Happy Clients", desc: "Celebrating our community milestone. Full-service premium salon experience available for every person, every hair type, every style." },
];

const values = [
  { icon: "✨", title: "Inclusive by Design", desc: "No gender sections, no judgment. Every seat at our chair welcomes everyone equally." },
  { icon: "🌿", title: "Quality Products", desc: "We use and recommend premium, cruelty-free products that care for your hair and scalp long-term." },
  { icon: "🤝", title: "Community First", desc: "Proudly local to Birtamode. We reinvest in our community through local hiring and events." },
  { icon: "💡", title: "Always Learning", desc: "Our stylists train continuously on global trends to bring the world's best techniques to Jhapa." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a1816 0%, #0d0c0b 100%)" }} />
          <div className="relative z-10 max-w-5xl mx-auto">
            <FadeIn>
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Our Story</span>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mt-4 mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Born in Birtamode,<br /><span className="text-gold-gradient">Built for Everyone</span>
              </h1>
              <p className="text-[#b0a090] text-xl max-w-2xl leading-relaxed">
                Unisex Haircut started with a simple belief: great hair knows no gender. We set up shop at Ratan Complex to serve every person who walks through our door with equal care, skill, and warmth.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="bg-[#141312] border-y border-[#2e2b26] py-12">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ value: 3, suffix: "+", label: "Years of Excellence" }, { value: 2000, suffix: "+", label: "Clients Transformed" }, { value: 4, suffix: "", label: "Expert Stylists" }, { value: 15, suffix: "+", label: "Premium Services" }].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[#c5a880] text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[#78716c] text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 px-4 max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Our Values</span>
            <h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What We Stand For</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="glass-card glass-card-hover rounded-2xl p-6 text-center h-full">
                  <span className="text-4xl mb-4 block">{v.icon}</span>
                  <h3 className="text-white font-semibold mb-3">{v.title}</h3>
                  <p className="text-[#78716c] text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="py-20 px-4 bg-[#0f0e0d]">
          <div className="max-w-3xl mx-auto">
            <FadeIn className="text-center mb-16">
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Our Journey</span>
              <h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>From Dream to Reality</h2>
            </FadeIn>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-[#2e2b26]" />
              {timeline.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.15}>
                  <div className="relative flex gap-8 pb-12">
                    <div className="flex-none w-16 h-16 rounded-full bg-[#1a1816] border-2 border-[#c5a880] flex items-center justify-center z-10">
                      <span className="text-[#c5a880] text-xs font-bold">{item.year}</span>
                    </div>
                    <div className="pt-4">
                      <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-[#78716c] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 text-center">
          <FadeIn>
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Come Be Part of Our Story</h2>
            <p className="text-[#78716c] text-lg mb-8 max-w-lg mx-auto">Every visit writes a new chapter. Book your appointment today and experience the Unisex Haircut difference.</p>
            <Link href="/book" className="inline-flex items-center gap-3 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-[#c5a880]/30">
              <Scissors className="w-5 h-5" /> Book Your Visit
            </Link>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </>
  );
}