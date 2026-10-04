import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { getRequestIdentity } from "@/lib/request-auth";
import { HaircutFeedback, StyleDNA } from "@/lib/types";

const VALID_MAINTENANCE_DIFFICULTY = new Set(["easy", "moderate", "hard"]);

// Compute or update StyleDNA traits from feedback
function upsertStyleDNA(
  db: ReturnType<typeof readDatabase>,
  userId: string,
  feedback: HaircutFeedback
): void {
  if (!db.styleDNA) db.styleDNA = [];

  const now = new Date().toISOString();
  const existingIdx = db.styleDNA.findIndex((d) => d.userId === userId);

  // Derive trait signals from feedback
  const isLowMaintenance = feedback.maintenanceDifficulty === "easy" ? 1 : 0;
  const isMinimalist = feedback.likedLength && feedback.maintenanceDifficulty === "easy" ? 1 : 0;
  const isTextured = feedback.likedSides && feedback.likedShape ? 1 : 0;
  const isClassic = feedback.wouldChooseAgain && feedback.overallRating >= 4 ? 1 : 0;
  const isExperimental = feedback.overallRating >= 4 && !feedback.likedLength ? 1 : 0;
  const isShortStyles = feedback.likedSides ? 1 : 0;
  const isNaturalFinish = feedback.maintenanceDifficulty !== "hard" ? 1 : 0;

  if (existingIdx === -1) {
    // Create new StyleDNA
    const dna: StyleDNA = {
      id: "dna-" + Date.now(),
      userId,
      minimalist: isMinimalist * 100,
      lowMaintenance: isLowMaintenance * 100,
      textured: isTextured * 100,
      classic: isClassic * 100,
      experimental: isExperimental * 100,
      shortStyles: isShortStyles * 100,
      naturalFinish: isNaturalFinish * 100,
      computedAt: now,
      updatedAt: now,
    };
    db.styleDNA.push(dna);
  } else {
    // Weighted average: 80% existing, 20% new signal
    const existing = db.styleDNA[existingIdx];
    const blend = (old: number, signal: number) => Math.round(old * 0.8 + signal * 100 * 0.2);
    db.styleDNA[existingIdx] = {
      ...existing,
      minimalist: blend(existing.minimalist, isMinimalist),
      lowMaintenance: blend(existing.lowMaintenance, isLowMaintenance),
      textured: blend(existing.textured, isTextured),
      classic: blend(existing.classic, isClassic),
      experimental: blend(existing.experimental, isExperimental),
      shortStyles: blend(existing.shortStyles, isShortStyles),
      naturalFinish: blend(existing.naturalFinish, isNaturalFinish),
      updatedAt: now,
    };
  }
}

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) {
    return NextResponse.json({ error: "Please log in to submit feedback." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    appointmentId,
    overallRating,
    likedLength,
    likedSides,
    likedShape,
    maintenanceDifficulty,
    wouldChooseAgain,
    additionalNotes,
  } = body;

  // Validate required fields
  if (!appointmentId || typeof appointmentId !== "string") {
    return NextResponse.json({ error: "appointmentId is required." }, { status: 400 });
  }
  if (typeof overallRating !== "number" || overallRating < 1 || overallRating > 5) {
    return NextResponse.json({ error: "overallRating must be a number between 1 and 5." }, { status: 400 });
  }
  if (typeof likedLength !== "boolean") {
    return NextResponse.json({ error: "likedLength must be a boolean." }, { status: 400 });
  }
  if (typeof likedSides !== "boolean") {
    return NextResponse.json({ error: "likedSides must be a boolean." }, { status: 400 });
  }
  if (typeof likedShape !== "boolean") {
    return NextResponse.json({ error: "likedShape must be a boolean." }, { status: 400 });
  }
  if (!maintenanceDifficulty || !VALID_MAINTENANCE_DIFFICULTY.has(maintenanceDifficulty as string)) {
    return NextResponse.json({ error: "maintenanceDifficulty must be one of: easy, moderate, hard." }, { status: 400 });
  }
  if (typeof wouldChooseAgain !== "boolean") {
    return NextResponse.json({ error: "wouldChooseAgain must be a boolean." }, { status: 400 });
  }
  if (additionalNotes !== undefined && (typeof additionalNotes !== "string" || (additionalNotes as string).length > 1000)) {
    return NextResponse.json({ error: "additionalNotes must be 1000 characters or fewer." }, { status: 400 });
  }

  const db = readDatabase();
  if (!db.haircutFeedback) db.haircutFeedback = [];

  // Find the appointment
  const aptIdx = db.appointments.findIndex((a) => a.id === appointmentId);
  if (aptIdx === -1) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const appointment = db.appointments[aptIdx];

  // Only the appointment owner can submit feedback
  if (appointment.userId !== identity.user.id) {
    return NextResponse.json({ error: "Forbidden: You can only submit feedback for your own appointments." }, { status: 403 });
  }

  // Only completed appointments can receive feedback
  if (appointment.status !== "completed") {
    return NextResponse.json({ error: "Feedback can only be submitted for completed appointments." }, { status: 400 });
  }

  // Prevent duplicate feedback
  if (appointment.feedbackGiven) {
    return NextResponse.json({ error: "Feedback has already been submitted for this appointment." }, { status: 409 });
  }

  const existingFeedback = db.haircutFeedback.find((f) => f.appointmentId === appointmentId);
  if (existingFeedback) {
    return NextResponse.json({ error: "Feedback has already been submitted for this appointment." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const feedback: HaircutFeedback = {
    id: "fb-" + Date.now(),
    appointmentId,
    userId: identity.user.id,
    overallRating: overallRating as number,
    likedLength: likedLength as boolean,
    likedSides: likedSides as boolean,
    likedShape: likedShape as boolean,
    maintenanceDifficulty: maintenanceDifficulty as HaircutFeedback["maintenanceDifficulty"],
    wouldChooseAgain: wouldChooseAgain as boolean,
    additionalNotes: additionalNotes ? (additionalNotes as string).trim() : undefined,
    createdAt: now,
  };

  db.haircutFeedback.push(feedback);

  // Mark appointment feedbackGiven
  db.appointments[aptIdx].feedbackGiven = true;

  // Update StyleDNA based on this feedback
  upsertStyleDNA(db, identity.user.id, feedback);

  writeDatabase(db);

  return NextResponse.json({ success: true, feedback }, { status: 201 });
}

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.haircutFeedback) db.haircutFeedback = [];

  const url = new URL(req.url);
  const appointmentId = url.searchParams.get("appointmentId");

  let feedback = db.haircutFeedback.filter((f) => f.userId === identity.user.id);
  if (appointmentId) {
    feedback = feedback.filter((f) => f.appointmentId === appointmentId);
  }

  return NextResponse.json({ feedback });
}
