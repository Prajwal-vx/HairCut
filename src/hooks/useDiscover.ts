"use client";

import { useState, useCallback, useRef } from "react";
import {
  computeRecommendations,
  generateBarberBriefText,
} from "@/modules/discover/discoverEngine";
import type {
  DiscoverAnswers,
  StyleRecommendation,
} from "@/modules/discover/discoverTypes";

const INITIAL_ANSWERS: DiscoverAnswers = {
  photoUrl: null,
  hairLength: "medium",
  hairTexture: "straight",
  faceShape: "oval",
  stylingTime: "5to10",
  cutFrequency: "monthly",
  stylePriority: "natural",
  changeSlider: 25,
};

export function useDiscover() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [barberBrief, setBarberBrief] = useState<StyleRecommendation | null>(null);
  const [briefCopied, setBriefCopied] = useState(false);
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [answers, setAnswers] = useState<DiscoverAnswers>(INITIAL_ANSWERS);

  const update = useCallback(
    <K extends keyof DiscoverAnswers>(key: K, value: DiscoverAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
    },
    [step]
  );

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Photo must be under 5 MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => update("photoUrl", ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    [update]
  );

  const handleGenerate = useCallback(() => {
    const recs = computeRecommendations(answers);
    setRecommendations(recs);
    goTo(5);
  }, [answers, goTo]);

  const copyBrief = useCallback(async () => {
    if (!barberBrief) return;
    try {
      await navigator.clipboard.writeText(generateBarberBriefText(barberBrief, answers));
      setBriefCopied(true);
      window.setTimeout(() => setBriefCopied(false), 2000);
    } catch {
      setBriefCopied(false);
    }
  }, [barberBrief, answers]);

  const downloadBrief = useCallback(() => {
    if (!barberBrief) return;
    const text = generateBarberBriefText(barberBrief, answers);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `barber-brief-${barberBrief.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [barberBrief, answers]);

  const shareBrief = useCallback(async () => {
    if (!barberBrief) return;
    const text = generateBarberBriefText(barberBrief, answers);
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Barber Brief", text });
      } catch {
        // user dismissed share sheet
      }
    } else {
      await copyBrief();
    }
  }, [barberBrief, answers, copyBrief]);

  return {
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
  };
}
