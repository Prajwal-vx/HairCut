import fs from "fs";
import path from "path";
import {
  SalonDatabase,
  User,
  Stylist,
  Service,
  GalleryPhoto,
} from "./types";
import { removeLegacyDemoAccounts } from "./security";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "salon_data.json");

// Helper to compute date N days ago
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const DEFAULT_STYLISTS: Stylist[] = [
  {
    id: "stylist-1",
    name: "Aarav Sharma",
    bio: "Certified master barber with 8 years crafting razor-sharp skin fades, textured crops, and traditional hot-towel shaves.",
    specialty: "Precision Fades & Classic Barbering",
    photoUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    experienceYears: 8,
    active: true,
  },
  {
    id: "stylist-2",
    name: "Priya Shrestha",
    bio: "Internationally trained color artist specializing in dimensional balayage, honey blonde tones, and seamless root melts.",
    specialty: "Luxe Balayage & Creative Color",
    photoUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80",
    rating: 5.0,
    experienceYears: 6,
    active: true,
  },
  {
    id: "stylist-3",
    name: "Rohan Thapa",
    bio: "Sculptural stylist famed for precision bobs, wolf cuts, and effortless curtain bang transformations tailored to face shapes.",
    specialty: "Textured Layers & Modern Cuts",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    rating: 4.8,
    experienceYears: 7,
    active: true,
  },
  {
    id: "stylist-4",
    name: "Anita Adhikari",
    bio: "Holistic scalp therapist and spa specialist. Revitalizes dry, stressed hair with Ayurvedic botanicals and steam infusions.",
    specialty: "Scalp Therapy & Organic Treatments",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    rating: 4.9,
    experienceYears: 5,
    active: true,
  },
];

const DEFAULT_SERVICES: Service[] = [
  // Short Cuts
  {
    id: "srv-1",
    name: "Precision Barber Cut",
    category: "Short Cuts",
    price: 450,
    durationMinutes: 30,
    description: "Detailed scissor or clipper taper tailored to hair growth patterns, neck shave, and matte styling paste.",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80",
    popular: true,
  },
  {
    id: "srv-2",
    name: "Zero / Skin Fade & Hot Towel",
    category: "Short Cuts",
    price: 600,
    durationMinutes: 45,
    description: "Seamless foil shaver gradient with invigorating eucalyptus hot towel therapy and razor-clean perimeter.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
    popular: true,
  },
  {
    id: "srv-3",
    name: "Express Buzz & Sharp Outline",
    category: "Short Cuts",
    price: 350,
    durationMinutes: 20,
    description: "Uniform guard cut with precision hairline lineup, ear clean-up, and cooling aftershave splash.",
    image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&auto=format&fit=crop&q=80",
  },
  // Long Cuts
  {
    id: "srv-4",
    name: "Signature Layered Haircut",
    category: "Long Cuts",
    price: 850,
    durationMinutes: 50,
    description: "Custom sectioning to enhance movement, remove bulk, and frame the collarbone and cheekbones beautifully.",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80",
    popular: true,
  },
  {
    id: "srv-5",
    name: "Editorial French Bob & Bangs",
    category: "Long Cuts",
    price: 800,
    durationMinutes: 45,
    description: "Sharp jawline blunt or textured cut with custom curtain, bottleneck, or micro bangs.",
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "srv-6",
    name: "Complete Restyle & Density Balance",
    category: "Long Cuts",
    price: 1100,
    durationMinutes: 60,
    description: "Major transformation from long to structured length, including consultation, hair wash, and round-brush finish.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
  },
  // Color
  {
    id: "srv-7",
    name: "Full Dimension Balayage",
    category: "Color",
    price: 4500,
    durationMinutes: 120,
    description: "Hand-painted sun-kissed ribbons, root smudge, gloss toner, and bond-protecting Olaplex treatment.",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80",
    popular: true,
  },
  {
    id: "srv-8",
    name: "Global Organic Rich Color",
    category: "Color",
    price: 2800,
    durationMinutes: 90,
    description: "Ammonia-free full coverage gloss or depth tint infused with argan oil for long-lasting vibrancy.",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "srv-9",
    name: "Root Conceal & Gloss Finish",
    category: "Color",
    price: 1600,
    durationMinutes: 60,
    description: "Flawless grey coverage or tone matching on up to 2 inches of regrowth with illuminating gloss.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80",
  },
  // Styling
  {
    id: "srv-10",
    name: "Luxe Moroccan Oil Blowout",
    category: "Styling",
    price: 750,
    durationMinutes: 40,
    description: "Deep cleansing wash, scalp massage, and bouncy volume blow-dry with shine serum.",
    image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "srv-11",
    name: "Formal Updo & Hollywood Waves",
    category: "Styling",
    price: 1400,
    durationMinutes: 60,
    description: "Intricate wedding, graduation, or red-carpet styling with long-wear setting spray and hair pins.",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format&fit=crop&q=80",
  },
  // Beard Trim
  {
    id: "srv-12",
    name: "Sculpted Beard & Straight-Razor Edge",
    category: "Beard Trim",
    price: 350,
    durationMinutes: 25,
    description: "Length fading, cheekline symmetry, mustache detail, warm lather, and cedarwood conditioning oil.",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80",
    popular: true,
  },
  {
    id: "srv-13",
    name: "Royal Hot Towel Shave",
    category: "Beard Trim",
    price: 500,
    durationMinutes: 35,
    description: "Three-stage steaming towel ritual, pre-shave cream, feather razor pass, and cold stone closing.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
  },
  // Treatments
  {
    id: "srv-14",
    name: "Keratin Smooth Gloss Treatment",
    category: "Treatments",
    price: 4200,
    durationMinutes: 90,
    description: "Eliminates frizz for up to 12 weeks while retaining natural body, luster, and humidity resistance.",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80",
    popular: true,
  },
  {
    id: "srv-15",
    name: "Ayurvedic Scalp Detox & Steam",
    category: "Treatments",
    price: 1200,
    durationMinutes: 45,
    description: "Brahmi, neem, and tea tree scalp scrub with ultrasonic micro-mist to eliminate dandruff and promote growth.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
  },
];

