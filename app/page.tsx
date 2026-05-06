import { TierBoard } from "@/components/tier-list/tier-board";
import { fetchPlayersOrdered } from "@/lib/data/players";

export const dynamic = "force-dynamic";

function hintForError(message: string): string | null {
  const m = message.toLowerCase();
  if (
    m.includes("pgrst205") ||
    m.includes("schema cache") ||
    (m.includes("could not find the table") && (m.includes("players") || m.includes("player_mode_tiers")))
  ) {
    return "A required table is missing in Supabase. Run both SQL files in Supabase SQL Editor: `supabase/migrations/20250506000000_init.sql` and `supabase/migrations/20250506210000_player_mode_tiers.sql`, then refresh.";
  }
  if (m.includes("relation") && m.includes("does not exist")) {
    return "The `players` table is missing. Open Supabase → SQL Editor and run `supabase/migrations/20250506000000_init.sql`.";
  }
  if (m.includes("jwt") || m.includes("invalid api key") || m.includes("api key")) {
    return "Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` — use the **anon** / **publishable** key from Settings → API.";
  }
  if (m.includes("permission denied") || m.includes("rls") || m.includes("policy")) {
    return "Row Level Security blocked this query. Re-run the migration SQL so the `players` select policy exists.";
  }
  return null;
}

export default async function Home() {
  let players: Awaited<ReturnType<typeof fetchPlayersOrdered>> = [];
  let errorMessage: string | null = null;
  let hint: string | null = null;

  try {
    players = await fetchPlayersOrdered();
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : "Could not load players.";
    hint = errorMessage ? hintForError(errorMessage) : null;
  }

  return (
    <main className="px-4 py-4">
      {errorMessage ? (
        <div className="mx-auto mb-4 max-w-3xl space-y-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium text-amber-50">{errorMessage}</p>
          {hint ? <p className="text-amber-200/90">{hint}</p> : null}
          <p className="text-xs text-amber-200/70">
            Also confirm <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code> in{" "}
            <code className="rounded bg-black/30 px-1">.env.local</code> matches your project (then restart{" "}
            <code className="rounded bg-black/30 px-1">npm run dev</code>).
          </p>
        </div>
      ) : null}
      <TierBoard initialPlayers={players} />
    </main>
  );
}
