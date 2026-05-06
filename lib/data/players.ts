import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { Player, Tier } from "@/types";

type PlayerRow = {
  id: string;
  username: string;
  tier: string;
  region: string | null;
  description: string | null;
};

export function mapPlayerRow(row: PlayerRow): Player {
  return {
    id: row.id,
    username: row.username,
    tier: row.tier as Tier,
    region: row.region ?? undefined,
    description: row.description ?? "",
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
    .select("id, username, tier, region, description")
    .order("username", { ascending: true });

  if (error) {
    throw new Error(formatSupabaseError(error));
  }
  return (data as PlayerRow[] | null)?.map(mapPlayerRow) ?? [];
}
