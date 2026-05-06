"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { GameMode, Player, Tier } from "@/types";
import { GAME_MODE_LABELS, GAME_MODE_ORDER, TIER_COLORS, TIER_ORDER } from "@/lib/constants";
import { PlayerCard } from "@/components/tier-list/player-card";
import { Trophy } from "lucide-react";
import { comparePlayersForOverall, getTotalPoints, resolveDisplayTier } from "@/lib/ranking";

export function TierBoard({ initialPlayers }: { initialPlayers: Player[] }) {
  const [mode, setMode] = useState<GameMode>("overall");
  const players = initialPlayers;
  const playersWithDisplayTier = useMemo(
    () => players.map((p) => ({ ...p, tier: resolveDisplayTier(p, mode) })),
    [players, mode],
  );

  const grouped = useMemo(() => {
    return TIER_ORDER.reduce<Record<Tier, Player[]>>(
      (acc, tier) => {
        acc[tier] = playersWithDisplayTier.filter((p) => p.tier === tier);
        return acc;
      },
      {} as Record<Tier, Player[]>,
    );
  }, [playersWithDisplayTier]);

  const rankedPlayers = useMemo(() => {
    if (mode === "overall") {
      return [...playersWithDisplayTier].sort(comparePlayersForOverall);
    }
    return [...playersWithDisplayTier].sort((a, b) => {
      const byTier = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier);
      if (byTier !== 0) return byTier;
      return a.username.localeCompare(b.username);
    });
  }, [playersWithDisplayTier, mode]);

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

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#20294b] bg-[#0b122a] p-2 md:grid-cols-10">
        {GAME_MODE_ORDER.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold ${
              mode === m
                ? "border-zinc-100 bg-[#162349] text-zinc-100"
                : "border-[#2a3155] bg-[#111935] text-zinc-400"
            }`}
          >
            <Image
              src={`/${GAME_MODE_LABELS[m]}.png`}
              alt={GAME_MODE_LABELS[m]}
              width={20}
              height={20}
              className="mx-auto mb-1 h-5 w-5 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {GAME_MODE_LABELS[m]}
          </button>
        ))}
        <div className="rounded-lg border border-[#2a3155] bg-[#111935] px-2 py-2 text-[10px] leading-4 text-zinc-300">
          <p className="mb-1 text-xs font-semibold text-zinc-100">Status</p>
          <p>HT1 60 | LT1 45 | HT2 30 | LT2 20 | HT3 10</p>
          <p>LT3 6 | HT4 4 | LT4 3 | HT5 2 | LT5 1</p>
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
            <PlayerCard
              key={player.id}
              player={player}
              rank={index + 1}
              showModeBadges={mode === "overall"}
              totalPoints={mode === "overall" ? getTotalPoints(player) : undefined}
            />
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
