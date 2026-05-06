import { Player } from "@/types";

export const samplePlayers: Player[] = [
  {
    id: "1",
    username: "Zephyr",
    tier: "HT1",
    region: "EU",
    description: "Fast anchor placement and clutching.",
    modeTiers: { vanilla: "HT1", uhc: "LT1", pot: "HT2" },
  },
  {
    id: "2",
    username: "Nox",
    tier: "LT1",
    region: "NA",
    description: "High-pressure duels specialist.",
    modeTiers: { vanilla: "LT1", sword: "HT2", mace: "LT2" },
  },
  {
    id: "3",
    username: "Arxi",
    tier: "HT2",
    region: "AS",
    description: "Strong off-angle and crystal timing.",
    modeTiers: { uhc: "HT2", nethop: "LT2", smp: "HT3" },
  },
  {
    id: "4",
    username: "Kairo",
    tier: "LT2",
    region: "EU",
    description: "Consistent in tournament sets.",
    modeTiers: { vanilla: "LT2", axe: "HT3", pot: "LT3" },
  },
  {
    id: "5",
    username: "Vyn",
    tier: "HT3",
    region: "NA",
    description: "Improving decision-making pace.",
    modeTiers: { smp: "HT3", sword: "LT3", mace: "HT4" },
  },
];
