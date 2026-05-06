import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapPlayerRow } from "@/lib/data/players";

const tierValues = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"] as const;

const schema = z.object({
  playerId: z.string().uuid(),
  tier: z.enum(tierValues),
});

export async function PATCH(req: Request) {
  const user = await requireRole(["admin", "owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .update({ tier: parsed.data.tier })
    .eq("id", parsed.data.playerId)
    .select("id, username, tier, region, description")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(mapPlayerRow(data));
}
