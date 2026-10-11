import { apiClient } from "./apiClient";
import type { StyleDNA } from "@/lib/types";

export type StyleDNATraits = Omit<StyleDNA, "id" | "userId" | "computedAt" | "updatedAt">;

export const styleDnaService = {
  async getStyleDNA(): Promise<{ styleDNA: StyleDNA | null }> {
    return apiClient.get<{ styleDNA: StyleDNA | null }>("/api/style-dna");
  },

  async saveStyleDNA(
    traits: StyleDNATraits
  ): Promise<{ success: boolean; styleDNA: StyleDNA }> {
    return apiClient.post<{ success: boolean; styleDNA: StyleDNA }>("/api/style-dna", traits);
  },

  async recomputeFromPassport(): Promise<{ success: boolean; styleDNA: StyleDNA }> {
    return apiClient.patch<{ success: boolean; styleDNA: StyleDNA }>("/api/style-dna", {
      recompute: true,
    });
  },
};
