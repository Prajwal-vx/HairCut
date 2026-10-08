import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { getSafeUser, hashPassword, signToken, checkRateLimit, getRateLimitResetTime, validateOrigin } from "@/lib/auth";
import { matchesPhone } from "@/lib/security";
import { User, LoyaltyTransaction } from "@/lib/types";

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

    const { fullName, phone, email, password, gender, preferredChannel, referralCodeInput } = await req.json();

    if (typeof fullName !== "string" || typeof phone !== "string" || typeof email !== "string" || typeof password !== "string" || !fullName.trim() || !phone.trim() || !email.trim() || !password) {
      return NextResponse.json(
        { error: "Full name, phone, email, and password are required." },
        { status: 400 }
      );
    }

    if (fullName.trim().length > 100 || phone.length > 32 || email.length > 254 || password.length > 72 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please provide valid registration details." }, { status: 400 });
    }
    if (gender !== undefined && !["male", "female", "non-binary", "prefer-not-to-say"].includes(gender)) {
      return NextResponse.json({ error: "Please select a valid gender option." }, { status: 400 });
    }
    if (preferredChannel !== undefined && !["app", "sms", "whatsapp", "email"].includes(preferredChannel)) {
      return NextResponse.json({ error: "Please select a valid notification channel." }, { status: 400 });
    }
    if (referralCodeInput !== undefined && (typeof referralCodeInput !== "string" || referralCodeInput.length > 64)) {
      return NextResponse.json({ error: "Referral code is invalid." }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Check for at least one letter and one number
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one letter and one number." },
        { status: 400 }
      );
    }

    // Rate limiting based on IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(`register:${ip}`, 3, 3600000)) {
      const resetTime = getRateLimitResetTime(`register:${ip}`);
      const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 3600;
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    const db = readDatabase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");

    const emailAllowed = checkRateLimit(`register-email:${cleanEmail}`, 3, 3600000);
    const phoneAllowed = checkRateLimit(`register-phone:${cleanPhone}`, 3, 3600000);
    if (!emailAllowed || !phoneAllowed) {
      const resetTime = getRateLimitResetTime(`register-email:${cleanEmail}`) || getRateLimitResetTime(`register-phone:${cleanPhone}`);
      const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 3600;
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    if (cleanPhone.length < 7) {
      return NextResponse.json(
        { error: "Please provide a valid phone number (at least 7 digits)." },
        { status: 400 }
      );
    }

    // Check duplicate email or phone (preventing empty string collisions and supporting country codes)
    const exists = db.users.some((u) => {
      const emailMatches = u.email.toLowerCase() === cleanEmail;
      const phoneMatches = matchesPhone(cleanPhone, u.phone);
      return emailMatches || phoneMatches;
    });

    if (exists) {
      return NextResponse.json(
        { error: "An account with this email or phone number already exists." },
        { status: 409 }
      );
    }

    const newUserId = "user-" + Date.now();
    const myReferralCode = fullName.split(" ")[0].toUpperCase() + Math.floor(100 + Math.random() * 900);

    // Initial welcome loyalty points bonus: 50 points
    let startingPoints = 50;
    const transactions: LoyaltyTransaction[] = [
      {
        id: "lt-" + Date.now(),
        userId: newUserId,
        pointsEarned: 50,
        pointsRedeemed: 0,
        reason: "Welcome to Unisex Haircut Birtamode Bonus",
        createdAt: new Date().toISOString(),
      },
    ];

    // Referral bonus if code provided
    if (referralCodeInput) {
      const referrer = db.users.find(
        (u) => u.referralCode?.toUpperCase() === referralCodeInput.trim().toUpperCase()
      );
      if (referrer) {
        startingPoints += 25;
        referrer.loyaltyPoints += 50;
        transactions.push(
          {
            id: "lt-" + (Date.now() + 1),
            userId: newUserId,
            pointsEarned: 25,
            pointsRedeemed: 0,
            reason: `Referred by ${referrer.fullName}`,
            createdAt: new Date().toISOString(),
          },
          {
            id: "lt-" + (Date.now() + 2),
            userId: referrer.id,
            pointsEarned: 50,
            pointsRedeemed: 0,
            reason: `Friend referral reward (${fullName})`,
            createdAt: new Date().toISOString(),
          }
        );
      }
    }

    const newUser: User = {
      id: newUserId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      role: "CLIENT",
      gender: gender || "prefer-not-to-say",
      profilePhotoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80",
      loyaltyPoints: startingPoints,
      styleStreak: 1, // Starts journey
      lastVisitDate: null,
      referralCode: myReferralCode,
      referredBy: referralCodeInput ? referralCodeInput.trim().toUpperCase() : null,
      preferredChannel: preferredChannel || "whatsapp",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    db.loyaltyTransactions.push(...transactions);
    writeDatabase(db);

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: getSafeUser(newUser),
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
    return NextResponse.json({ error: "Registration failed." }, { status: 400 });
  }
}
