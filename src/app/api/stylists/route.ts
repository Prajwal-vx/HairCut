import { withDatabaseRoute, readDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

async function getHandler() {
  const db = readDatabase();
  return NextResponse.json({ stylists: db.stylists });
}
export const GET = withDatabaseRoute(getHandler);
