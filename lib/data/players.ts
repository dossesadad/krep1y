import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { MODE_WITHOUT_OVERALL } from "@/lib/constants";
import { resolveDisplayTier } from "@/lib/ranking";
import { GameMode, Player, Tier } from "@/types";

type PlayerRow = {
  id: string;
  username: string;
  region: string | null;
  description: string | null;
};

type PlayerTierRow = {
  player_id: string;
  mode: Exclude<GameMode, "overall">;
  tier: Tier;
};

function mapPlayerRow(row: PlayerRow, modeTiers: Partial<Record<Exclude<GameMode, "overall">, Tier>>): Player {
  const player: Player = {
    id: row.id,
    username: row.username,
    region: row.region ?? undefined,
    description: row.description ?? "",
    modeTiers,
    tier: "LT5",
  };
  player.tier = resolveDisplayTier(player, "overall");
  return player;
}

export function mapApiPlayerRow(row: PlayerRow): Player {
  return {
    id: row.id,
    username: row.username,
    region: row.region ?? undefined,
    description: row.description ?? "",
    modeTiers: {},
    tier: "LT5",
  };
}

function formatSupabaseError(err: { message: string; code?: string; details?: string | null; hint?: string | null }) {
  const parts = [err.message, err.code ? `(code ${err.code})` : "", err.details || "", err.hint || ""].filter(
    Boolean,
  );
  return parts.join(" ").trim();
}

export async function fetchPlayersOrdered(): Promise<Player[]> {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("players")
    .select("id, username, region, description")
    .order("username", { ascending: true });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }

  const players = (data as PlayerRow[] | null) ?? [];
  const playerIds = players.map((p) => p.id);

  const { data: tierRows, error: tiersError } = await supabase
    .from("player_mode_tiers")
    .select("player_id, mode, tier")
    .in("player_id", playerIds.length ? playerIds : ["00000000-0000-0000-0000-000000000000"]);

  if (
    tiersError &&
    !(
      tiersError.code === "PGRST205" &&
      (tiersError.message.toLowerCase().includes("player_mode_tiers") ||
        tiersError.message.toLowerCase().includes("schema cache"))
    )
  ) {
    throw new Error(formatSupabaseError(tiersError));
  }

  const tierMap = new Map<string, Partial<Record<Exclude<GameMode, "overall">, Tier>>>();
  for (const r of (tierRows as PlayerTierRow[] | null) ?? []) {
    if (!MODE_WITHOUT_OVERALL.includes(r.mode)) continue;
    const existing = tierMap.get(r.player_id) ?? {};
    existing[r.mode] = r.tier;
    tierMap.set(r.player_id, existing);
  }

  return players.map((row) => mapPlayerRow(row, tierMap.get(row.id) ?? {}));
}
