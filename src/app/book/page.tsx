"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Calendar, Clock, User, Check, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";
import type { Appointment, Service, Stylist } from "@/lib/types";

type ConfirmedAppointment = Appointment & { serviceName?: string; stylistName?: string };

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"
];

function BookingFlowInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | "any" | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedAppointment | null>(null);
  const [bookingError, setBookingError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((d) => {
      setServices(d.services || []);
      const preServiceId = searchParams?.get("service");
      if (preServiceId) {
        const found = (d.services || []).find((s: Service) => s.id === preServiceId);
        if (found) {
          setSelectedService(found);
          setStep(2);
        }
      }
    });
    fetch("/api/stylists").then((r) => r.json()).then((d) => {
      setStylists(d.stylists || []);
      const preStylistId = searchParams?.get("stylist");
      if (preStylistId) {
        const found = (d.stylists || []).find((s: Stylist) => s.id === preStylistId);
        if (found) setSelectedStylist(found);
      }
    });
  }, [searchParams]);

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices = activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const handleBooking = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setBookingError("");
    try {
      const stylistId = selectedStylist === "any" ? "any" : (selectedStylist as Stylist).id;
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          stylistId,
          serviceId: selectedService.id,
          visitDate: selectedDate,
          timeSlot: selectedTime,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Booking failed");
        setSubmitting(false);
        return;
      }
      setConfirmed(data.appointment);
    } catch {
      setBookingError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#c5a880]/20 border-2 border-[#c5a880] flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#c5a880]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Booking Confirmed!
          </h2>
          <p className="text-[#78716c] mb-6">
            Your appointment has been reserved. See you soon at Unisex Haircut, Birtamode!
          </p>
          <div className="bg-[#141312] rounded-2xl p-5 mb-6 text-left space-y-3 border border-[#2e2b26]">
            <div className="flex justify-between"><span className="text-[#78716c] text-sm">Service</span><span className="text-[#e0d8cd] text-sm font-medium">{confirmed.serviceName}</span></div>
            <div className="flex justify-between"><span className="text-[#78716c] text-sm">Stylist</span><span className="text-[#e0d8cd] text-sm font-medium">{confirmed.stylistName}</span></div>
            <div className="flex justify-between"><span className="text-[#78716c] text-sm">Date</span><span className="text-[#e0d8cd] text-sm font-medium">{confirmed.visitDate}</span></div>
            <div className="flex justify-between"><span className="text-[#78716c] text-sm">Time</span><span className="text-[#e0d8cd] text-sm font-medium">{confirmed.timeSlot}</span></div>
            <div className="flex justify-between border-t border-[#2e2b26] pt-3">
              <span className="text-[#78716c] text-sm">Amount to Pay</span>
              <span className="text-[#c5a880] font-bold">{formatCurrency(confirmed.amountPaid)}</span>
            </div>
          </div>
          <p className="text-[#78716c] text-xs mb-6">
            Payment on arrival at Ratan Complex. Reminder notifications will be sent to your preferred channel.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1 bg-[#c5a880] text-[#141312] py-3 rounded-xl font-bold text-sm text-center hover:bg-[#d4b898] transition-colors">
              View Dashboard
            </Link>
            <Link href="/" className="flex-1 border border-[#2e2b26] text-[#e0d8cd] py-3 rounded-xl font-medium text-sm text-center hover:border-[#c5a880] transition-colors">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { n: 1, label: "Service" },
    { n: 2, label: "Stylist" },
    { n: 3, label: "Date & Time" },
    { n: 4, label: "Confirm" },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-8">
            <span className="text-[#c5a880] text-xs font-semibold tracking-[0.25em] uppercase">Online Booking</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Reserve Your Chair
            </h1>
          </FadeIn>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className={`flex items-center gap-2 flex-shrink-0 ${step >= s.n ? "text-[#c5a880]" : "text-[#4a4540]"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    step > s.n
                      ? "bg-[#c5a880] border-[#c5a880] text-[#141312]"
                      : step === s.n
                      ? "border-[#c5a880] text-[#c5a880]"
                      : "border-[#2e2b26] text-[#4a4540]"
                  }`}>
                    {step > s.n ? <Check className="w-4 h-4" /> : s.n}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-px flex-1 min-w-6 ${step > s.n ? "bg-[#c5a880]" : "bg-[#2e2b26]"}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8">
            {bookingError && (
              <div className="bg-[#c86d51]/10 border border-[#c86d51]/30 rounded-xl p-3 mb-5 text-[#f29a7e] text-sm">
                {bookingError}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: Service */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-xl font-bold text-white mb-6">Choose a Service</h2>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          activeCategory === cat
                            ? "bg-[#c5a880] border-[#c5a880] text-[#141312]"
                            : "border-[#2e2b26] text-[#78716c] hover:border-[#c5a880]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1">
                    {filteredServices.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedService(s);
                          setStep(2);
                        }}
                        className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:border-[#c5a880] ${
                          selectedService?.id === s.id ? "border-[#c5a880] bg-[#c5a880]/5" : "border-[#2e2b26]"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{s.name}</p>
                            <p className="text-[#78716c] text-xs mt-1">{s.category}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-[#c5a880] font-bold text-sm">{formatCurrency(s.price)}</p>
                            <p className="text-[#78716c] text-xs flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" />{s.durationMinutes}m
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Stylist */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-xl font-bold text-white mb-6">Choose Your Stylist</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setSelectedStylist("any");
                        setStep(3);
                      }}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${
                        selectedStylist === "any" ? "border-[#c5a880] bg-[#c5a880]/5" : "border-[#2e2b26] hover:border-[#c5a880]"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center mb-3">
                        <User className="w-6 h-6 text-[#c5a880]" />
                      </div>
                      <p className="text-white font-semibold">First Available Specialist</p>
                      <p className="text-[#78716c] text-xs mt-1">We will match you with the best available stylist for your service</p>
                    </button>
                    {stylists.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStylist(s);
                          setStep(3);
                        }}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${
                          (selectedStylist as Stylist)?.id === s.id ? "border-[#c5a880] bg-[#c5a880]/5" : "border-[#2e2b26] hover:border-[#c5a880]"
                        }`}
                      >
                        <img src={s.photoUrl} alt={s.name} className="w-12 h-12 rounded-full object-cover mb-3" />
                        <p className="text-white font-semibold text-sm">{s.name}</p>
                        <p className="text-[#c5a880] text-xs">{s.specialty}</p>
                        <p className="text-[#78716c] text-xs mt-1">{s.experienceYears}y exp · ⭐ {s.rating}</p>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="mt-6 flex items-center gap-2 text-[#78716c] hover:text-[#c5a880] text-sm">
                    <ChevronLeft className="w-4 h-4" /> Back to Services
                  </button>
                </motion.div>
              )}

              {/* STEP 3: Date & Time */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-xl font-bold text-white mb-6">Pick Date & Time</h2>
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[#b0a090] text-sm font-medium mb-3">
                        <Calendar className="w-4 h-4 inline mr-2" /> Date
                      </label>
                      <input
                        type="date"
                        min={getMinDate()}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] focus:outline-none focus:border-[#c5a880] text-sm"
                      />
                    </div>
                    {selectedDate && (
                      <div>
                        <label className="block text-[#b0a090] text-sm font-medium mb-3">
                          <Clock className="w-4 h-4 inline mr-2" /> Time Slot
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                          {timeSlots.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedTime(t)}
                              className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                                selectedTime === t ? "bg-[#c5a880] border-[#c5a880] text-[#141312]" : "border-[#2e2b26] text-[#78716c] hover:border-[#c5a880]"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-[#b0a090] text-sm font-medium mb-2">Special Notes (optional)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Allergies, style reference, or special requests..."
                      className="w-full bg-[#141312] border border-[#2e2b26] rounded-xl py-3 px-4 text-[#e0d8cd] placeholder-[#4a4540] focus:outline-none focus:border-[#c5a880] text-sm resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[#78716c] hover:text-[#c5a880] text-sm px-4 py-3">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={() => selectedDate && selectedTime && setStep(4)}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-1 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      Review Booking <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Confirm */}
              {step === 4 && selectedService && selectedStylist && (
                <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <h2 className="text-xl font-bold text-white mb-6">Review & Confirm</h2>
                  <div className="bg-[#141312] rounded-2xl p-6 mb-6 space-y-4 border border-[#2e2b26]">
                    <div className="flex justify-between items-start">
                      <span className="text-[#78716c] text-sm">Service</span>
                      <div className="text-right">
                        <p className="text-[#e0d8cd] text-sm font-medium">{selectedService.name}</p>
                        <p className="text-[#78716c] text-xs">{selectedService.durationMinutes} min</p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716c] text-sm">Stylist</span>
                      <span className="text-[#e0d8cd] text-sm font-medium">
                        {selectedStylist === "any" ? "First Available" : (selectedStylist as Stylist).name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716c] text-sm">Date</span>
                      <span className="text-[#e0d8cd] text-sm font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#78716c] text-sm">Time</span>
                      <span className="text-[#e0d8cd] text-sm font-medium">{selectedTime}</span>
                    </div>
                    {notes && (
                      <div className="flex justify-between">
                        <span className="text-[#78716c] text-sm">Notes</span>
                        <span className="text-[#e0d8cd] text-sm font-medium text-right max-w-48">{notes}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-4 border-t border-[#2e2b26]">
                      <span className="text-white font-bold">Total (Pay at Salon)</span>
                      <span className="text-[#c5a880] font-bold text-lg">{formatCurrency(selectedService.price)}</span>
                    </div>
                  </div>

                  {!user && (
                    <div className="bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-xl p-4 mb-5">
                      <p className="text-[#c5a880] text-sm">
                        Please <Link href="/auth" className="underline font-semibold">sign in or register</Link> to complete your booking and start your Style Streak!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(3)} className="flex items-center gap-2 text-[#78716c] hover:text-[#c5a880] text-sm px-4 py-3">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={submitting || !user}
                      className="flex-1 bg-[#c5a880] hover:bg-[#d4b898] text-[#141312] py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? "Reserving..." : <><Scissors className="w-4 h-4" /> Confirm Appointment</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BookPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen bg-[#0d0c0b] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" /></div>}>
        <BookingFlowInner />
      </Suspense>
      <Footer />
    </>
  );
}