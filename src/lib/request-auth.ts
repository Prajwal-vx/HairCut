import { getServerSession } from "next-auth";
import { authOptions, isAdminEmailWhitelisted } from "./auth.config";
import { getUserFromToken } from "./auth";
import { readDatabase } from "./db";
import { User } from "./types";

export interface RequestIdentity {
  user: User;
  provider: "password" | "google";
}

export async function getRequestIdentity(req: Request): Promise<RequestIdentity | null> {
  const cookie = req.headers.get("cookie")?.match(/(?:^|;\s*)salon_token=([^;]+)/)?.[1];
  // Browser sessions are cookie-only. Never accept a bearer token supplied by client JS.
  const tokenUser = getUserFromToken(cookie ? decodeURIComponent(cookie) : null);
  if (tokenUser) return { user: tokenUser, provider: "password" };

  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) return null;

  const user = readDatabase().users.find((item) => item.id === sessionUserId);
  if (!user) return null;
  return { user, provider: "google" };
}

export function canManageSalon(identity: RequestIdentity | null): boolean {
  if (!identity || (identity.user.role !== "ADMIN" && identity.user.role !== "OWNER")) return false;
  return identity.provider !== "google" || isAdminEmailWhitelisted(identity.user.email);
}
