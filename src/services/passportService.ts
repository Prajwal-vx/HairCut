import { apiClient } from "./apiClient";
import type { HairPassport } from "@/lib/types";

export type HairPassportFormData = Omit<HairPassport, "id" | "userId" | "createdAt" | "updatedAt">;

export const passportService = {
  async getPassport(): Promise<{ passport: HairPassport | null }> {
    return apiClient.get<{ passport: HairPassport | null }>("/api/passport");
  },

  async createPassport(
    data: HairPassportFormData
  ): Promise<{ success: boolean; passport: HairPassport }> {
    return apiClient.post<{ success: boolean; passport: HairPassport }>("/api/passport", data);
  },

  async updatePassport(
    data: Partial<HairPassportFormData>
  ): Promise<{ success: boolean; passport: HairPassport }> {
    return apiClient.patch<{ success: boolean; passport: HairPassport }>("/api/passport", data);
  },
};
