import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "./types";
import { readDatabase } from "./db";
import { isValidRequestOrigin } from "./security";

let _jwtSecret: string | null = null;

// Simple in-memory rate limiter (for production, use Redis or a proper rate-limiting library)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
let rateLimitChecks = 0;
const MAX_RATE_LIMIT_ENTRIES = 10_000;

export function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  // Expire stale keys periodically and cap attacker-controlled key growth.
  if (++rateLimitChecks % 128 === 0 || rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
    for (const [key, value] of rateLimitMap) {
      if (value.resetTime <= now || rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) rateLimitMap.delete(key);
    }
  }
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    if (rateLimitMap.size < MAX_RATE_LIMIT_ENTRIES) {
      rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    }
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitResetTime(identifier: string): number | null {
  const record = rateLimitMap.get(identifier);
  return record ? record.resetTime : null;
}

// Origin validation for CSRF protection
export function validateOrigin(req: Request): boolean {
  return isValidRequestOrigin(
    req.headers.get("origin"),
    req.headers.get("host"),
    process.env.NODE_ENV,
  );
}

function getJwtSecret(): string {
  if (_jwtSecret) return _jwtSecret;

  const configured = process.env.JWT_SECRET?.trim();
  if (configured) {
    if (configured.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long.");
    }
    _jwtSecret = configured;
    return _jwtSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  // Persistent secret file in data/.jwt_secret
  try {
    const secretFile = path.join(process.cwd(), "data", ".jwt_secret");
    if (fs.existsSync(secretFile)) {
      const stored = fs.readFileSync(secretFile, "utf-8").trim();
      if (stored) {
        _jwtSecret = stored;
        return _jwtSecret;
      }
    }
    const generated = randomBytes(32).toString("hex");
    fs.writeFileSync(secretFile, generated, "utf-8");
    _jwtSecret = generated;
    return _jwtSecret;
  } catch (error) {
    throw new Error("Unable to create a development JWT secret.", { cause: error });
  }
}

export interface SessionPayload {
  userId: string;
  email: string;
  phone: string;
  role: UserRole;
  fullName: string;
  isAdmin?: boolean;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: SessionPayload): string {
  // Use shorter expiration for better security (7 days instead of 30)
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string | null | undefined): User | null {
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  const db = readDatabase();
  const user = db.users.find((u) => u.id === payload.userId);
  return user || null;
}

export function getSafeUser(user: User): Omit<User, "passwordHash"> {
  const { passwordHash, ...safeUser } = user;
  void passwordHash;
  return safeUser;
}
