export type UserRole = "CLIENT" | "ADMIN" | "STYLIST" | "OWNER";

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
  profilePhotoUrl?: string;
  loyaltyPoints: number;
  styleStreak: number;
  lastVisitDate: string | null;
  referralCode: string;
  referredBy?: string | null;
  preferredChannel: "app" | "sms" | "whatsapp" | "email";
  birthday?: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  bio: string;
  specialty: string;
  photoUrl: string;
  rating: number;
  experienceYears: number;
  active: boolean;
}

export type ServiceCategory =
  | "Short Cuts"
  | "Long Cuts"
  | "Color"
  | "Styling"
  | "Beard Trim"
  | "Treatments";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number; // in NPR (Rs.)
  durationMinutes: number;
  description: string;
  image: string;
  popular?: boolean;
}

export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "no-show";

export interface Appointment {
  id: string;
  userId: string;
  stylistId: string;
  serviceId: string;
  visitDate: string; // YYYY-MM-DD
  timeSlot: string;  // e.g. "10:30 AM"
  status: AppointmentStatus;
  notes?: string;
  amountPaid: number;
  createdAt: string;
  completedAt?: string | null;
  serviceName?: string;
  stylistName?: string;
  userName?: string;
  feedbackGiven?: boolean;
}

export type GalleryCategory = "Haircut" | "Color" | "Salon Event" | "Before-After";

export interface GalleryPhoto {
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

export type NotificationType = "35_day_reminder" | "booking_confirmed" | "promo" | "birthday";
export type NotificationChannel = "sms" | "whatsapp" | "email" | "app";

export interface NotificationLog {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: "delivered" | "read" | "pending";
  message: string;
  sentAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  pointsEarned: number;
  pointsRedeemed: number;
  reason: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// HAIR PASSPORT
// ──────────────────────────────────────────────
export interface HairPassport {
  id: string;
  userId: string;
  currentStyle: string;
  sideLength: string;
  topLength: string;
  necklinePreference: string;
  finishType: string;
  beardPreference?: string;
  fadeType?: string;
  hairTexture: "straight" | "wavy" | "curly" | "coily";
  hairDensity: "thin" | "medium" | "thick";
  hairLength: "very-short" | "short" | "medium" | "long" | "very-long";
  hairType: string;
  faceShape?: string;
  maintenanceLevel: "low" | "medium" | "high";
  preferredStylistId?: string;
  stylingProducts?: string;
  lastHaircutDate?: string;
  lastHaircutStyle?: string;
  satisfactionScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// STYLE DNA
// ──────────────────────────────────────────────
export interface StyleDNA {
  id: string;
  userId: string;
  minimalist: number;
  lowMaintenance: number;
  textured: number;
  classic: number;
  experimental: number;
  shortStyles: number;
  naturalFinish: number;
  computedAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// HAIRCUT FEEDBACK
// ──────────────────────────────────────────────
export interface HaircutFeedback {
  id: string;
  appointmentId: string;
  userId: string;
  overallRating: number;
  likedLength: boolean;
  likedSides: boolean;
  likedShape: boolean;
  maintenanceDifficulty: "easy" | "moderate" | "hard";
  wouldChooseAgain: boolean;
  additionalNotes?: string;
  stylistNotes?: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// WALK-IN QUEUE
// ──────────────────────────────────────────────
export type QueueStatus = "waiting" | "in-service" | "completed" | "skipped" | "left";

export interface WalkInEntry {
  id: string;
  name: string;
  userId?: string;
  phone?: string;
  serviceId?: string;
  stylistId?: string;
  position: number;
  status: QueueStatus;
  estimatedWaitMinutes: number;
  joinedAt: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

// ──────────────────────────────────────────────
// HAIRSTYLE CATALOG
// ──────────────────────────────────────────────
export interface Hairstyle {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  maintenanceLevel: "low" | "medium" | "high";
  lengthType: "very-short" | "short" | "medium" | "long";
  bestFor: string[];
  texture: string[];
  styleTime: number;
  trimFrequencyDays: number;
  popularityScore: number;
}

// ──────────────────────────────────────────────
// BARBER BRIEF
// ──────────────────────────────────────────────
export interface BarberBrief {
  id: string;
  userId: string;
  appointmentId?: string;
  requestedStyle: string;
  sidesInstruction: string;
  topInstruction: string;
  textureNote: string;
  hairlineNote: string;
  finishNote: string;
  maintenanceNote: string;
  referenceImageUrl?: string;
  additionalNotes?: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// PHOTO JOURNAL
// ──────────────────────────────────────────────
export interface HaircutPhoto {
  id: string;
  userId: string;
  appointmentId?: string;
  imageUrl: string;
  caption?: string;
  hairstyleTag?: string;
  rating?: number;
  isPrivate: boolean;
  takenAt: string;
  createdAt: string;
}

export interface SalonDatabase {
  users: User[];
  stylists: Stylist[];
  services: Service[];
  appointments: Appointment[];
  galleryPhotos: GalleryPhoto[];
  notifications: NotificationLog[];
  loyaltyTransactions: LoyaltyTransaction[];
  hairPassports?: HairPassport[];
  styleDNA?: StyleDNA[];
  haircutFeedback?: HaircutFeedback[];
  walkInQueue?: WalkInEntry[];
  hairstyles?: Hairstyle[];
  barberBriefs?: BarberBrief[];
  haircutPhotos?: HaircutPhoto[];
}