const DEFAULT_GALLERY: GalleryPhoto[] = [
  {
    id: "gal-1",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80",
    caption: "Sharp skin fade with textured crop on top by Master Aarav",
    category: "Haircut",
    uploadedByAdminId: "user-admin",
    likesCount: 38,
    showOnHome: true,
    displayOrder: 1,
    aspectRatio: "portrait",
    createdAt: daysAgo(5),
  },
  {
    id: "gal-2",
    imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80",
    caption: "Caramel honey balayage for client Sunita before wedding season",
    category: "Color",
    uploadedByAdminId: "user-admin",
    likesCount: 52,
    showOnHome: true,
    displayOrder: 2,
    aspectRatio: "square",
    createdAt: daysAgo(7),
  },
  {
    id: "gal-3",
    imageUrl: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800&auto=format&fit=crop&q=80",
    caption: "Behind the scenes: Saturday styling rush at Ratan Complex",
    category: "Salon Event",
    uploadedByAdminId: "user-admin",
    likesCount: 41,
    showOnHome: true,
    displayOrder: 3,
    aspectRatio: "portrait",
    createdAt: daysAgo(12),
  },
  {
    id: "gal-4",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    caption: "Classic hot towel shave & beard sculpted to perfection",
    category: "Haircut",
    uploadedByAdminId: "user-admin",
    likesCount: 29,
    showOnHome: true,
    displayOrder: 4,
    aspectRatio: "square",
    createdAt: daysAgo(15),
  },
  {
    id: "gal-5",
    imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80",
    caption: "From overgrown waist-length to Parisian Bob: dramatic transformation!",
    category: "Before-After",
    uploadedByAdminId: "user-admin",
    likesCount: 88,
    showOnHome: true,
    displayOrder: 5,
    aspectRatio: "portrait",
    createdAt: daysAgo(18),
  },
  {
    id: "gal-6",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&auto=format&fit=crop&q=80",
    caption: "Keratin mirror shine treatment finished with soft beach curls",
    category: "Before-After",
    uploadedByAdminId: "user-admin",
    likesCount: 64,
    showOnHome: true,
    displayOrder: 6,
    aspectRatio: "portrait",
    createdAt: daysAgo(22),
  },
  {
    id: "gal-7",
    imageUrl: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=800&auto=format&fit=crop&q=80",
    caption: "Clean taper and natural texture for an easy everyday finish",
    category: "Haircut",
    uploadedByAdminId: "user-admin",
    likesCount: 35,
    showOnHome: true,
    displayOrder: 7,
    aspectRatio: "square",
    createdAt: daysAgo(25),
  },
  {
    id: "gal-8",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    caption: "Soft layers and honey highlights for a bright, dimensional look",
    category: "Color",
    uploadedByAdminId: "user-admin",
    likesCount: 47,
    showOnHome: true,
    displayOrder: 8,
    aspectRatio: "portrait",
    createdAt: daysAgo(28),
  },
  {
    id: "gal-9",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80",
    caption: "A polished blowout moment before the weekend celebrations",
    category: "Salon Event",
    uploadedByAdminId: "user-admin",
    likesCount: 56,
    showOnHome: true,
    displayOrder: 9,
    aspectRatio: "square",
    createdAt: daysAgo(31),
  },
  {
    id: "gal-10",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80",
    caption: "Fresh fringe and face-framing layers reveal a lighter silhouette",
    category: "Before-After",
    uploadedByAdminId: "user-admin",
    likesCount: 73,
    showOnHome: true,
    displayOrder: 10,
    aspectRatio: "portrait",
    createdAt: daysAgo(34),
  },
  {
    id: "gal-11",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80",
    caption: "Razor-finished beard detail with a crisp cheek line",
    category: "Haircut",
    uploadedByAdminId: "user-admin",
    likesCount: 31,
    showOnHome: false,
    displayOrder: 11,
    aspectRatio: "square",
    createdAt: daysAgo(37),
  },
  {
    id: "gal-12",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop&q=80",
    caption: "Warm copper gloss designed to catch the light naturally",
    category: "Color",
    uploadedByAdminId: "user-admin",
    likesCount: 61,
    showOnHome: false,
    displayOrder: 12,
    aspectRatio: "portrait",
    createdAt: daysAgo(40),
  },
  {
    id: "gal-13",
    imageUrl: "https://images.unsplash.com/photo-1542042161784-26ab9e041e89?w=800&auto=format&fit=crop&q=80",
    caption: "Friends, fresh cuts, and a little Saturday salon energy",
    category: "Salon Event",
    uploadedByAdminId: "user-admin",
    likesCount: 44,
    showOnHome: false,
    displayOrder: 13,
    aspectRatio: "square",
    createdAt: daysAgo(43),
  },
  {
    id: "gal-14",
    imageUrl: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&auto=format&fit=crop&q=80",
    caption: "Long layers transformed into an airy, movement-led finish",
    category: "Before-After",
    uploadedByAdminId: "user-admin",
    likesCount: 79,
    showOnHome: false,
    displayOrder: 14,
    aspectRatio: "portrait",
    createdAt: daysAgo(46),
  },
  {
    id: "gal-15",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80",
    caption: "Textured crop with a low fade and soft matte styling",
    category: "Haircut",
    uploadedByAdminId: "user-admin",
    likesCount: 42,
    showOnHome: false,
    displayOrder: 15,
    aspectRatio: "square",
    createdAt: daysAgo(49),
  },
  {
    id: "gal-16",
    imageUrl: "https://images.unsplash.com/photo-1595956553066-fe24a8c33395?w=800&auto=format&fit=crop&q=80",
    caption: "Glossy brunette ribbons blended for a seamless finish",
    category: "Color",
    uploadedByAdminId: "user-admin",
    likesCount: 58,
    showOnHome: false,
    displayOrder: 16,
    aspectRatio: "portrait",
    createdAt: daysAgo(52),
  },
  {
    id: "gal-17",
    imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80",
    caption: "A calm afternoon of colour consultations and creative planning",
    category: "Salon Event",
    uploadedByAdminId: "user-admin",
    likesCount: 36,
    showOnHome: false,
    displayOrder: 17,
    aspectRatio: "portrait",
    createdAt: daysAgo(55),
  },
  {
    id: "gal-18",
    imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=800&auto=format&fit=crop&q=80",
    caption: "Before and after: a sharper shape with effortless volume",
    category: "Before-After",
    uploadedByAdminId: "user-admin",
    likesCount: 69,
    showOnHome: false,
    displayOrder: 18,
    aspectRatio: "portrait",
    createdAt: daysAgo(58),
  },
  {
    id: "gal-19",
    imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?w=800&auto=format&fit=crop&q=80",
    caption: "Classic side part finished with a clean, modern edge",
    category: "Haircut",
    uploadedByAdminId: "user-admin",
    likesCount: 33,
    showOnHome: false,
    displayOrder: 19,
    aspectRatio: "square",
    createdAt: daysAgo(61),
  },
  {
    id: "gal-20",
    imageUrl: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=800&auto=format&fit=crop&q=80",
    caption: "Golden blonde dimension with a soft root melt",
    category: "Color",
    uploadedByAdminId: "user-admin",
    likesCount: 66,
    showOnHome: false,
    displayOrder: 20,
    aspectRatio: "portrait",
    createdAt: daysAgo(64),
  },
  {
    id: "gal-21",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&auto=format&fit=crop&q=80",
    caption: "The finishing touch: shine, shape, and confidence",
    category: "Before-After",
    uploadedByAdminId: "user-admin",
    likesCount: 84,
    showOnHome: false,
    displayOrder: 21,
    aspectRatio: "square",
    createdAt: daysAgo(67),
  },
  // Additional Premium Photos
  {
    id: "gal-22",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80",
    caption: "Executive mid-fade with sculpted crown texture & clean hairline",
    category: "Haircut",
    uploadedByAdminId: "user-owner",
    likesCount: 95,
    showOnHome: true,
    displayOrder: 22,
    aspectRatio: "portrait",
    createdAt: daysAgo(2),
  },
  {
    id: "gal-23",
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
    caption: "Luxe caramel melt & curtain fringe transformation by Priya",
    category: "Color",
    uploadedByAdminId: "user-owner",
    likesCount: 112,
    showOnHome: true,
    displayOrder: 23,
    aspectRatio: "portrait",
    createdAt: daysAgo(3),
  },
  {
    id: "gal-24",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    caption: "Modern butterfly layered cut with natural volume and movement",
    category: "Before-After",
    uploadedByAdminId: "user-owner",
    likesCount: 104,
    showOnHome: true,
    displayOrder: 24,
    aspectRatio: "portrait",
    createdAt: daysAgo(4),
  },
  {
    id: "gal-25",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    caption: "Sharp beard sculpting with botanical beard oil finish",
    category: "Haircut",
    uploadedByAdminId: "user-owner",
    likesCount: 48,
    showOnHome: false,
    displayOrder: 25,
    aspectRatio: "square",
    createdAt: daysAgo(8),
  },
  {
    id: "gal-26",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    caption: "Scalp steam therapy & ayurvedic deep nourishment treatment",
    category: "Salon Event",
    uploadedByAdminId: "user-owner",
    likesCount: 67,
    showOnHome: false,
    displayOrder: 26,
    aspectRatio: "portrait",
    createdAt: daysAgo(10),
  },
];

