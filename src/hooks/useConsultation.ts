"use client";

import { useState, useCallback } from "react";
import { computeConsultationRecommendation } from "@/modules/consultation/consultationEngine";
import type {
  FaceShape,
  HairTexture,
  HairGoal,
  GenderPreference,
  DiagnosisResult,
} from "@/modules/consultation/consultationTypes";

export function useConsultation() {
  const [step, setStep] = useState<number>(1);
  const [faceShape, setFaceShape] = useState<FaceShape>("oval");
  const [hairTexture, setHairTexture] = useState<HairTexture>("straight");
  const [hairGoal, setHairGoal] = useState<HairGoal>("clean");
  const [genderPreference, setGenderPreference] = useState<GenderPreference>("unisex");
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const calculateRecommendation = useCallback(() => {
    const rec = computeConsultationRecommendation({
      faceShape,
      hairTexture,
      hairGoal,
      genderPreference,
    });
    setResult(rec);
    setStep(5);
  }, [faceShape, hairTexture, hairGoal, genderPreference]);

  const reset = useCallback(() => {
    setResult(null);
    setStep(1);
  }, []);

  return {
    step,
    setStep,
    faceShape,
    setFaceShape,
    hairTexture,
    setHairTexture,
    hairGoal,
    setHairGoal,
    genderPreference,
    setGenderPreference,
    result,
    calculateRecommendation,
    reset,
  };
}
