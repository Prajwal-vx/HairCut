import { withDatabaseRoute, readDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

async function getHandler() {
  const db = readDatabase();
  return NextResponse.json({ services: db.services });
}
export const GET = withDatabaseRoute(getHandler);
