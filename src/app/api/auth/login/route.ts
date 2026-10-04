import { NextResponse } from "next/server";
import { readDatabase } from "@/lib/db";
import { comparePassword, getSafeUser, hashPassword, signToken, checkRateLimit, getRateLimitResetTime, validateOrigin } from "@/lib/auth";
import { findUserByIdentifier } from "@/lib/security";
import { writeDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 8192) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    // Origin validation for CSRF protection
    if (!validateOrigin(req)) {
      return NextResponse.json(
        { error: "Invalid origin." },
        { status: 403 }
      );
    }

    const { identifier, password } = await req.json();

    if (typeof identifier !== "string" || typeof password !== "string" || !identifier.trim() || !password || identifier.length > 254 || password.length > 72) {
      return NextResponse.json(
        { error: "Phone number/email and password are required." },
        { status: 400 }
      );
    }

    // Rate limiting based on IP and identifier
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `${ip}:${identifier.trim().toLowerCase()}`;

    if (!checkRateLimit(rateLimitKey, 5, 60000)) {
      const resetTime = getRateLimitResetTime(rateLimitKey);
      const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60;
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    const db = readDatabase();
    const user = findUserByIdentifier(db.users, identifier);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isValid = comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (!user.passwordHash.startsWith("$2")) {
      user.passwordHash = hashPassword(password);
      writeDatabase(db);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: getSafeUser(user),
    });

    response.cookies.set("salon_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days to match token expiration
      sameSite: "strict", // Changed from lax to strict for better CSRF protection
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 400 });
  }
}
