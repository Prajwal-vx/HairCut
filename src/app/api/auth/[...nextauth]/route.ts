import { withDatabaseRoute } from "@/lib/db";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth.config";

const handler = NextAuth(authOptions);

export const GET = withDatabaseRoute(handler);
export const POST = withDatabaseRoute(handler);
