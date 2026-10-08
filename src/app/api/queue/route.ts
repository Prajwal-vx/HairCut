import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";
import { SalonDatabase, WalkInEntry, QueueStatus } from "@/lib/types";

const VALID_STATUSES: QueueStatus[] = ["waiting", "in-service", "completed", "skipped", "left"];

function canManageQueue(identity: Awaited<ReturnType<typeof getRequestIdentity>>): boolean {
  return Boolean(identity && (identity.user.role === "STYLIST" || canManageSalon(identity)));
}

function calculateEstimatedWait(position: number): number {
  // Average service time is 20 minutes per person
  return position * 20;
}

function updateQueuePositions(db: SalonDatabase): void {
  if (!db.walkInQueue) return;

  const waitingEntries = db.walkInQueue
    .filter((entry) => entry.status === "waiting")
    .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

  waitingEntries.forEach((entry, index) => {
    entry.position = index + 1;
    entry.estimatedWaitMinutes = calculateEstimatedWait(entry.position);
  });
}

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  if (!db.walkInQueue) db.walkInQueue = [];

  updateQueuePositions(db);

  // Return full queue for staff, or user's entry for clients
  if (canManageQueue(identity)) {
    return NextResponse.json({ queue: db.walkInQueue });
  }

  const userEntry = db.walkInQueue.find((entry) => entry.userId === identity.user.id);
  return NextResponse.json({ queue: userEntry ? [userEntry] : [] });
}

export async function POST(req: Request) {
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
  if (!db.walkInQueue) db.walkInQueue = [];

  // Check if user is already in queue
  const existing = db.walkInQueue.find((entry) => entry.userId === identity.user.id && entry.status === "waiting");
  if (existing) {
    return NextResponse.json({ error: "You are already in the queue." }, { status: 409 });
  }

  const now = new Date().toISOString();
  const queueEntry: WalkInEntry = {
    id: "queue-" + Date.now(),
    name: body.name as string || identity.user.fullName,
    userId: identity.user.id,
    phone: body.phone as string || identity.user.phone,
    serviceId: body.serviceId ? (body.serviceId as string) : undefined,
    stylistId: body.stylistId ? (body.stylistId as string) : undefined,
    position: 0, // Will be calculated
    status: "waiting",
    estimatedWaitMinutes: 0, // Will be calculated
    joinedAt: now,
    notes: body.notes ? (body.notes as string) : undefined,
  };

  db.walkInQueue.push(queueEntry);
  updateQueuePositions(db);
  writeDatabase(db);

  return NextResponse.json({ success: true, queueEntry }, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only staff can update queue entries
  if (!canManageQueue(identity)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const db = readDatabase();
  if (!db.walkInQueue) db.walkInQueue = [];

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status as QueueStatus)) {
    return NextResponse.json({ error: "Invalid queue status." }, { status: 400 });
  }

  const idx = db.walkInQueue.findIndex((e: WalkInEntry) => e.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
  }

  const updated: WalkInEntry = {
    ...db.walkInQueue[idx],
    status: body.status !== undefined ? (body.status as QueueStatus) : db.walkInQueue[idx].status,
    stylistId: body.stylistId !== undefined ? (body.stylistId as string) : db.walkInQueue[idx].stylistId,
    notes: body.notes !== undefined ? (body.notes as string) : db.walkInQueue[idx].notes,
  };

  // Update timestamps based on status
  if (body.status === "in-service" && db.walkInQueue[idx].status !== "in-service") {
    updated.startedAt = new Date().toISOString();
  }
  if (body.status === "completed" && db.walkInQueue[idx].status !== "completed") {
    updated.completedAt = new Date().toISOString();
  }

  db.walkInQueue[idx] = updated;
  updateQueuePositions(db);
  writeDatabase(db);

  return NextResponse.json({ success: true, queueEntry: updated });
}

export async function DELETE(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const entryId = url.searchParams.get("id");

  if (!entryId) {
    return NextResponse.json({ error: "Entry ID is required." }, { status: 400 });
  }

  const db = readDatabase();
  if (!db.walkInQueue) db.walkInQueue = [];

  const idx = db.walkInQueue.findIndex((e: WalkInEntry) => e.id === entryId);

  // Users can only delete their own entries, staff can delete any
  if (idx === -1) {
    return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
  }

  if (!canManageQueue(identity) && db.walkInQueue[idx].userId !== identity.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  db.walkInQueue.splice(idx, 1);
  updateQueuePositions(db);
  writeDatabase(db);

  return NextResponse.json({ success: true });
}
