"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Scissors, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { formatCurrency } from "@/lib/utils";
import type { Service, ServiceCategory } from "@/lib/types";

const categories: (ServiceCategory | "All")[] = ["All", "Short Cuts", "Long Cuts", "Color", "Styling", "Beard Trim", "Treatments"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => { setServices(d.services || []); setLoading(false); });
  }, []);

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816] to-[#0d0c0b]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <FadeIn>
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">What We Offer</span>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mt-4 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Services & Pricing
              </h1>
              <p className="text-[#78716c] text-lg max-w-xl mx-auto">
                Six carefully curated service categories, all priced transparently. No surprises - just great hair.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-24">
          {/* Search + Filter */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716c]" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#1a1816] border border-[#2e2b26] rounded-xl py-3 pl-10 pr-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#c5a880] border-[#c5a880] text-[#141312]"
                      : "border-[#2e2b26] text-[#78716c] hover:border-[#c5a880] hover:text-[#c5a880]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service, i) => (
                  <motion.div key={service.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.06 }}>
                    <div className="group glass-card glass-card-hover rounded-2xl overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-transparent to-transparent" />
                        {service.popular && (
                          <span className="absolute top-3 left-3 bg-[#c86d51] text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">Popular</span>
                        )}
                        <span className="absolute top-3 right-3 bg-[#141312]/80 text-[#c5a880] text-xs px-2 py-1 rounded-full border border-[#c5a880]/30">{service.category}</span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-white font-semibold text-base mb-2">{service.name}</h3>
                        <p className="text-[#78716c] text-sm leading-relaxed flex-1">{service.description}</p>
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#2e2b26]">
                          <div>
                            <p className="text-[#c5a880] font-bold text-lg">{formatCurrency(service.price)}</p>
                            <div className="flex items-center gap-1 text-[#78716c] text-xs mt-0.5">
                              <Clock className="w-3 h-3" /> {service.durationMinutes} min
                            </div>
                          </div>
                          <Link href={`/book?service=${service.id}`} className="flex items-center gap-2 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            Book <Scissors className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[#78716c] text-lg">No services found for &quot;{search}&quot;</p>
              <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-4 text-[#c5a880] text-sm hover:underline">Clear filters</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}