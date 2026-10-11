"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useDiscover } from "@/hooks/useDiscover";
import {
  DiscoverStepPhoto,
  DiscoverStepHair,
  DiscoverStepLifestyle,
  DiscoverStepSlider,
  DiscoverStepResults,
} from "@/modules/discover";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const TOTAL_STEPS = 5;

export default function DiscoverPage() {
  const {
    fileInputRef,
    step,
    direction,
    answers,
    update,
    goTo,
    handlePhotoChange,
    handleGenerate,
    recommendations,
    barberBrief,
    setBarberBrief,
    briefCopied,
    copyBrief,
    downloadBrief,
    shareBrief,
  } = useDiscover();

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#e0d8cd] flex flex-col font-sans selection:bg-[#c5a880] selection:text-[#0d0c0b]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            I Don&apos;t Know What I Want
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Discover Your Style
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#a09080] max-w-2xl mx-auto leading-relaxed">
            Answer 5 quick steps and we&apos;ll suggest styles tailored to your hair, face, and lifestyle.
          </p>
        </div>

        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-8 max-w-lg mx-auto">
            <div className="flex items-center justify-between text-xs text-[#a09080] mb-2 font-medium">
              <span>Step {step} of {TOTAL_STEPS - 1}</span>
              <span>
                {step === 1 && "Photo (optional)"}
                {step === 2 && "Hair Preferences"}
                {step === 3 && "Lifestyle & Maintenance"}
                {step === 4 && "How Much Change?"}
              </span>
            </div>
            <div className="w-full bg-[#1e1c19] h-2 rounded-full overflow-hidden border border-[#2e2b26]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#a88960] to-[#c5a880]"
                initial={false}
                animate={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Step Container */}
        <div className="bg-[#141312] border border-[#2e2b26] rounded-2xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <DiscoverStepPhoto
                  photoUrl={answers.photoUrl}
                  fileInputRef={fileInputRef}
                  onPhotoChange={handlePhotoChange}
                  onSkip={() => {
                    update("photoUrl", null);
                    goTo(2);
                  }}
                  onContinue={() => goTo(2)}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <DiscoverStepHair
                  answers={answers}
                  onUpdate={update}
                  onBack={() => goTo(1)}
                  onNext={() => goTo(3)}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <DiscoverStepLifestyle
                  answers={answers}
                  onUpdate={update}
                  onBack={() => goTo(2)}
                  onNext={() => goTo(4)}
                />
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <DiscoverStepSlider
                  changeSlider={answers.changeSlider}
                  onChange={(val) => update("changeSlider", val)}
                  onBack={() => goTo(3)}
                  onGenerate={handleGenerate}
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <DiscoverStepResults
                  recommendations={recommendations}
                  answers={answers}
                  barberBrief={barberBrief}
                  briefCopied={briefCopied}
                  onRetake={() => goTo(1)}
                  onBack={() => goTo(4)}
                  onSelectBrief={setBarberBrief}
                  onCopyBrief={copyBrief}
                  onShareBrief={shareBrief}
                  onDownloadBrief={downloadBrief}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-xs text-[#4a4540]">
          Every result comes with a complimentary in-chair consultation before your stylist picks up the scissors.
        </p>
      </main>

      <Footer />
    </div>
  );
}
