import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapApiPlayerRow } from "@/lib/data/players";
import { MODE_WITHOUT_OVERALL } from "@/lib/constants";
import { GameMode } from "@/types";

const tierValues = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"] as const;

const schema = z.object({
  playerId: z.string().uuid(),
  mode: z.string(),
  tier: z.enum(tierValues),
});

export async function PATCH(req: Request) {
  const user = await requireRole(["admin", "owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  if (!MODE_WITHOUT_OVERALL.includes(parsed.data.mode as Exclude<GameMode, "overall">)) {
    return NextResponse.json({ error: "invalid_mode" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error: upsertError } = await admin.from("player_mode_tiers").upsert(
    [{ player_id: parsed.data.playerId, mode: parsed.data.mode as Exclude<GameMode, "overall">, tier: parsed.data.tier }],
    { onConflict: "player_id,mode" },
  );
  if (upsertError) return NextResponse.json({ error: upsertError.message }, { status: 500 });

  const { data, error } = await admin.from("players").select("id, username, region, description").eq("id", parsed.data.playerId).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(mapApiPlayerRow(data));
}
