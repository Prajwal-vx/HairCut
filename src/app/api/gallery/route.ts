import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";
import { GalleryPhoto, GalleryCategory } from "@/lib/types";

const VALID_CATEGORIES = new Set<GalleryCategory>(["Haircut", "Color", "Salon Event", "Before-After"]);
const VALID_ASPECT_RATIOS = new Set(["square", "portrait", "landscape", "wide"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "images.unsplash.com";
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const db = readDatabase();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const homeOnly = searchParams.get("home") === "true";

  let photos = db.galleryPhotos;
  if (homeOnly) {
    photos = photos.filter((p) => p.showOnHome === true);
  }
  if (category && category !== "all") {
    photos = photos.filter((p) => p.category === category);
  }

  // Sort by displayOrder if present, otherwise by creation date
  photos.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));

  return NextResponse.json({ photos });
}

export async function POST(req: Request) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity || !canManageSalon(identity)) {
    return NextResponse.json({ error: "Owner or Admin access required." }, { status: 403 });
  }
  const user = identity.user;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  const { imageUrl, caption, category, showOnHome, aspectRatio } = body;
  if (!isHttpUrl(imageUrl) || typeof caption !== "string" || !caption.trim() || caption.length > 500 || typeof category !== "string" || !VALID_CATEGORIES.has(category as GalleryCategory)) {
    return NextResponse.json({ error: "imageUrl, caption, and category are required." }, { status: 400 });
  }
  if (showOnHome !== undefined && typeof showOnHome !== "boolean") return NextResponse.json({ error: "showOnHome must be a boolean." }, { status: 400 });
  if (aspectRatio !== undefined && (typeof aspectRatio !== "string" || !VALID_ASPECT_RATIOS.has(aspectRatio))) return NextResponse.json({ error: "Invalid aspect ratio." }, { status: 400 });

  const db = readDatabase();
  const newPhoto: GalleryPhoto = {
    id: "gal-" + Date.now(),
    imageUrl,
    caption: caption.trim(),
    category: category as GalleryCategory,
    uploadedByAdminId: user.id,
    likesCount: 0,
    showOnHome: showOnHome ?? true,
    displayOrder: 1,
    aspectRatio: (aspectRatio as GalleryPhoto["aspectRatio"]) || "portrait",
    createdAt: new Date().toISOString(),
  };

  db.galleryPhotos.unshift(newPhoto);
  writeDatabase(db);
  return NextResponse.json({ success: true, photo: newPhoto });
}
