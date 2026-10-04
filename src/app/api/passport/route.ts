import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { getRequestIdentity } from "@/lib/request-auth";
import { HairPassport } from "@/lib/types";

const VALID_HAIR_TEXTURES = new Set(["straight", "wavy", "curly", "coily"]);
const VALID_HAIR_DENSITY = new Set(["thin", "medium", "thick"]);
const VALID_HAIR_LENGTH = new Set(["very-short", "short", "medium", "long", "very-long"]);
const VALID_MAINTENANCE = new Set(["low", "medium", "high"]);

function validatePassportFields(body: Record<string, unknown>): string | null {
  const required: (keyof HairPassport)[] = [
    "currentStyle",
    "sideLength",
    "topLength",
    "necklinePreference",
    "finishType",
    "hairTexture",
    "hairDensity",
    "hairLength",
    "hairType",
    "maintenanceLevel",
  ];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || (body[field] as string).trim() === "") {
      return `Field '${field}' is required.`;
    }
  }
  if (!VALID_HAIR_TEXTURES.has(body.hairTexture as string)) {
    return "hairTexture must be one of: straight, wavy, curly, coily.";
  }
  if (!VALID_HAIR_DENSITY.has(body.hairDensity as string)) {
    return "hairDensity must be one of: thin, medium, thick.";
  }
  if (!VALID_HAIR_LENGTH.has(body.hairLength as string)) {
    return "hairLength must be one of: very-short, short, medium, long, very-long.";
  }
  if (!VALID_MAINTENANCE.has(body.maintenanceLevel as string)) {
    return "maintenanceLevel must be one of: low, medium, high.";
  }
  if (body.satisfactionScore !== undefined) {
    const score = Number(body.satisfactionScore);
    if (isNaN(score) || score < 1 || score > 5) {
      return "satisfactionScore must be a number between 1 and 5.";
    }
  }
  if (body.notes !== undefined && (typeof body.notes !== "string" || (body.notes as string).length > 1000)) {
    return "notes must be 1000 characters or fewer.";
  }
  return null;
}

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.hairPassports) db.hairPassports = [];

  const passport = db.hairPassports.find((p) => p.userId === identity.user.id);
  if (!passport) return NextResponse.json({ passport: null });

  return NextResponse.json({ passport });
}

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Please log in to create your Hair Passport." }, { status: 401 });

  const db = readDatabase();
  if (!db.hairPassports) db.hairPassports = [];

  const existing = db.hairPassports.find((p) => p.userId === identity.user.id);
  if (existing) {
    return NextResponse.json({ error: "You already have a Hair Passport. Use PATCH to update it." }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validatePassportFields(body);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const now = new Date().toISOString();
  const passport: HairPassport = {
    id: "pass-" + Date.now(),
    userId: identity.user.id,
    currentStyle: (body.currentStyle as string).trim(),
    sideLength: (body.sideLength as string).trim(),
    topLength: (body.topLength as string).trim(),
    necklinePreference: (body.necklinePreference as string).trim(),
    finishType: (body.finishType as string).trim(),
    hairTexture: body.hairTexture as HairPassport["hairTexture"],
    hairDensity: body.hairDensity as HairPassport["hairDensity"],
    hairLength: body.hairLength as HairPassport["hairLength"],
    hairType: (body.hairType as string).trim(),
    maintenanceLevel: body.maintenanceLevel as HairPassport["maintenanceLevel"],
    beardPreference: body.beardPreference ? (body.beardPreference as string).trim() : undefined,
    fadeType: body.fadeType ? (body.fadeType as string).trim() : undefined,
    faceShape: body.faceShape ? (body.faceShape as string).trim() : undefined,
    stylingProducts: body.stylingProducts ? (body.stylingProducts as string).trim() : undefined,
    lastHaircutDate: body.lastHaircutDate ? (body.lastHaircutDate as string).trim() : undefined,
    lastHaircutStyle: body.lastHaircutStyle ? (body.lastHaircutStyle as string).trim() : undefined,
    satisfactionScore: body.satisfactionScore !== undefined ? Number(body.satisfactionScore) : undefined,
    preferredStylistId: body.preferredStylistId ? (body.preferredStylistId as string).trim() : undefined,
    notes: body.notes ? (body.notes as string).trim() : undefined,
    createdAt: now,
    updatedAt: now,
  };

  db.hairPassports.push(passport);
  writeDatabase(db);

  return NextResponse.json({ success: true, passport }, { status: 201 });
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
  if (!db.hairPassports) db.hairPassports = [];

  const idx = db.hairPassports.findIndex((p) => p.userId === identity.user.id);
  if (idx === -1) {
    return NextResponse.json({ error: "No Hair Passport found. Please create one first." }, { status: 404 });
  }

  // Validate only the fields that are provided
  const merged = { ...db.hairPassports[idx], ...body };
  const validationError = validatePassportFields(merged as Record<string, unknown>);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const now = new Date().toISOString();
  const updated: HairPassport = {
    ...db.hairPassports[idx],
    currentStyle: body.currentStyle !== undefined ? (body.currentStyle as string).trim() : db.hairPassports[idx].currentStyle,
    sideLength: body.sideLength !== undefined ? (body.sideLength as string).trim() : db.hairPassports[idx].sideLength,
    topLength: body.topLength !== undefined ? (body.topLength as string).trim() : db.hairPassports[idx].topLength,
    necklinePreference: body.necklinePreference !== undefined ? (body.necklinePreference as string).trim() : db.hairPassports[idx].necklinePreference,
    finishType: body.finishType !== undefined ? (body.finishType as string).trim() : db.hairPassports[idx].finishType,
    hairTexture: body.hairTexture !== undefined ? (body.hairTexture as HairPassport["hairTexture"]) : db.hairPassports[idx].hairTexture,
    hairDensity: body.hairDensity !== undefined ? (body.hairDensity as HairPassport["hairDensity"]) : db.hairPassports[idx].hairDensity,
    hairLength: body.hairLength !== undefined ? (body.hairLength as HairPassport["hairLength"]) : db.hairPassports[idx].hairLength,
    hairType: body.hairType !== undefined ? (body.hairType as string).trim() : db.hairPassports[idx].hairType,
    maintenanceLevel: body.maintenanceLevel !== undefined ? (body.maintenanceLevel as HairPassport["maintenanceLevel"]) : db.hairPassports[idx].maintenanceLevel,
    beardPreference: body.beardPreference !== undefined ? (body.beardPreference as string).trim() : db.hairPassports[idx].beardPreference,
    fadeType: body.fadeType !== undefined ? (body.fadeType as string).trim() : db.hairPassports[idx].fadeType,
    faceShape: body.faceShape !== undefined ? (body.faceShape as string).trim() : db.hairPassports[idx].faceShape,
    stylingProducts: body.stylingProducts !== undefined ? (body.stylingProducts as string).trim() : db.hairPassports[idx].stylingProducts,
    lastHaircutDate: body.lastHaircutDate !== undefined ? (body.lastHaircutDate as string).trim() : db.hairPassports[idx].lastHaircutDate,
    lastHaircutStyle: body.lastHaircutStyle !== undefined ? (body.lastHaircutStyle as string).trim() : db.hairPassports[idx].lastHaircutStyle,
    satisfactionScore: body.satisfactionScore !== undefined ? Number(body.satisfactionScore) : db.hairPassports[idx].satisfactionScore,
    preferredStylistId: body.preferredStylistId !== undefined ? (body.preferredStylistId as string).trim() : db.hairPassports[idx].preferredStylistId,
    notes: body.notes !== undefined ? (body.notes as string).trim() : db.hairPassports[idx].notes,
    updatedAt: now,
  };

  db.hairPassports[idx] = updated;
  writeDatabase(db);

  return NextResponse.json({ success: true, passport: updated });
}
