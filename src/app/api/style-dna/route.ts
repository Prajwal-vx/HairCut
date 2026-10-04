import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { getRequestIdentity } from "@/lib/request-auth";
import { StyleDNA } from "@/lib/types";

const VALID_SCORES = [0, 100];

function validateStyleDNAFields(body: Record<string, unknown>): string | null {
  const fields: (keyof StyleDNA)[] = [
    "minimalist",
    "lowMaintenance",
    "textured",
    "classic",
    "experimental",
    "shortStyles",
    "naturalFinish",
  ];

  for (const field of fields) {
    const value = body[field];
    if (value === undefined || typeof value !== "number") {
      return `Field '${field}' must be a number.`;
    }
    if (value < 0 || value > 100) {
      return `Field '${field}' must be between 0 and 100.`;
    }
  }

  return null;
}

function computeStyleDNA(
  haircutHistory: any[],
  hairPassport: any,
  likes: string[],
  dislikes: string[]
): Omit<StyleDNA, "id" | "userId" | "computedAt" | "updatedAt"> {
  // Initialize scores
  let minimalist = 50;
  let lowMaintenance = 50;
  let textured = 50;
  let classic = 50;
  let experimental = 50;
  let shortStyles = 50;
  let naturalFinish = 50;

  // Analyze haircut history
  if (haircutHistory && haircutHistory.length > 0) {
    const recentCuts = haircutHistory.slice(-5); // Last 5 cuts

    for (const cut of recentCuts) {
      // Hair length analysis
      if (cut.hairLength === "very-short" || cut.hairLength === "short") {
        shortStyles += 10;
      } else if (cut.hairLength === "long" || cut.hairLength === "very-long") {
        shortStyles -= 10;
      }

      // Maintenance analysis
      if (cut.maintenanceLevel === "low") {
        lowMaintenance += 15;
        minimalist += 5;
      } else if (cut.maintenanceLevel === "high") {
        lowMaintenance -= 15;
        experimental += 5;
      }

      // Texture analysis
      if (cut.hairTexture === "curly" || cut.hairTexture === "coily") {
        textured += 10;
      }

      // Finish analysis
      if (cut.finishType?.toLowerCase().includes("natural") || cut.finishType?.toLowerCase().includes("matte")) {
        naturalFinish += 10;
        minimalist += 5;
      } else if (cut.finishType?.toLowerCase().includes("gloss") || cut.finishType?.toLowerCase().includes("shine")) {
        naturalFinish -= 5;
        classic += 5;
      }
    }
  }

  // Analyze Hair Passport
  if (hairPassport) {
    if (hairPassport.maintenanceLevel === "low") {
      lowMaintenance += 20;
      minimalist += 10;
    } else if (hairPassport.maintenanceLevel === "high") {
      lowMaintenance -= 20;
      experimental += 10;
    }

    if (hairPassport.hairTexture === "curly" || hairPassport.hairTexture === "coily") {
      textured += 15;
    }

    if (hairPassport.finishType?.toLowerCase().includes("natural")) {
      naturalFinish += 15;
      minimalist += 5;
    }

    if (hairPassport.fadeType?.toLowerCase().includes("skin") || hairPassport.fadeType?.toLowerCase().includes("zero")) {
      shortStyles += 10;
      classic += 5;
    }
  }

  // Analyze likes/dislikes (if hairstyle tags are stored)
  // This would be implemented when we have a like/dislike system for hairstyles
  // For now, we'll keep the base scores

  // Normalize scores to 0-100 range
  const normalize = (score: number) => Math.max(0, Math.min(100, score));

  return {
    minimalist: normalize(minimalist),
    lowMaintenance: normalize(lowMaintenance),
    textured: normalize(textured),
    classic: normalize(classic),
    experimental: normalize(experimental),
    shortStyles: normalize(shortStyles),
    naturalFinish: normalize(naturalFinish),
  };
}

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.styleDNA) db.styleDNA = [];

  const styleDNA = db.styleDNA.find((s) => s.userId === identity.user.id);
  if (!styleDNA) {
    // Try to compute from existing data
    const hairPassport = db.hairPassports?.find((p) => p.userId === identity.user.id);
    const haircutHistory = db.haircutFeedback?.filter((h) => h.userId === identity.user.id) || [];

    const computed = computeStyleDNA(haircutHistory, hairPassport, [], []);
    const now = new Date().toISOString();

    const newStyleDNA: StyleDNA = {
      id: "dna-" + Date.now(),
      userId: identity.user.id,
      ...computed,
      computedAt: now,
      updatedAt: now,
    };

    db.styleDNA.push(newStyleDNA);
    writeDatabase(db);

    return NextResponse.json({ styleDNA: newStyleDNA });
  }

  return NextResponse.json({ styleDNA });
}

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.styleDNA) db.styleDNA = [];

  const existing = db.styleDNA.find((s) => s.userId === identity.user.id);
  if (existing) {
    return NextResponse.json({ error: "Style DNA already exists. Use PATCH to update." }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validateStyleDNAFields(body);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const now = new Date().toISOString();
  const styleDNA: StyleDNA = {
    id: "dna-" + Date.now(),
    userId: identity.user.id,
    minimalist: body.minimalist as number,
    lowMaintenance: body.lowMaintenance as number,
    textured: body.textured as number,
    classic: body.classic as number,
    experimental: body.experimental as number,
    shortStyles: body.shortStyles as number,
    naturalFinish: body.naturalFinish as number,
    computedAt: now,
    updatedAt: now,
  };

  db.styleDNA.push(styleDNA);
  writeDatabase(db);

  return NextResponse.json({ success: true, styleDNA }, { status: 201 });
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
  if (!db.styleDNA) db.styleDNA = [];

  const idx = db.styleDNA.findIndex((s) => s.userId === identity.user.id);
  if (idx === -1) {
    return NextResponse.json({ error: "No Style DNA found. Please create one first." }, { status: 404 });
  }

  // Validate only the fields that are provided
  const merged = { ...db.styleDNA[idx], ...body };
  const validationError = validateStyleDNAFields(merged as Record<string, unknown>);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

  const now = new Date().toISOString();
  const updated: StyleDNA = {
    ...db.styleDNA[idx],
    minimalist: body.minimalist !== undefined ? (body.minimalist as number) : db.styleDNA[idx].minimalist,
    lowMaintenance: body.lowMaintenance !== undefined ? (body.lowMaintenance as number) : db.styleDNA[idx].lowMaintenance,
    textured: body.textured !== undefined ? (body.textured as number) : db.styleDNA[idx].textured,
    classic: body.classic !== undefined ? (body.classic as number) : db.styleDNA[idx].classic,
    experimental: body.experimental !== undefined ? (body.experimental as number) : db.styleDNA[idx].experimental,
    shortStyles: body.shortStyles !== undefined ? (body.shortStyles as number) : db.styleDNA[idx].shortStyles,
    naturalFinish: body.naturalFinish !== undefined ? (body.naturalFinish as number) : db.styleDNA[idx].naturalFinish,
    updatedAt: now,
  };

  db.styleDNA[idx] = updated;
  writeDatabase(db);

  return NextResponse.json({ success: true, styleDNA: updated });
}

export async function DELETE(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.styleDNA) db.styleDNA = [];

  const idx = db.styleDNA.findIndex((s) => s.userId === identity.user.id);
  if (idx === -1) {
    return NextResponse.json({ error: "No Style DNA found." }, { status: 404 });
  }

  db.styleDNA.splice(idx, 1);
  writeDatabase(db);

  return NextResponse.json({ success: true });
}
