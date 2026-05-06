import { NextResponse } from "next/server";
import { z } from "zod";
import { MODE_WITHOUT_OVERALL } from "@/lib/constants";
import { resolveDisplayTier } from "@/lib/ranking";
import { requireRole } from "@/lib/api-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { mapApiPlayerRow } from "@/lib/data/players";
import { GameMode, Player, Tier } from "@/types";

const tierValues = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"] as const;

const schema = z.object({
  username: z.string().min(2),
  region: z.string().optional(),
  description: z.string().min(3),
  modeTiers: z.record(z.string(), z.enum(tierValues)),
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, username, tier, region, description")
    .order("username", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(mapApiPlayerRow));
}

export async function POST(req: Request) {
  const user = await requireRole(["admin", "owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("players")
    .insert({
      username: parsed.data.username,
      region: parsed.data.region || null,
      description: parsed.data.description,
      tier: "LT5",
    })
    .select("id, username, region, description")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const modeRows = MODE_WITHOUT_OVERALL
    .map((mode) => {
      const tier = parsed.data.modeTiers[mode];
      if (!tier) return null;
      return { player_id: data.id, mode: mode as Exclude<GameMode, "overall">, tier };
    })
    .filter(Boolean) as { player_id: string; mode: Exclude<GameMode, "overall">; tier: string }[];

  if (modeRows.length > 0) {
    const { error: tiersError } = await admin.from("player_mode_tiers").upsert(modeRows, {
      onConflict: "player_id,mode",
    });
    if (tiersError) return NextResponse.json({ error: tiersError.message }, { status: 500 });
  }

  const created = mapApiPlayerRow(data);
  const modeTiers = parsed.data.modeTiers as Partial<Record<Exclude<GameMode, "overall">, Tier>>;
  const responsePlayer: Player = {
    ...created,
    modeTiers,
    tier: resolveDisplayTier({ ...created, modeTiers, tier: "LT5" }, "overall"),
  };
  return NextResponse.json(responsePlayer);
}

export async function DELETE(req: Request) {
  const user = await requireRole(["admin", "owner"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("id");
  if (!playerId) return NextResponse.json({ error: "missing_player_id" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("players").delete().eq("id", playerId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
