import { apiClient } from "./apiClient";
import type { HaircutFeedback } from "@/lib/types";

export interface SubmitFeedbackPayload {
  appointmentId: string;
  overallRating: number;
  likedLength: boolean;
  likedSides: boolean;
  likedShape: boolean;
  maintenanceDifficulty: HaircutFeedback["maintenanceDifficulty"];
  wouldChooseAgain: boolean;
  additionalNotes?: string;
}

export const feedbackService = {
  async submitFeedback(
    payload: SubmitFeedbackPayload
  ): Promise<{ success: boolean; feedback: HaircutFeedback }> {
    return apiClient.post<{ success: boolean; feedback: HaircutFeedback }>(
      "/api/feedback",
      payload
    );
  },

  async getFeedback(appointmentId?: string): Promise<{ feedback: HaircutFeedback[] }> {
    return apiClient.get<{ feedback: HaircutFeedback[] }>("/api/feedback", {
      params: { appointmentId },
    });
  },
};
