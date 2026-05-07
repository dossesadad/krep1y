"use client";

import { Player } from "@/types";
import Image from "next/image";
import { MODE_WITHOUT_OVERALL } from "@/lib/constants";
import { GAME_MODE_LABELS } from "@/lib/constants";
import { MinecraftAvatar } from "@/components/common/minecraft-avatar";

export function PlayerCard({
  player,
  rank,
  showTier = true,
  showModeBadges = false,
  totalPoints,
}: {
  player: Player;
  rank?: number;
  showTier?: boolean;
  showModeBadges?: boolean;
  totalPoints?: number;
}) {
  const modeBadges = MODE_WITHOUT_OVERALL.filter((mode) => Boolean(player.modeTiers[mode]));

  return (
    <article
      className="group grid grid-cols-[52px_40px_1fr_auto_auto] items-center gap-2 rounded-md border border-[#3b1212] bg-[#1a0b0b] px-2 py-1.5 transition hover:border-[#5a1d1d]"
    >
      <div className="font-heading text-2xl font-bold leading-none text-zinc-200">{rank ? `${rank}.` : "#"}</div>
      <div className="transition-transform duration-150 group-hover:scale-105">
        <MinecraftAvatar username={player.username} size={32} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-zinc-100">{player.username}</h3>
        </div>
        <p className="truncate text-[11px] text-zinc-400">{player.description}</p>
      </div>
      {showModeBadges ? (
        <div className="flex items-center gap-2.5 pr-1">
          {modeBadges.map((mode) => (
            <div key={mode} className="flex min-w-[44px] flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f2b56]">
                <Image
                  src={`/${GAME_MODE_LABELS[mode]}.png`}
                  alt={GAME_MODE_LABELS[mode]}
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="mt-1 text-[11px] font-semibold uppercase leading-none text-zinc-300">
                {player.modeTiers[mode]}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col items-end gap-1">
        {typeof totalPoints === "number" ? (
          <span className="rounded bg-[#29487c] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-200">
            {totalPoints} pts
          </span>
        ) : null}
        {player.region ? (
          <span className="rounded bg-[#1f2b56] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-200">
            {player.region}
          </span>
        ) : null}
      </div>
    </article>
  );
}
