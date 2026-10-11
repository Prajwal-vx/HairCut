import { apiClient } from "./apiClient";
import type { QueueStatus, WalkInEntry } from "@/lib/types";

export interface JoinQueuePayload {
  name?: string;
  phone?: string;
  serviceId?: string;
  stylistId?: string;
  notes?: string;
}

export interface UpdateQueuePayload {
  id: string;
  status?: QueueStatus;
  stylistId?: string;
  notes?: string;
}

export const queueService = {
  async getQueue(): Promise<{ queue: WalkInEntry[] }> {
    return apiClient.get<{ queue: WalkInEntry[] }>("/api/queue");
  },

  async joinQueue(payload: JoinQueuePayload): Promise<{ success: boolean; queueEntry: WalkInEntry }> {
    return apiClient.post<{ success: boolean; queueEntry: WalkInEntry }>("/api/queue", payload);
  },

  async updateQueue(payload: UpdateQueuePayload): Promise<{ success: boolean; queueEntry: WalkInEntry }> {
    return apiClient.patch<{ success: boolean; queueEntry: WalkInEntry }>("/api/queue", payload);
  },

  async leaveQueue(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>("/api/queue", {
      params: { id },
    });
  },
};
