"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import type { GalleryPhoto, GalleryCategory } from "@/lib/types";

const categories: (GalleryCategory | "all")[] = ["all", "Haircut", "Color", "Before-After", "Salon Event"];

export default function GalleryPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCategoryChange = (cat: GalleryCategory | "all") => {
    setActiveCategory(cat);
    setLoading(true);
  };

  useEffect(() => {
    let cancelled = false;
    const url = activeCategory === "all" ? "/api/gallery" : `/api/gallery?category=${encodeURIComponent(activeCategory)}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setPhotos(d.photos || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        <section className="relative pt-32 pb-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816] to-[#0d0c0b]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <FadeIn>
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Lookbook</span>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mt-4 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Gallery & Transformations</h1>
              <p className="text-[#78716c] text-lg max-w-xl mx-auto">Real results from real clients at Unisex Haircut Birtamode — filter by style and find your next look.</p>
            </FadeIn>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-24">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeCategory === cat ? "bg-[#c5a880] border-[#c5a880] text-[#141312]" : "border-[#2e2b26] text-[#78716c] hover:border-[#c5a880] hover:text-[#c5a880]"}`}>
                  {cat === "all" ? "All Photos" : cat}
                </button>
              ))}
            </div>
            {(user?.role === "OWNER" || user?.role === "ADMIN") && (
              <div className="text-center mb-6">
                <a href="/admin" className="inline-flex items-center gap-2 text-xs bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] px-3.5 py-1.5 rounded-full hover:bg-[#c5a880]/20 transition-colors">
                  👑 You are logged in as {user.role}. Click here to manage & curate homepage showcase photos in Owner Studio →
                </a>
              </div>
            )}
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="glass-card rounded-2xl h-64 animate-pulse" />)}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[140px] sm:auto-rows-[170px]">
                {photos.map((photo, i) => (
                  <motion.div key={photo.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} className={`cursor-pointer group relative rounded-2xl overflow-hidden ${i % 7 === 0 ? "row-span-2 sm:col-span-2" : i % 5 === 0 ? "row-span-2" : "row-span-2 sm:row-span-1"}`} onClick={() => setLightboxPhoto(photo)}>
                    <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="text-xs bg-[#c5a880]/20 text-[#c5a880] px-2 py-0.5 rounded-full border border-[#c5a880]/30">{photo.category}</span>
                      <p className="text-white text-xs mt-2 leading-tight">{photo.caption}</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 bg-[#141312]/80 px-2 py-1 rounded-full">
                        <Heart className="w-3 h-3 text-[#c86d51]" />
                        <span className="text-[#c5a880] text-[10px]">{photo.likesCount}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxPhoto.imageUrl} alt={lightboxPhoto.caption} className="w-full rounded-2xl max-h-[80vh] object-contain" />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs bg-[#c5a880]/20 text-[#c5a880] px-2 py-0.5 rounded-full border border-[#c5a880]/30">{lightboxPhoto.category}</span>
                  <p className="text-[#e0d8cd] mt-2 text-sm">{lightboxPhoto.caption}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[#c5a880] text-sm"><Heart className="w-4 h-4" />{lightboxPhoto.likesCount}</div>
              </div>
              <button onClick={() => setLightboxPhoto(null)} className="absolute -top-4 -right-4 w-10 h-10 bg-[#2e2b26] rounded-full flex items-center justify-center hover:bg-[#3e3b36] transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
}