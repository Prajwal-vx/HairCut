/**
 * Scalable centralized type exports.
 * Single source of truth for domain types and API communication models.
 */

import type { UserRole, GalleryCategory, AppointmentStatus } from "@/lib/types";

export * from "@/lib/types";

// Standard API Response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  meta?: Record<string, unknown>;
}

// Client Dashboard & Stats Models
export interface ClientStat {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  styleStreak: number;
  lastVisitDate: string | null;
  visitCount: number;
}

export interface DueClient {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  lastVisitDate: string;
  daysSince: number;
  styleStreak: number;
  preferredChannel: string;
}

export interface AdminStatsData {
  totalClients: number;
  totalAppointments: number;
  upcomingCount: number;
  completedCount: number;
  totalRevenue: number;
  repeatRate: number;
  topService: string;
  galleryCount: number;
  usersNeedingReminderCount: number;
  usersNeedingReminder: DueClient[];
  clients: ClientStat[];
}

export interface AuthSessionUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  loyaltyPoints: number;
  styleStreak: number;
  lastVisitDate: string | null;
  profilePhotoUrl?: string;
  referralCode: string;
  preferredChannel: string;
  isAdmin?: boolean;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  preferredChannel?: "app" | "sms" | "whatsapp" | "email";
  referralCodeInput?: string;
}

export interface ConfirmedAppointment {
  id: string;
  serviceName: string;
  stylistName: string;
  visitDate: string;
  timeSlot: string;
  amountPaid: number;
}

export interface AppointmentItem {
  id: string;
  userId: string;
  stylistId: string;
  serviceId: string;
  visitDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  amountPaid: number;
  serviceName?: string;
  stylistName?: string;
  userName?: string;
}

export interface GalleryPhotoItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: GalleryCategory;
  uploadedByAdminId: string;
  likesCount: number;
  showOnHome?: boolean;
  displayOrder?: number;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
  createdAt: string;
}

export interface ReminderDetail {
  userId: string;
  userName: string;
  daysSinceLastVisit: number;
  action: "sent" | "skipped_already_booked" | "skipped_already_sent" | "not_due";
  reason?: string;
}

export interface ReminderResultData {
  totalUsersChecked: number;
  remindersSent: number;
  remindersSkippedAlreadyBooked: number;
  remindersSkippedAlreadySent: number;
  details: ReminderDetail[];
}

export type AdminTab = "overview" | "appointments" | "clients" | "gallery" | "reminders";
