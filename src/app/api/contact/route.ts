import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { checkRateLimit, getRateLimitResetTime, validateOrigin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!validateOrigin(req)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const key = `contact:${ip}`;
  if (!checkRateLimit(key, 5, 15 * 60 * 1000)) {
    const reset = getRateLimitResetTime(key);
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil(((reset ?? Date.now() + 900000) - Date.now()) / 1000))) } });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { name, phone, email, message } = body as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim() || name.length > 100 || typeof phone !== "string" || !phone.trim() || phone.length > 40 || (email !== undefined && (typeof email !== "string" || email.length > 254)) || typeof message !== "string" || !message.trim() || message.length > 3000) {
    return NextResponse.json({ error: "Please enter a name, phone number, and message (up to 3,000 characters)." }, { status: 400 });
  }
  if (!env.resendApiKey || !env.resendFrom || !env.contactEmail) return NextResponse.json({ error: "Contact delivery is not configured yet. Please call the salon." }, { status: 503 });
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${env.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.resendFrom, to: [env.contactEmail], reply_to: typeof email === "string" && email.trim() ? email.trim() : undefined, subject: `Website inquiry from ${name.trim()}`, text: `Name: ${name.trim()}\nPhone: ${phone.trim()}\nEmail: ${typeof email === "string" ? email.trim() : "Not provided"}\n\n${message.trim()}` }),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) return NextResponse.json({ error: "We could not send your message. Please try again or call the salon." }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "We could not send your message. Please try again or call the salon." }, { status: 502 });
  }
}
