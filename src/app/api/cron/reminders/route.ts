import { NextResponse } from "next/server";
import { runAutomaticRemindersJob } from "@/lib/reminders";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";

export async function POST(req: Request) {
  const cronSecret = req.headers.get("x-cron-secret");
  const configuredCronSecret = process.env.CRON_SECRET?.trim();
  const isValidCronRequest = configuredCronSecret && cronSecret === configuredCronSecret;
  const identity = isValidCronRequest ? null : await getRequestIdentity(req);
  if (!isValidCronRequest && !canManageSalon(identity)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For cron requests, skip origin validation (they come from external services)
  // For user requests, validate origin
  if (!isValidCronRequest && !validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const result = runAutomaticRemindersJob();
  return NextResponse.json({ success: true, result });
}

export async function GET(req: Request) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!canManageSalon(identity)) {
    return NextResponse.json({ error: "Staff or Owner access required." }, { status: 403 });
  }
  const result = runAutomaticRemindersJob();
  return NextResponse.json({ success: true, result });
}
