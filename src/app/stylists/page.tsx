"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Scissors, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Stylist } from "@/lib/types";

export default function StylistsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stylists").then((r) => r.json()).then((d) => { setStylists(d.stylists || []); setLoading(false); });
  }, []);

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        <section className="relative pt-32 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816] to-[#0d0c0b]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <FadeIn>
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">The Artists</span>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mt-4 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Meet Our Stylists</h1>
              <p className="text-[#78716c] text-lg max-w-xl mx-auto">Each member of our team is a specialist in their craft, dedicated to your best look every visit.</p>
            </FadeIn>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-24">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-3xl h-96 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stylists.map((stylist, i) => (
                <FadeIn key={stylist.id} delay={i * 0.1}>
                  <div className="group glass-card glass-card-hover rounded-3xl overflow-hidden text-center">
                    <div className="relative h-72 overflow-hidden">
                      <img src={stylist.photoUrl} alt={stylist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b]/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-bold text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{stylist.name}</p>
                        <p className="text-[#c5a880] text-xs">{stylist.specialty}</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} className={`w-3.5 h-3.5 ${j < Math.round(stylist.rating) ? "fill-[#c5a880] text-[#c5a880]" : "text-[#2e2b26]"}`} />
                          ))}
                        </div>
                        <span className="text-[#c5a880] text-xs font-semibold">{stylist.rating}</span>
                      </div>
                      <p className="text-[#78716c] text-sm leading-relaxed mb-4">{stylist.bio}</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-[#78716c] mb-5">
                        <Award className="w-3.5 h-3.5 text-[#c5a880]" />
                        {stylist.experienceYears} years experience
                      </div>
                      <Link href={`/book?stylist=${stylist.id}`} className="flex items-center justify-center gap-2 w-full bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] py-2.5 rounded-xl font-semibold text-sm transition-colors">
                        <Scissors className="w-4 h-4" /> Book with {stylist.name.split(" ")[0]}
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          <FadeIn className="mt-16 glass-card rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Not Sure Who to Pick?</h3>
            <p className="text-[#78716c] text-sm mb-5 max-w-md mx-auto">Select &quot;First Available Specialist&quot; during booking and we will match you with the best available stylist for your chosen service.</p>
            <Link href="/book" className="inline-flex items-center gap-2 bg-[#c5a880] text-[#141312] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#d4b898] transition-colors">
              <Scissors className="w-4 h-4" /> Book with Any Available Stylist
            </Link>
          </FadeIn>
        </section>
      </main>
      <Footer />
    </>
  );
}