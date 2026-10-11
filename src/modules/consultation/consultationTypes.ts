export type FaceShape = "oval" | "square" | "round" | "heart" | "diamond";
export type HairTexture = "straight" | "wavy" | "curly" | "coily";
export type HairGoal = "volume" | "clean" | "low_maintenance" | "fashion_forward" | "hair_health";
export type GenderPreference = "mens" | "womens" | "unisex";

export interface ConsultationInputs {
  faceShape: FaceShape;
  hairTexture: HairTexture;
  hairGoal: HairGoal;
  genderPreference: GenderPreference;
}

export interface DiagnosisResult {
  title: string;
  subtitle: string;
  faceShape: string;
  hairTexture: string;
  matchScore: number;
  description: string;
  whyItWorks: string[];
  stylingTips: string[];
  maintenanceIntervalDays: number;
  recommendedServiceId: string;
  recommendedServiceName: string;
  recommendedStylistId: string;
  recommendedStylistName: string;
  productSuggestion: string;
  sampleImage: string;
}
