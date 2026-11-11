import { withDatabaseRoute, readDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getHandler() {
  try {
    readDatabase();
    return Response.json({ status: "ok" });
  } catch {
    return Response.json({ status: "unavailable" }, { status: 503 });
  }
}

export const GET = withDatabaseRoute(getHandler);
