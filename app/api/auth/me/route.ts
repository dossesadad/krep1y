import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api-auth";

export async function GET() {
  const user = await getSessionUser();
  const res = NextResponse.json({ user });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return res;
}
