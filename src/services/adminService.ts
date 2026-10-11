import { apiClient } from "./apiClient";
import type { AdminStatsData } from "@/types";
import type { ReminderCheckResult } from "@/lib/reminders";

export const adminService = {
  async getStats(): Promise<AdminStatsData> {
    return apiClient.get<AdminStatsData>("/api/admin/stats");
  },

  async triggerReminders(): Promise<{ success: boolean; result: ReminderCheckResult }> {
    return apiClient.post<{ success: boolean; result: ReminderCheckResult }>("/api/cron/reminders");
  },
};
