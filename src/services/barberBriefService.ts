import { apiClient } from "./apiClient";
import type { BarberBrief } from "@/lib/types";

export type BarberBriefFormData = Omit<BarberBrief, "id" | "userId" | "createdAt" | "updatedAt">;

export const barberBriefService = {
  async getBarberBrief(): Promise<{ barberBrief: BarberBrief | null }> {
    return apiClient.get<{ barberBrief: BarberBrief | null }>("/api/barber-brief");
  },

  async createBarberBrief(
    data: BarberBriefFormData
  ): Promise<{ success: boolean; barberBrief: BarberBrief }> {
    return apiClient.post<{ success: boolean; barberBrief: BarberBrief }>("/api/barber-brief", data);
  },

  async updateBarberBrief(
    data: Partial<BarberBriefFormData>
  ): Promise<{ success: boolean; barberBrief: BarberBrief }> {
    return apiClient.patch<{ success: boolean; barberBrief: BarberBrief }>("/api/barber-brief", data);
  },
};
