import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { listProfilesAdminView } from "@/lib/data/profiles";

export async function GET() {
  const user = await requireRole(["owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const users = await listProfilesAdminView();
    return NextResponse.json(users);
  } catch (e) {
    const message = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
