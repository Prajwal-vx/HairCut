import type {
  AppointmentStatus,
  GalleryCategory,
  NotificationChannel,
  QueueStatus,
  ServiceCategory,
} from "@/lib/types";

export const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
] as const;

export const VALID_TIME_SLOTS = new Set<string>(TIME_SLOTS);

export const APPOINTMENT_STATUSES: readonly AppointmentStatus[] = [
  "upcoming",
  "completed",
  "cancelled",
  "no-show",
] as const;

export const VALID_APPOINTMENT_STATUSES = new Set<string>(APPOINTMENT_STATUSES);

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  "Short Cuts",
  "Long Cuts",
  "Color",
  "Styling",
  "Beard Trim",
  "Treatments",
] as const;

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "Haircut",
  "Color",
  "Salon Event",
  "Before-After",
] as const;

export const VALID_GALLERY_CATEGORIES = new Set<GalleryCategory>(GALLERY_CATEGORIES);

export const GALLERY_ASPECT_RATIOS = ["square", "portrait", "landscape", "wide"] as const;
export const VALID_GALLERY_ASPECT_RATIOS = new Set<string>(GALLERY_ASPECT_RATIOS);

export const HAIR_TEXTURES = ["straight", "wavy", "curly", "coily"] as const;
export const VALID_HAIR_TEXTURES = new Set<string>(HAIR_TEXTURES);

export const HAIR_DENSITIES = ["thin", "medium", "thick"] as const;
export const VALID_HAIR_DENSITIES = new Set<string>(HAIR_DENSITIES);

export const HAIR_LENGTHS = ["very-short", "short", "medium", "long", "very-long"] as const;
export const VALID_HAIR_LENGTHS = new Set<string>(HAIR_LENGTHS);

export const MAINTENANCE_LEVELS = ["low", "medium", "high"] as const;
export const VALID_MAINTENANCE_LEVELS = new Set<string>(MAINTENANCE_LEVELS);

export const QUEUE_STATUSES: readonly QueueStatus[] = [
  "waiting",
  "in-service",
  "completed",
  "skipped",
  "left",
] as const;

export const VALID_QUEUE_STATUSES = new Set<QueueStatus>(QUEUE_STATUSES);

export const NOTIFICATION_CHANNELS: readonly NotificationChannel[] = [
  "app",
  "sms",
  "whatsapp",
  "email",
] as const;

export const VALID_NOTIFICATION_CHANNELS = new Set<string>(NOTIFICATION_CHANNELS);

export const GENDER_OPTIONS = ["male", "female", "non-binary", "prefer-not-to-say"] as const;
export const VALID_GENDERS = new Set<string>(GENDER_OPTIONS);

export const MAINTENANCE_DIFFICULTIES = ["easy", "moderate", "hard"] as const;
export const VALID_MAINTENANCE_DIFFICULTIES = new Set<string>(MAINTENANCE_DIFFICULTIES);
