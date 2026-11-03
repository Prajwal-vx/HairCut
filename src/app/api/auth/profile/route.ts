import { NextResponse } from "next/server";
import { getSafeUser, validateOrigin } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";
import { getRequestIdentity } from "@/lib/request-auth";
import { matchesPhone } from "@/lib/security";

const channels = ["app", "sms", "whatsapp", "email"] as const;
const genders = ["male", "female", "non-binary", "prefer-not-to-say"] as const;

export async function PATCH(request: Request) {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(request);
  if (!identity) return NextResponse.json({ error: "Please sign in to update your profile." }, { status: 401 });

  try {
    if (Number(request.headers.get("content-length") || 0) > 4096) {
      return NextResponse.json({ error: "Profile details are too large." }, { status: 413 });
    }
    const body = await request.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const birthday = typeof body.birthday === "string" ? body.birthday.trim() : "";
    const gender = body.gender;
    const preferredChannel = body.preferredChannel;

    if (!fullName || fullName.length > 100) {
      return NextResponse.json({ error: "Enter your name (up to 100 characters)." }, { status: 400 });
    }
    if (phone.length > 32 || phone.replace(/[^0-9]/g, "").length < 7) {
      return NextResponse.json({ error: "Enter a valid phone number with at least 7 digits." }, { status: 400 });
    }
    if (birthday && (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || Number.isNaN(Date.parse(`${birthday}T00:00:00`)) || birthday > new Date().toISOString().slice(0, 10))) {
      return NextResponse.json({ error: "Enter a valid birthday that is not in the future." }, { status: 400 });
    }
    if (gender !== undefined && !genders.includes(gender)) {
      return NextResponse.json({ error: "Choose a valid profile option." }, { status: 400 });
    }
    if (preferredChannel !== undefined && !channels.includes(preferredChannel)) {
      return NextResponse.json({ error: "Choose a valid way to receive updates." }, { status: 400 });
    }

    const db = readDatabase();
    const user = db.users.find((item) => item.id === identity.user.id);
    if (!user) return NextResponse.json({ error: "Your account could not be found." }, { status: 404 });
    if (db.users.some((item) => item.id !== user.id && matchesPhone(phone, item.phone))) {
      return NextResponse.json({ error: "That phone number is already linked to another account." }, { status: 409 });
    }

    user.fullName = fullName;
    user.phone = phone;
    user.birthday = birthday || undefined;
    if (gender !== undefined) user.gender = gender;
    if (preferredChannel !== undefined) user.preferredChannel = preferredChannel;
    writeDatabase(db);

    return NextResponse.json({ success: true, user: getSafeUser(user) });
  } catch {
    return NextResponse.json({ error: "We couldn’t save your profile. Please try again." }, { status: 400 });
  }
}
