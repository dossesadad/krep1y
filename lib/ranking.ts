import { MODE_WITHOUT_OVERALL, TIER_ORDER } from "@/lib/constants";
import { GameMode, Player, Tier } from "@/types";

export const TIER_POINTS: Record<Tier, number> = {
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

function tierVectorForPlayer(player: Player): number[] {
  const counts = new Array(TIER_ORDER.length).fill(0);
  for (const mode of MODE_WITHOUT_OVERALL) {
    const tier = player.modeTiers[mode];
    if (!tier) continue;
    const idx = TIER_ORDER.indexOf(tier);
    if (idx >= 0) counts[idx] += 1;
  }
  return counts;
}

export function getTotalPoints(player: Player): number {
  let points = 0;
  for (const mode of MODE_WITHOUT_OVERALL) {
    const tier = player.modeTiers[mode];
    if (!tier) continue;
    points += TIER_POINTS[tier];
  }
  return points;
}

export function comparePlayersForOverall(a: Player, b: Player) {
  const pointsDiff = getTotalPoints(b) - getTotalPoints(a);
  if (pointsDiff !== 0) return pointsDiff;

  const av = tierVectorForPlayer(a);
  const bv = tierVectorForPlayer(b);
  for (let i = 0; i < TIER_ORDER.length; i += 1) {
    if (av[i] !== bv[i]) return bv[i] - av[i];
  }
  return a.username.localeCompare(b.username);
}

export function computeOverallTier(player: Player): Tier {
  const counts = tierVectorForPlayer(player);
  let bestIdx = TIER_ORDER.length - 1;
  let bestCount = -1;
  for (let i = 0; i < counts.length; i += 1) {
    if (counts[i] > bestCount) {
      bestCount = counts[i];
      bestIdx = i;
    }
  }
  return TIER_ORDER[bestIdx];
}

export function resolveDisplayTier(player: Player, mode: GameMode): Tier {
  if (mode === "overall") return computeOverallTier(player);
  return player.modeTiers[mode] ?? "LT5";
}
