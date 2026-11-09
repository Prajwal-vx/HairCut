import { withDatabaseRoute, readDatabase, writeDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { validateOrigin } from "@/lib/auth";
import { getRequestIdentity } from "@/lib/request-auth";

async function getHandler(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  const myNotifs = db.notifications.filter((n) => n.userId === identity.user.id);
  return NextResponse.json({ notifications: myNotifs });
}

async function patchHandler(req: Request) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { notificationId } = await req.json();
  const db = readDatabase();
  const idx = db.notifications.findIndex((n) => n.id === notificationId && n.userId === identity.user.id);
  if (idx !== -1) {
    db.notifications[idx].status = "read";
    writeDatabase(db);
  }
  return NextResponse.json({ success: true });
}

export const GET = withDatabaseRoute(getHandler);

export const PATCH = withDatabaseRoute(patchHandler);
