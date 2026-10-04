"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import { FadeIn } from "@/components/motion/FadeIn";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setSending(false);
  };

  return (
    <>
      <Navbar />
      <MobileBookBar />
      <main className="min-h-screen pb-24 lg:pb-0">
        <section className="relative pt-32 pb-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816] to-[#0d0c0b]" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <FadeIn>
              <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Get In Touch</span>
              <h1 className="text-5xl sm:text-6xl font-bold text-white mt-4 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Visit Us or Send a Message
              </h1>
              <p className="text-[#78716c] text-lg max-w-xl mx-auto">
                We are located at Ratan Complex, Bhadrapur Bus Stand, Birtamode. Walk in anytime or book online for guaranteed time.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <FadeIn direction="right">
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Location</h3>
                      <p className="text-[#78716c] text-sm leading-relaxed">
                        Ratan Complex, Bhadrapur Bus Stand<br />
                        Birtamode, Jhapa, Nepal
                      </p>
                      <a href="https://maps.google.com/?q=Birtamode+Jhapa+Nepal" target="_blank" rel="noopener noreferrer" className="text-[#c5a880] text-xs mt-2 inline-block hover:underline">
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Opening Hours</h3>
                      <div className="space-y-1 text-sm text-[#78716c]">
                        <div className="flex justify-between gap-8"><span>Monday – Friday</span><span className="text-[#e0d8cd]">9:00 AM – 8:00 PM</span></div>
                        <div className="flex justify-between gap-8"><span>Saturday – Sunday</span><span className="text-[#e0d8cd]">8:00 AM – 9:00 PM</span></div>
                        <div className="flex justify-between gap-8"><span>Public Holidays</span><span className="text-[#c86d51]">10:00 AM – 6:00 PM</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#c5a880]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone / WhatsApp</h3>
                      <a href="tel:+9779801234567" className="text-[#c5a880] hover:underline">+977-9801234567 / 9841234567</a>
                      <p className="text-[#78716c] text-xs mt-1">Direct inquiries, wedding party packages, or corporate bookings.</p>
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#c5a880]" /> Interactive Map Teaser
                  </h3>
                  <div className="w-full h-48 bg-[#141312] rounded-xl flex flex-col items-center justify-center border border-[#2e2b26] p-4 text-center">
                    <p className="text-white font-bold mb-1">Unisex Haircut Salon</p>
                    <p className="text-[#78716c] text-xs mb-3">Ratan Complex, Bhadrapur Bus Stand, Birtamode, Jhapa, Nepal</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Bhadrapur+Bus+Stand+Birtamode+Nepal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#c5a880] text-[#141312] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#d4b898] transition-colors"
                    >
                      Get Directions via Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn direction="left" delay={0.2}>
              <div className="glass-card rounded-2xl p-8">
                {sent ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-[#c5a880] mx-auto mb-4" />
                    <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Message Sent!</h3>
                    <p className="text-[#78716c]">We will get back to you within a few hours. Thank you for reaching out!</p>
                    <button onClick={() => setSent(false)} className="mt-6 text-[#c5a880] text-sm hover:underline">Send another message</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Send Us a Message</h2>
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="Ramesh Thapa"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+977-98XXXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Email (optional)</label>
                      <input
                        type="email"
                        placeholder="ramesh@gmail.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-2">Message</label>
                      <textarea
                        rows={4}
                        placeholder="I would like to book a consultation or ask about..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm transition-colors resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-3 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] py-4 rounded-xl font-bold text-base transition-all disabled:opacity-70"
                    >
                      {sending ? <span className="animate-spin">⏳</span> : <Send className="w-5 h-5" />}
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}