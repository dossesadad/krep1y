"use client";

import { useMemo } from "react";
import { Player, Tier } from "@/types";
import { TIER_COLORS, TIER_ORDER } from "@/lib/constants";
import { PlayerCard } from "@/components/tier-list/player-card";
import { Trophy } from "lucide-react";

export function TierBoard({ initialPlayers }: { initialPlayers: Player[] }) {
  const players = initialPlayers;

  const grouped = useMemo(() => {
    return TIER_ORDER.reduce<Record<Tier, Player[]>>(
      (acc, tier) => {
        acc[tier] = players.filter((p) => p.tier === tier);
        return acc;
      },
      {} as Record<Tier, Player[]>,
    );
  }, [players]);

  const rankedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      const byTier = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier);
      if (byTier !== 0) return byTier;
      return a.username.localeCompare(b.username);
    });
  }, [players]);

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="rounded-xl border border-[#20294b] bg-[#0b122a] px-4 py-10 text-center">
        <h1 className="font-heading text-7xl font-bold leading-[0.9] text-zinc-100 md:text-8xl">
          GEORGIAN
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Tier List</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
          best georgian tier list website
        </p>
        <div className="mt-5 flex items-center justify-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-900/50">
            <Trophy size={14} />
            View Rankings
          </button>
          <span className="text-sm text-zinc-400">{players.length} Ranked Players</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {TIER_ORDER.map((tier) => (
          <TierStatCard key={tier} tier={tier} count={grouped[tier]?.length ?? 0} />
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-semibold text-zinc-100">Top Ranked Players</h2>
        </div>
        <div className="grid gap-2 rounded-xl border border-[#20294b] bg-[#0b122a] p-3">
          {rankedPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} rank={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TierStatCard({ tier, count }: { tier: Tier; count: number }) {
  return (
    <article className="rounded-xl border border-[#2a3155] bg-[#111935] px-4 py-5 text-center transition">
      <div className={`mx-auto mb-2 h-1.5 w-10 rounded-full bg-gradient-to-r ${TIER_COLORS[tier]}`} />
      <p className="font-heading text-4xl font-bold text-zinc-100">{tier}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-300">{count}</p>
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">players</p>
    </article>
  );
}
