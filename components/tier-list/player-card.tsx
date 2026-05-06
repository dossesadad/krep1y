"use client";

import { Player } from "@/types";

export function PlayerCard({
  player,
  rank,
  showTier = true,
}: {
  player: Player;
  rank?: number;
  showTier?: boolean;
}) {
  return (
    <article
      className="grid grid-cols-[52px_40px_1fr_auto] items-center gap-2 rounded-md border border-[#273055] bg-[#111a38] px-2 py-1.5 transition hover:border-[#3f4f84]"
    >
      <div className="font-heading text-2xl font-bold leading-none text-zinc-200">{rank ? `${rank}.` : "#"}</div>
      <div className="grid h-8 w-8 place-items-center rounded bg-[#273055] text-[10px] text-zinc-300">SK</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-zinc-100">{player.username}</h3>
          {showTier ? (
            <span className="rounded bg-yellow-400/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">
              {player.tier}
            </span>
          ) : null}
        </div>
        <p className="truncate text-[11px] text-zinc-400">{player.description}</p>
      </div>
      {player.region ? (
        <span className="rounded bg-[#1f2b56] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-200">{player.region}</span>
      ) : null}
    </article>
  );
}
