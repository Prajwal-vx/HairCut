import { NextResponse } from "next/server";
import { validateOrigin } from "@/lib/auth";
import { env } from "@/config/env";

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set("salon_token", "", {
    httpOnly: true,
    secure: env.isProduction,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}
