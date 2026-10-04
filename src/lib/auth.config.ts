import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { randomBytes } from "crypto";
import { readDatabase, writeDatabase } from "./db";
import { hashPassword } from "./auth";
import { LoyaltyTransaction, User } from "./types";

export function isAdminEmailWhitelisted(email: string | null | undefined): boolean {
  if (!email) return false;
  const whitelist = (process.env.ADMIN_EMAIL_WHITELIST || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return whitelist.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const googleProfile = profile as (typeof profile & {
        email?: string;
        email_verified?: boolean;
        given_name?: string;
        picture?: string;
      }) | undefined;
      if (account?.provider !== "google" || !googleProfile?.email || googleProfile.email_verified !== true) return false;

      const email = googleProfile.email.toLowerCase();
      const name = googleProfile.name || googleProfile.given_name || "User";
      const picture = googleProfile.picture || "";
      const isAdmin = isAdminEmailWhitelisted(email);
      const db = readDatabase();
      let dbUser = db.users.find((item) => item.email.toLowerCase() === email);

      if (!dbUser) {
        const userId = `user-${randomBytes(16).toString("hex")}`;
        const referralCode = `${name.split(" ")[0].toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`;
        dbUser = {
          id: userId,
          fullName: name,
          phone: "",
          email,
          passwordHash: hashPassword(randomBytes(32).toString("hex")),
          role: isAdmin ? "ADMIN" : "CLIENT",
          profilePhotoUrl: picture,
          loyaltyPoints: isAdmin ? 500 : 50,
          styleStreak: 1,
          lastVisitDate: null,
          referralCode,
          preferredChannel: "email",
          createdAt: new Date().toISOString(),
        } satisfies User;
        const transaction: LoyaltyTransaction = {
          id: `lt-${randomBytes(16).toString("hex")}`,
          userId,
          pointsEarned: isAdmin ? 500 : 50,
          pointsRedeemed: 0,
          reason: isAdmin ? "Admin account created via Google OAuth" : "Welcome bonus - Google OAuth registration",
          createdAt: new Date().toISOString(),
        };
        db.users.push(dbUser);
        db.loyaltyTransactions.push(transaction);
        writeDatabase(db);
      } else {
        dbUser.profilePhotoUrl = picture;
        dbUser.fullName = name;
        if (isAdmin && dbUser.role !== "OWNER") dbUser.role = "ADMIN";
        writeDatabase(db);
      }

      user.id = dbUser.id;
      user.role = dbUser.role;
      user.isAdmin = isAdmin;
      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email || token.email;
      if (email) {
        const dbUser = readDatabase().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
        if (dbUser) {
          const isAdmin = isAdminEmailWhitelisted(dbUser.email);
          token.userId = dbUser.id;
          token.role = isAdmin ? dbUser.role : "CLIENT";
          token.isAdmin = isAdmin;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.picture = token.picture as string | undefined;
        session.user.isAdmin = token.isAdmin;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/auth" },
  secret: process.env.NEXTAUTH_SECRET,
};
