import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { getRequestIdentity } from "@/lib/request-auth";
import { BarberBrief, HairPassport } from "@/lib/types";

function generateBarberBriefFromPassport(passport: HairPassport): Omit<BarberBrief, "id" | "userId" | "createdAt"> {
  const brief: Omit<BarberBrief, "id" | "userId" | "createdAt"> = {
    requestedStyle: passport.currentStyle,
    sidesInstruction: passport.sideLength,
    topInstruction: passport.topLength,
    textureNote: `Hair texture: ${passport.hairTexture}, Density: ${passport.hairDensity}`,
    hairlineNote: passport.necklinePreference,
    finishNote: passport.finishType,
    maintenanceNote: `Maintenance level: ${passport.maintenanceLevel}`,
    additionalNotes: passport.notes,
  };

  if (passport.fadeType) {
    brief.sidesInstruction += ` (${passport.fadeType})`;
  }

  if (passport.beardPreference) {
    brief.additionalNotes = brief.additionalNotes
      ? `${brief.additionalNotes} | Beard: ${passport.beardPreference}`
      : `Beard: ${passport.beardPreference}`;
  }

  if (passport.stylingProducts) {
    brief.additionalNotes = brief.additionalNotes
      ? `${brief.additionalNotes} | Products: ${passport.stylingProducts}`
      : `Products: ${passport.stylingProducts}`;
  }

  return brief;
}

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.barberBriefs) db.barberBriefs = [];

  const brief = db.barberBriefs.find((b) => b.userId === identity.user.id);
  if (!brief) {
    // Try to generate from Hair Passport
    const passport = db.hairPassports?.find((p) => p.userId === identity.user.id);
    if (!passport) {
      return NextResponse.json({ error: "No Hair Passport found. Please create one first." }, { status: 404 });
    }

    const generated = generateBarberBriefFromPassport(passport);
    const now = new Date().toISOString();

    const newBrief: BarberBrief = {
      id: "brief-" + Date.now(),
      userId: identity.user.id,
      ...generated,
      createdAt: now,
    };

    db.barberBriefs.push(newBrief);
    writeDatabase(db);

    return NextResponse.json({ barberBrief: newBrief });
  }

  return NextResponse.json({ barberBrief: brief });
}

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.barberBriefs) db.barberBriefs = [];

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const brief: BarberBrief = {
    id: "brief-" + Date.now(),
    userId: identity.user.id,
    appointmentId: body.appointmentId ? (body.appointmentId as string) : undefined,
    requestedStyle: (body.requestedStyle as string) || "",
    sidesInstruction: (body.sidesInstruction as string) || "",
    topInstruction: (body.topInstruction as string) || "",
    textureNote: (body.textureNote as string) || "",
    hairlineNote: (body.hairlineNote as string) || "",
    finishNote: (body.finishNote as string) || "",
    maintenanceNote: (body.maintenanceNote as string) || "",
    referenceImageUrl: body.referenceImageUrl ? (body.referenceImageUrl as string) : undefined,
    additionalNotes: body.additionalNotes ? (body.additionalNotes as string) : undefined,
    createdAt: now,
  };

  db.barberBriefs.push(brief);
  writeDatabase(db);

  return NextResponse.json({ success: true, barberBrief: brief }, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const db = readDatabase();
  if (!db.barberBriefs) db.barberBriefs = [];

  const idx = db.barberBriefs.findIndex((b) => b.userId === identity.user.id);
  if (idx === -1) {
    return NextResponse.json({ error: "No Barber Brief found. Please create one first." }, { status: 404 });
  }

  const updated: BarberBrief = {
    ...db.barberBriefs[idx],
    requestedStyle: body.requestedStyle !== undefined ? (body.requestedStyle as string) : db.barberBriefs[idx].requestedStyle,
    sidesInstruction: body.sidesInstruction !== undefined ? (body.sidesInstruction as string) : db.barberBriefs[idx].sidesInstruction,
    topInstruction: body.topInstruction !== undefined ? (body.topInstruction as string) : db.barberBriefs[idx].topInstruction,
    textureNote: body.textureNote !== undefined ? (body.textureNote as string) : db.barberBriefs[idx].textureNote,
    hairlineNote: body.hairlineNote !== undefined ? (body.hairlineNote as string) : db.barberBriefs[idx].hairlineNote,
    finishNote: body.finishNote !== undefined ? (body.finishNote as string) : db.barberBriefs[idx].finishNote,
    maintenanceNote: body.maintenanceNote !== undefined ? (body.maintenanceNote as string) : db.barberBriefs[idx].maintenanceNote,
    referenceImageUrl: body.referenceImageUrl !== undefined ? (body.referenceImageUrl as string) : db.barberBriefs[idx].referenceImageUrl,
    additionalNotes: body.additionalNotes !== undefined ? (body.additionalNotes as string) : db.barberBriefs[idx].additionalNotes,
  };

  db.barberBriefs[idx] = updated;
  writeDatabase(db);

  return NextResponse.json({ success: true, barberBrief: updated });
}
