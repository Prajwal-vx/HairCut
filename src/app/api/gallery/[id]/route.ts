import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";

const VALID_CATEGORIES = new Set(["Haircut", "Color", "Salon Event", "Before-After"]);
const VALID_ASPECT_RATIOS = new Set(["square", "portrait", "landscape", "wide"]);

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const { id } = await context.params;
  const identity = await getRequestIdentity(req);
  if (!canManageSalon(identity)) {
    return NextResponse.json({ error: "Owner or Admin access required." }, { status: 403 });
  }

  const db = readDatabase();
  db.galleryPhotos = db.galleryPhotos.filter((p) => p.id !== id);
  writeDatabase(db);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const { id } = await context.params;
  const identity = await getRequestIdentity(req);
  if (!canManageSalon(identity)) {
    return NextResponse.json({ error: "Owner or Admin access required." }, { status: 403 });
  }

  let updates: unknown;
  try {
    updates = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const patch = updates as Record<string, unknown>;
  if (patch.caption !== undefined && (typeof patch.caption !== "string" || !patch.caption.trim() || patch.caption.length > 500)) {
    return NextResponse.json({ error: "Caption must be 1 to 500 characters." }, { status: 400 });
  }
  if (patch.category !== undefined && (typeof patch.category !== "string" || !VALID_CATEGORIES.has(patch.category))) {
    return NextResponse.json({ error: "Invalid gallery category." }, { status: 400 });
  }
  if (patch.aspectRatio !== undefined && (typeof patch.aspectRatio !== "string" || !VALID_ASPECT_RATIOS.has(patch.aspectRatio))) {
    return NextResponse.json({ error: "Invalid aspect ratio." }, { status: 400 });
  }
  if (patch.displayOrder !== undefined && (typeof patch.displayOrder !== "number" || !Number.isInteger(patch.displayOrder) || patch.displayOrder < 0 || patch.displayOrder > 10000)) {
    return NextResponse.json({ error: "displayOrder must be a non-negative integer." }, { status: 400 });
  }
  if (patch.showOnHome !== undefined && typeof patch.showOnHome !== "boolean") {
    return NextResponse.json({ error: "showOnHome must be a boolean." }, { status: 400 });
  }
  const db = readDatabase();
  const idx = db.galleryPhotos.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  if (typeof patch.showOnHome === "boolean") {
    db.galleryPhotos[idx].showOnHome = patch.showOnHome;
  }
  if (patch.caption !== undefined) {
    db.galleryPhotos[idx].caption = (patch.caption as string).trim();
  }
  if (patch.category !== undefined) {
    db.galleryPhotos[idx].category = patch.category as typeof db.galleryPhotos[number]["category"];
  }
  if (patch.aspectRatio !== undefined) {
    db.galleryPhotos[idx].aspectRatio = patch.aspectRatio as typeof db.galleryPhotos[number]["aspectRatio"];
  }
  if (typeof patch.displayOrder === "number") {
    db.galleryPhotos[idx].displayOrder = patch.displayOrder;
  }

  writeDatabase(db);
  return NextResponse.json({ success: true, photo: db.galleryPhotos[idx] });
}
