import { createHash, timingSafeEqual } from "crypto";
import type { SalonDatabase } from "./types";

export function isValidRequestOrigin(
  origin: string | null,
  host: string | null,
  environment: string | undefined,
): boolean {
  if (environment !== "production") return true;
  if (!origin || !host) return false;
  return origin === `https://${host}`;
}

export function matchesLegacyPassword(password: string, hash: string): boolean {
  if (!/^[a-f\d]{64}$/i.test(hash)) return false;

  const passwordHash = createHash("sha256").update(password).digest();
  return timingSafeEqual(passwordHash, Buffer.from(hash, "hex"));
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

