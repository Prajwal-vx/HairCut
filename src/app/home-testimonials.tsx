"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

const testimonials = [
  { name: "Ramesh K.", rating: 5, text: "Aarav gave me the sharpest fade I have ever had. Been coming every 5 weeks without fail — my Style Streak is at 6 now! The bonus points are a great touch.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=75" },
  { name: "Sunita R.", rating: 5, text: "Priya is an absolute artist with colour. The balayage she did for my wedding looked stunning in every photo. The salon atmosphere is so warm and welcoming.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=75" },
  { name: "Dinesh T.", rating: 5, text: "The 35-day reminder is incredibly thoughtful. Never miss a trim now. Love the loyalty streak — just unlocked a free beard trim on my 4th visit!", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=75" },
];

export default function HomeTestimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % testimonials.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  const testimonial = testimonials[active];

  return (
    <section className="py-24 px-4 max-w-5xl mx-auto">
      <FadeIn className="text-center mb-12">
        <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Client Love</span>
        <h2 className="text-4xl font-bold text-white mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Stories from Birtamode</h2>
      </FadeIn>
      <div className="relative min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex gap-1 mb-4">{Array.from({ length: testimonial.rating }, (_, i) => <span key={i} className="text-[#c5a880]">★</span>)}</div>
            <p className="text-[#d0c8be] text-lg leading-relaxed italic mb-6">&ldquo;{testimonial.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <Image src={testimonial.avatar} alt="" width={40} height={40} sizes="40px" quality={70} className="w-10 h-10 rounded-full object-cover border-2 border-[#c5a880]/30" />
              <div><p className="text-white font-semibold text-sm">{testimonial.name}</p><p className="text-[#78716c] text-xs">Verified Client — Birtamode</p></div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-4" role="group" aria-label="Choose a client testimonial">
          {testimonials.map((item, index) => <button key={item.name} onClick={() => setActive(index)} aria-label={`Show testimonial ${index + 1}`} aria-pressed={index === active} className={`h-1.5 rounded-full transition-all ${index === active ? "w-8 bg-[#c5a880]" : "w-2 bg-[#2e2b26]"}`} />)}
        </div>
      </div>
    </section>
  );
}
