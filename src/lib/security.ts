import { createHash, timingSafeEqual } from "crypto";
import type { SalonDatabase } from "./types";

export function isValidRequestOrigin(
  origin: string | null,
  host: string | null,
  environment: string | undefined,
  configuredOrigin: string | undefined = process.env.APP_ORIGIN,
): boolean {
  if (!origin || !host) return false;
  try {
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.username || parsedOrigin.password || parsedOrigin.pathname !== "/" || parsedOrigin.search || parsedOrigin.hash) return false;
    if (environment === "production" && parsedOrigin.protocol !== "https:") return false;
    if (configuredOrigin) return parsedOrigin.origin === new URL(configuredOrigin).origin;
    return parsedOrigin.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export function matchesLegacyPassword(password: string, hash: string): boolean {
  if (!/^[a-f\d]{64}$/i.test(hash)) return false;

  const passwordHash = createHash("sha256").update(password).digest();
  return timingSafeEqual(passwordHash, Buffer.from(hash, "hex"));
}

/** Checks Have I Been Pwned's k-anonymity range API without disclosing a full password hash. */
export async function isCompromisedPassword(password: string): Promise<boolean> {
  const digest = createHash("sha1").update(password, "utf8").digest("hex").toUpperCase();
  const prefix = digest.slice(0, 5);
  const suffix = digest.slice(5);
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true", "User-Agent": "HairCut-Password-Policy" },
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Compromised password check unavailable");
  const hashes = await response.text();
  return hashes.split(/\r?\n/).some((line) => line.split(":", 1)[0]?.toUpperCase() === suffix);
}

export function removeLegacyDemoAccounts(db: SalonDatabase): boolean {
  const legacyDemoIds = new Set(["user-owner", "user-admin", "user-client-1", "user-client-2"]);
  const legacyIds = new Set(db.users.filter((user) => legacyDemoIds.has(user.id)).map((user) => user.id));
  if (legacyIds.size === 0) return false;

  db.users = db.users.filter((user) => !legacyIds.has(user.id));
  db.appointments = db.appointments.filter((appointment) => !legacyIds.has(appointment.userId));
  db.notifications = db.notifications.filter((notification) => !legacyIds.has(notification.userId));
  db.loyaltyTransactions = db.loyaltyTransactions.filter((transaction) => !legacyIds.has(transaction.userId));
  return true;
}

export function matchesPhone(rawPhoneA?: string | null, rawPhoneB?: string | null): boolean {
  if (!rawPhoneA || !rawPhoneB) return false;
  const digitsA = rawPhoneA.replace(/[^0-9]/g, "");
  const digitsB = rawPhoneB.replace(/[^0-9]/g, "");

  if (digitsA.length < 7 || digitsB.length < 7) {
    return false;
  }

  return (
    digitsA === digitsB ||
    (digitsA.length >= 8 && digitsB.endsWith(digitsA)) ||
    (digitsB.length >= 8 && digitsA.endsWith(digitsB))
  );
}

export function findUserByIdentifier<T extends { email?: string | null; phone?: string | null }>(
  users: T[],
  identifier: string | null | undefined
): T | undefined {
  if (!identifier) return undefined;
  const cleanId = identifier.trim().toLowerCase();
  if (!cleanId) return undefined;

  return users.find((user) => {
    const emailMatches = Boolean(user.email && user.email.toLowerCase() === cleanId);
    const phoneMatches = matchesPhone(cleanId, user.phone);
    return emailMatches || phoneMatches;
  });
}

