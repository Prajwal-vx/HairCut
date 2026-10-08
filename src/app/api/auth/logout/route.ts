import { NextResponse } from "next/server";
import { validateOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set("salon_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    sameSite: "strict",
  });
  return response;
}