// NOTE: Default users are seeded with temporary passwords that MUST be changed after first login.
// Accounts must be provisioned through a trusted process; never seed public credentials.
const DEFAULT_USERS: User[] = [];

function initDatabase(): SalonDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const db: SalonDatabase = JSON.parse(content);
      let needsSave = false;

      // Remove legacy accounts that shipped with publicly documented demo passwords.
      needsSave = removeLegacyDemoAccounts(db) || needsSave;

      // Ensure gallery photos have showOnHome and include new photos
      const existingIds = new Set(db.galleryPhotos.map((p) => p.id));
      for (const defPhoto of DEFAULT_GALLERY) {
        if (!existingIds.has(defPhoto.id)) {
          db.galleryPhotos.push(defPhoto);
          needsSave = true;
        }
      }

      let homeCount = 0;
      for (const photo of db.galleryPhotos) {
        if (photo.showOnHome === undefined) {
          photo.showOnHome = homeCount < 10;
          homeCount++;
          needsSave = true;
        }
        if (!photo.aspectRatio) {
          photo.aspectRatio = "portrait";
          needsSave = true;
        }
      }

      if (needsSave) {
        writeDatabase(db);
      }
      return db;
    } catch {
      // If corrupted, reseed
    }
  }

  const initialData: SalonDatabase = {
    users: DEFAULT_USERS,
    stylists: DEFAULT_STYLISTS,
    services: DEFAULT_SERVICES,
    appointments: [],
    galleryPhotos: DEFAULT_GALLERY,
    notifications: [],
    loyaltyTransactions: [],
  };

  writeDatabase(initialData);
  return initialData;
}

export function readDatabase(): SalonDatabase {
  return initDatabase();
}

export function writeDatabase(data: SalonDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${DATA_FILE}.tmp.${Date.now()}.${Math.random().toString(36).slice(2)}`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmpFile, DATA_FILE);
  } catch {
    // Fallback in case rename fails on certain Windows locks
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch {
      // ignore
    }
  }
}
