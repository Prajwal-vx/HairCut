import { apiClient } from "./apiClient";
import type { NotificationLog } from "@/lib/types";

export const notificationService = {
  async getNotifications(): Promise<{ notifications: NotificationLog[] }> {
    return apiClient.get<{ notifications: NotificationLog[] }>("/api/notifications");
  },

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>("/api/notifications", {
      notificationId,
    });
  },
};
