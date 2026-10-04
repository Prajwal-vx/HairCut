import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";
import { GalleryPhoto, GalleryCategory } from "@/lib/types";

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

  const { imageUrl, caption, category, showOnHome, aspectRatio } = await req.json();
  if (!imageUrl || !caption || !category) {
    return NextResponse.json({ error: "imageUrl, caption, and category are required." }, { status: 400 });
  }

  const db = readDatabase();
  const newPhoto: GalleryPhoto = {
    id: "gal-" + Date.now(),
    imageUrl,
    caption,
    category: category as GalleryCategory,
    uploadedByAdminId: user.id,
    likesCount: 0,
    showOnHome: showOnHome ?? true,
    displayOrder: 1,
    aspectRatio: aspectRatio || "portrait",
    createdAt: new Date().toISOString(),
  };

  db.galleryPhotos.unshift(newPhoto);
  writeDatabase(db);
  return NextResponse.json({ success: true, photo: newPhoto });
}
