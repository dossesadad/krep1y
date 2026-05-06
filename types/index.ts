export type Role = "user" | "admin" | "owner";
export type Tier = "HT1" | "LT1" | "HT2" | "LT2" | "HT3" | "LT3" | "HT4" | "LT4" | "HT5" | "LT5";

export interface Player {
  id: string;
  username: string;
  tier: Tier;
  region?: string;
  description: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  username: string;
}
