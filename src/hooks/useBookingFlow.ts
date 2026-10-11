"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { salonService } from "@/services/salonService";
import { appointmentService, ConfirmedAppointment } from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import type { Service, Stylist } from "@/lib/types";

export function useBookingFlow() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

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
  const [activeCategory, setActiveCategory] = useState("All");
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Fetch initial services & stylists
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoadingInitial(true);
        const [servRes, stylRes] = await Promise.all([
          salonService.getServices(),
          salonService.getStylists(),
        ]);

        if (ignore) return;
        setServices(servRes.services || []);
        setStylists(stylRes.stylists || []);

        const preServiceId = searchParams?.get("service");
        if (preServiceId) {
          const found = servRes.services.find((s) => s.id === preServiceId);
          if (found) {
            setSelectedService(found);
            setStep(2);
          }
        }

        const preStylistId = searchParams?.get("stylist");
        if (preStylistId) {
          const found = stylRes.stylists.find((s) => s.id === preStylistId);
          if (found) setSelectedStylist(found);
        }
      } catch {
        if (!ignore) {
          toast.error("Failed to load salon options. Please refresh.");
        }
      } finally {
        if (!ignore) setLoadingInitial(false);
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [searchParams, toast]);

  const selectService = useCallback((service: Service) => {
    setSelectedService(service);
    setStep(2);
  }, []);

  const selectStylist = useCallback((stylist: Stylist | "any") => {
    setSelectedStylist(stylist);
    setStep(3);
  }, []);

  const submitBooking = useCallback(async () => {
    if (!user) {
      toast.info("Please sign in or create an account to book your appointment.", "Sign In Required");
      router.push("/auth");
      return;
    }

    if (!selectedService || !selectedStylist || !selectedDate || !selectedTime) {
      toast.error("Please complete all booking steps.");
      return;
    }

    setSubmitting(true);
    try {
      const stylistId = selectedStylist === "any" ? "any" : selectedStylist.id;
      const res = await appointmentService.createAppointment({
        stylistId,
        serviceId: selectedService.id,
        visitDate: selectedDate,
        timeSlot: selectedTime,
        notes: notes.trim() || undefined,
      });

      setConfirmed(res.appointment);
      toast.success("Appointment booked successfully!", "Reserved");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Booking failed. Please try another slot.";
      toast.error(msg, "Booking Error");
    } finally {
      setSubmitting(false);
    }
  }, [user, selectedService, selectedStylist, selectedDate, selectedTime, notes, toast, router]);

  const minBookingDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices =
    activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);

  return {
    step,
    setStep,
    services,
    filteredServices,
    categories,
    activeCategory,
    setActiveCategory,
    stylists,
    selectedService,
    setSelectedService,
    selectService,
    selectedStylist,
    setSelectedStylist,
    selectStylist,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    notes,
    setNotes,
    submitting,
    confirmed,
    loadingInitial,
    minBookingDate,
    submitBooking,
  };
}
