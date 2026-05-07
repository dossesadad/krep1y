"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { GameMode, Player, Tier } from "@/types";
import { GAME_MODE_LABELS, GAME_MODE_ORDER, TIER_COLORS, TIER_ORDER } from "@/lib/constants";
import { PlayerCard } from "@/components/tier-list/player-card";
import { ChevronUp, Trophy } from "lucide-react";
import { comparePlayersForOverall, getTotalPoints, resolveDisplayTier } from "@/lib/ranking";

const TITLE_POINTS = [
  { title: "Grandmaster", points: "400+" },
  { title: "Master", points: "250+" },
  { title: "Combat Ace", points: "100+" },
  { title: "Specialist", points: "50+" },
  { title: "Cadet", points: "20+" },
  { title: "Novice", points: "10+" },
] as const;

export function TierBoard({ initialPlayers }: { initialPlayers: Player[] }) {
  const [mode, setMode] = useState<GameMode>("overall");
  const [showMaceInfo, setShowMaceInfo] = useState(false);
  const [infoTab, setInfoTab] = useState<"information" | "status">("information");
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const infoContainerRef = useRef<HTMLDivElement | null>(null);
  const players = initialPlayers;
  const playersWithDisplayTier = useMemo(() => {
    if (mode === "overall") {
      return players.map((p) => ({ ...p, tier: resolveDisplayTier(p, "overall") }));
    }
    return players
      .filter((p) => Boolean(p.modeTiers[mode]))
      .map((p) => ({ ...p, tier: p.modeTiers[mode]! }));
  }, [players, mode]);

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

  const visibleRankedPlayers = useMemo(() => {
    if (!selectedTier) return rankedPlayers;
    return rankedPlayers.filter((player) => player.tier === selectedTier);
  }, [rankedPlayers, selectedTier]);

  const toggleTierFilter = (tier: Tier) => {
    setSelectedTier((prev) => (prev === tier ? null : tier));
    setShowMaceInfo(false);
  };

  useEffect(() => {
    if (!showMaceInfo) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!infoContainerRef.current) return;
      if (!infoContainerRef.current.contains(event.target as Node)) {
        setShowMaceInfo(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMaceInfo]);

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="rounded-xl border border-[#3b1212] bg-[#080808] px-4 py-10 text-center">
        <h1 className="font-heading text-7xl font-bold leading-[0.9] text-zinc-100 md:text-8xl">
          GEORGIAN
          <br />
          <span className="bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent">Tier List</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
          best georgian tier list website
        </p>
        <div className="mt-5 flex items-center justify-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-900 to-red-700 px-5 py-2 text-sm font-semibold text-red-100 shadow-lg shadow-red-950/50">
            <Trophy size={14} />
            View Rankings
          </button>
          <span className="text-sm text-zinc-400">{players.length} Ranked Players</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#3b1212] bg-[#080808] p-2 md:grid-cols-9">
        {GAME_MODE_ORDER.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold ${
              mode === m
                ? "border-red-800 bg-[#221010] text-red-200"
                : "border-[#3b1212] bg-[#101010] text-zinc-400"
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
      </div>

      <div ref={infoContainerRef} className="relative mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setShowMaceInfo((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-800/70 bg-gradient-to-r from-red-900 to-red-700 px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-red-100 transition hover:from-red-800 hover:to-red-600"
        >
          Information
          <ChevronUp size={16} className={showMaceInfo ? "rotate-180" : "rotate-0"} />
        </button>

        {showMaceInfo ? (
          <div className="absolute top-[calc(100%+10px)] z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#3b1212] bg-[#0d0505] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-zinc-100">Information</h3>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-[#3b1212] bg-[#140707] p-1">
              <button
                type="button"
                onClick={() => setInfoTab("information")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  infoTab === "information"
                    ? "bg-[#2a1010] text-red-200"
                    : "text-zinc-400 hover:bg-[#1b0a0a] hover:text-zinc-200"
                }`}
              >
                Information
              </button>
              <button
                type="button"
                onClick={() => setInfoTab("status")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  infoTab === "status"
                    ? "bg-[#2a1010] text-red-200"
                    : "text-zinc-400 hover:bg-[#1b0a0a] hover:text-zinc-200"
                }`}
              >
                Status
              </button>
            </div>

            {infoTab === "information" ? (
              <div className="overflow-hidden rounded-lg border border-[#3b1212]">
                <div className="grid grid-cols-[1fr_auto] bg-[#180606] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  <p>Titles</p>
                  <p>Points</p>
                </div>
                <div className="divide-y divide-[#2a1010]">
                  {TITLE_POINTS.map((row) => (
                    <div
                      key={row.title}
                      className="grid grid-cols-[1fr_auto] items-center bg-[#0d0505] px-3 py-2.5 text-sm text-zinc-100"
                    >
                      <p className="font-semibold">{row.title}</p>
                      <p className="font-semibold text-zinc-300">{row.points}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-[#3b1212]">
                <div className="grid grid-cols-[auto_1fr_auto] bg-[#180606] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  <p className="pr-2">Color</p>
                  <p>Tier</p>
                  <p>Points</p>
                </div>
                <div className="divide-y divide-[#2a1010]">
                  {TIER_ORDER.map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => toggleTierFilter(tier)}
                      className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-100 transition ${
                        selectedTier === tier ? "bg-[#2a1010]" : "bg-[#0d0505] hover:bg-[#1b0a0a]"
                      }`}
                    >
                      <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${TIER_COLORS[tier]}`} />
                      <p className="font-semibold">{tier}</p>
                      <p className="font-semibold text-zinc-300">{pointsForTier(tier)}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-semibold text-zinc-100">
            Top Ranked Players {selectedTier ? `- ${selectedTier}` : ""}
          </h2>
          {selectedTier ? (
            <button
              type="button"
              onClick={() => setSelectedTier(null)}
              className="rounded-md border border-[#3b1212] bg-[#110707] px-3 py-1 text-xs font-semibold text-zinc-300 hover:bg-[#1b0a0a]"
            >
              Clear filter
            </button>
          ) : null}
        </div>
        <div className="grid gap-2 rounded-xl border border-[#3b1212] bg-[#080808] p-3">
          {visibleRankedPlayers.map((player, index) => (
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

function pointsForTier(tier: Tier): number {
  const points: Record<Tier, number> = {
    HT1: 60,
    LT1: 45,
    HT2: 30,
    LT2: 20,
    HT3: 10,
    LT3: 6,
    HT4: 4,
    LT4: 3,
    HT5: 2,
    LT5: 1,
  };
  return points[tier];
}
