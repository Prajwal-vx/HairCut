import { STYLE_CATALOG } from "./discoverCatalog";
import type {
  CatalogHairstyle,
  DiscoverAnswers,
  StyleRecommendation,
  StylingTime,
} from "./discoverTypes";

export function scoreStyle(style: CatalogHairstyle, answers: DiscoverAnswers): number {
  let score = 50;

  // Texture match
  if (style.bestTextures.includes(answers.hairTexture)) score += 15;

  // Length match
  if (style.bestLengths.includes(answers.hairLength)) score += 12;

  // Face shape match
  if (style.bestFaceShapes.includes(answers.faceShape)) score += 13;

  // Priority match
  if (style.bestPriorities.includes(answers.stylePriority)) score += 10;

  // Maintenance tolerance
  const toleranceMap: Record<StylingTime, number> = {
    under5: 1,
    "5to10": 2,
    "10to20": 3,
    "20plus": 3,
  };
  const tolerance = toleranceMap[answers.stylingTime];
  if (style.maintenanceScore <= tolerance) score += 8;
  if (style.maintenanceScore > tolerance) score -= 12;

  // Change slider alignment
  const changeDelta = Math.abs(style.changeLevel - answers.changeSlider);
  score += Math.max(0, 12 - changeDelta / 5);

  return Math.min(99, Math.max(55, Math.round(score)));
}

export function getWhyItWorks(style: CatalogHairstyle): string[] {
  const w = style.whyItWorks;
  if (Array.isArray(w)) return w;
  return (w as Record<string, string[]>).default || [];
}

export function computeRecommendations(answers: DiscoverAnswers): StyleRecommendation[] {
  const scored = STYLE_CATALOG.map((style) => ({
    style,
    score: scoreStyle(style, answers),
  })).sort((a, b) => b.score - a.score);

  // Safe: lowest change from current
  const safePool = scored
    .filter((s) => s.style.changeLevel <= 30)
    .sort((a, b) => a.style.changeLevel - b.style.changeLevel);

  // Balanced: moderate change 30–65
  const balancedPool = scored
    .filter((s) => s.style.changeLevel > 30 && s.style.changeLevel <= 65)
    .sort((a, b) => b.score - a.score);

  // Bold: high change or slider-driven
  const boldThreshold = answers.changeSlider > 60 ? 55 : 65;
  const boldPool = scored
    .filter((s) => s.style.changeLevel > boldThreshold)
    .sort((a, b) => b.score - a.score);

  const safeEntry = safePool[0] ?? scored[0];
  const balancedEntry =
    balancedPool.find((s) => s.style.id !== safeEntry.style.id) ??
    scored.find((s) => s.style.id !== safeEntry.style.id) ??
    scored[1];
  const boldEntry =
    boldPool.find(
      (s) =>
        s.style.id !== safeEntry.style.id && s.style.id !== balancedEntry?.style.id
    ) ??
    scored.find(
      (s) =>
        s.style.id !== safeEntry.style.id && s.style.id !== balancedEntry?.style.id
    ) ??
    scored[2];

  const make = (
    tier: "safe" | "balanced" | "bold",
    label: string,
    entry: { style: CatalogHairstyle; score: number } | undefined
  ): StyleRecommendation => {
    const s = entry ?? scored[0];
    return {
      tier,
      label,
      name: s.style.name,
      fitScore: s.score,
      whyItWorks: getWhyItWorks(s.style),
      maintenanceLevel: s.style.maintenanceLevel,
      image: s.style.image,
    };
  };

  return [
    make("safe", "Safe Option", safeEntry),
    make("balanced", "Balanced Option", balancedEntry),
    make("bold", "Bold Option", boldEntry),
  ];
}

export function getSliderLabel(value: number): string {
  if (value <= 10) return "Almost the same";
  if (value <= 35) return "Small refresh";
  if (value <= 60) return "Noticeable change";
  if (value <= 80) return "Major change";
  return "Completely new look";
}

export function generateBarberBriefText(
  rec: StyleRecommendation,
  answers: DiscoverAnswers
): string {
  return [
    "BARBER BRIEF — UNISEX HAIRCUT",
    `Requested style: ${rec.name}`,
    `Current length: ${answers.hairLength.replace("-", " ")}`,
    `Hair texture: ${answers.hairTexture}`,
    `Sides: Shape to suit the selected style; confirm length before cutting`,
    `Top: Keep the length and texture appropriate for ${rec.name}`,
    `Finish: ${
      answers.stylePriority === "natural"
        ? "Natural"
        : answers.stylePriority === "professional"
        ? "Polished"
        : answers.stylePriority === "fashion"
        ? "Fashion-led"
        : "Low-stress"
    }`,
    `Maintenance: ${rec.maintenanceLevel}`,
    "Please confirm the plan together before cutting. This is a preference brief, not a technical prescription.",
  ].join("\n");
}
