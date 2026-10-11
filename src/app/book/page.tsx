"use client";

import React, { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import {
  BookingStepIndicator,
  ServiceSelector,
  StylistSelector,
  TimeSlotPicker,
  BookingSummary,
  BookingConfirmation,
} from "@/components/booking";
import { useBookingFlow } from "@/hooks/useBookingFlow";

function BookingFlowInner() {
  const {
    step,
    setStep,
    filteredServices,
    categories,
    activeCategory,
    setActiveCategory,
    stylists,
    selectedService,
    selectService,
    selectedStylist,
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
  } = useBookingFlow();

  if (confirmed) {
    return <BookingConfirmation appointment={confirmed} />;
  }

  if (loadingInitial) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading salon services & stylists..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Book Your Appointment
        </h1>
        <p className="text-stone-400 text-sm max-w-md mx-auto">
          Reserve your master cut, custom styling, or scalp therapy in under 2 minutes.
        </p>
      </div>

      <BookingStepIndicator currentStep={step} onStepClick={(s) => setStep(s)} />

      {/* Step 1: Select Service */}
      {step === 1 && (
        <FadeIn>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">1. Choose a Service</h2>
            <p className="text-xs text-stone-400">Select the grooming experience tailored to you.</p>
          </div>
          <ServiceSelector
            services={filteredServices}
            selectedService={selectedService}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectService={selectService}
          />
        </FadeIn>
      )}

      {/* Step 2: Select Stylist */}
      {step === 2 && (
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">2. Choose Your Stylist</h2>
              <p className="text-xs text-stone-400">Select your preferred artisan or choose any available.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setStep(1)}
            >
              Back to Services
            </Button>
          </div>
          <StylistSelector
            stylists={stylists}
            selectedStylist={selectedStylist}
            onSelectStylist={selectStylist}
          />
        </FadeIn>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">3. Select Date & Time</h2>
              <p className="text-xs text-stone-400">Pick a day and time that best fits your schedule.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Back to Stylists
            </Button>
          </div>
          <TimeSlotPicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            minDate={minBookingDate}
            notes={notes}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            onChangeNotes={setNotes}
          />
          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
              disabled={!selectedDate || !selectedTime}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => setStep(4)}
            >
              Review &amp; Confirm
            </Button>
          </div>
        </FadeIn>
      )}

      {/* Step 4: Summary & Review */}
      {step === 4 && selectedService && selectedStylist && (
        <FadeIn>
          <BookingSummary
            service={selectedService}
            stylist={selectedStylist}
            date={selectedDate}
            time={selectedTime}
            notes={notes}
            submitting={submitting}
            onSubmit={submitBooking}
            onBack={() => setStep(3)}
          />
        </FadeIn>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#f5efe6] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <LoadingSpinner size="lg" message="Loading appointment scheduler..." />
            </div>
          }
        >
          <BookingFlowInner />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}