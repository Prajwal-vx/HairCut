import { NextResponse } from "next/server";
import { getSafeUser } from "@/lib/auth";
import { getRequestIdentity } from "@/lib/request-auth";

export async function GET(req: Request) {
  try {
    const identity = await getRequestIdentity(req);
    if (!identity) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: getSafeUser(identity.user) });
  } catch {
    return NextResponse.json({ user: null });
  }
}