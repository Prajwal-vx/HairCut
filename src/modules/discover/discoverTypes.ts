export type HairLength = "very-short" | "short" | "medium" | "long" | "very-long";
export type HairTexture = "straight" | "wavy" | "curly" | "coily";
export type FaceShape = "oval" | "square" | "round" | "heart" | "diamond";
export type StylingTime = "under5" | "5to10" | "10to20" | "20plus";
export type CutFrequency = "biweekly" | "monthly" | "every6weeks" | "2months";
export type StylePriority = "professional" | "natural" | "fashion" | "health";

export interface DiscoverAnswers {
  photoUrl: string | null;
  hairLength: HairLength;
  hairTexture: HairTexture;
  faceShape: FaceShape;
  stylingTime: StylingTime;
  cutFrequency: CutFrequency;
  stylePriority: StylePriority;
  changeSlider: number;
}

export interface StyleRecommendation {
  tier: "safe" | "balanced" | "bold";
  label: string;
  name: string;
  fitScore: number;
  whyItWorks: string[];
  maintenanceLevel: "Low" | "Medium" | "High";
  image: string;
}

export interface CatalogHairstyle {
  id: string;
  name: string;
  changeLevel: number;
  maintenanceLevel: "Low" | "Medium" | "High";
  maintenanceScore: number;
  bestTextures: HairTexture[];
  bestLengths: HairLength[];
  bestFaceShapes: FaceShape[];
  bestPriorities: StylePriority[];
  image: string;
  whyItWorks: Record<string, string[]> | string[];
}
