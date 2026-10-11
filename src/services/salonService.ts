import { apiClient } from "./apiClient";
import type { Service, Stylist } from "@/lib/types";

export const salonService = {
  async getServices(): Promise<{ services: Service[] }> {
    return apiClient.get<{ services: Service[] }>("/api/services");
  },

  async getStylists(): Promise<{ stylists: Stylist[] }> {
    return apiClient.get<{ stylists: Stylist[] }>("/api/stylists");
  },
};
