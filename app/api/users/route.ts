import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-auth";
import { listProfilesAdminView } from "@/lib/data/profiles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireRole(["admin", "owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const users = await listProfilesAdminView();
    return NextResponse.json(users);
  } catch (e) {
    const message = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const actor = await requireRole(["admin", "owner"]);
  if (!actor) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "missing_user_id" }, { status: 400 });
  if (userId === actor.id) return NextResponse.json({ error: "cannot_delete_self" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data: target, error: targetError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (targetError) return NextResponse.json({ error: targetError.message }, { status: 500 });
  if (!target) return NextResponse.json({ error: "user_not_found" }, { status: 404 });

  const targetRole = String(target.role);
  if (actor.role === "admin" && targetRole !== "user") {
    return NextResponse.json({ error: "admins_can_only_delete_users" }, { status: 403 });
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
