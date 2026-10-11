import { apiClient } from "./apiClient";
import type { Appointment } from "@/lib/types";

export type ConfirmedAppointment = Appointment & {
  serviceName?: string;
  stylistName?: string;
  userName?: string;
};

export interface CreateAppointmentPayload {
  stylistId: string;
  serviceId: string;
  visitDate: string;
  timeSlot: string;
  notes?: string;
}

export const appointmentService = {
  async getAppointments(): Promise<{ appointments: ConfirmedAppointment[] }> {
    return apiClient.get<{ appointments: ConfirmedAppointment[] }>("/api/appointments");
  },

  async createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<{ success: boolean; appointment: ConfirmedAppointment }> {
    return apiClient.post<{ success: boolean; appointment: ConfirmedAppointment }>(
      "/api/appointments",
      payload
    );
  },

  async updateStatus(
    appointmentId: string,
    status: Appointment["status"]
  ): Promise<{ success: boolean; appointment: Appointment }> {
    return apiClient.patch<{ success: boolean; appointment: Appointment }>("/api/appointments", {
      appointmentId,
      status,
    });
  },

  async cancelAppointment(appointmentId: string): Promise<{ success: boolean }> {
    return apiClient.patch<{ success: boolean }>("/api/appointments", {
      appointmentId,
      status: "cancelled",
    });
  },
};
