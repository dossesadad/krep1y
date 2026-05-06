import { GameMode, Tier } from "@/types";

export const TIER_ORDER: Tier[] = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];

export const TIER_COLORS: Record<Tier, string> = {
  HT1: "from-rose-500 to-red-700",
  LT1: "from-red-500 to-orange-600",
  HT2: "from-orange-500 to-amber-600",
  LT2: "from-amber-500 to-yellow-600",
  HT3: "from-yellow-500 to-lime-600",
  LT3: "from-lime-500 to-emerald-600",
  HT4: "from-emerald-500 to-cyan-600",
  LT4: "from-cyan-500 to-sky-600",
  HT5: "from-sky-500 to-indigo-600",
  LT5: "from-indigo-500 to-violet-700",
};

export const GAME_MODE_ORDER: GameMode[] = [
  "overall",
  "vanilla",
  "uhc",
  "pot",
  "nethop",
  "smp",
  "sword",
  "axe",
  "mace",
];

export const MODE_WITHOUT_OVERALL = GAME_MODE_ORDER.filter((m) => m !== "overall") as Exclude<GameMode, "overall">[];

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  overall: "Overall",
  vanilla: "Vanilla",
  uhc: "UHC",
  pot: "Pot",
  nethop: "NethOP",
  smp: "SMP",
  sword: "Sword",
  axe: "Axe",
  mace: "Mace",
};
