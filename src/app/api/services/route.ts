import { NextResponse } from "next/server";
import { readDatabase } from "@/lib/db";

export async function GET() {
  const db = readDatabase();
  return NextResponse.json({ services: db.services });
}