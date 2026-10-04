import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";

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

  const updates = await req.json();
  const db = readDatabase();
  const idx = db.galleryPhotos.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }

  if (typeof updates.showOnHome === "boolean") {
    db.galleryPhotos[idx].showOnHome = updates.showOnHome;
  }
  if (updates.caption !== undefined) {
    db.galleryPhotos[idx].caption = updates.caption;
  }
  if (updates.category !== undefined) {
    db.galleryPhotos[idx].category = updates.category;
  }
  if (updates.aspectRatio !== undefined) {
    db.galleryPhotos[idx].aspectRatio = updates.aspectRatio;
  }
  if (typeof updates.displayOrder === "number") {
    db.galleryPhotos[idx].displayOrder = updates.displayOrder;
  }

  writeDatabase(db);
  return NextResponse.json({ success: true, photo: db.galleryPhotos[idx] });
}
