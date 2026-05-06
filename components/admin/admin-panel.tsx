"use client";

import { FormEvent, useState } from "react";
import { AuthUser, Player, Role, Tier } from "@/types";
import { TIER_ORDER } from "@/lib/constants";

export function AdminPanel({
  initialPlayers,
  users,
  viewerRole,
}: {
  initialPlayers: Player[];
  users: AuthUser[];
  viewerRole: Role;
}) {
  const [players, setPlayers] = useState(initialPlayers);

  const submitPlayer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      username: String(form.get("username")),
      description: String(form.get("description")),
      region: String(form.get("region") || ""),
      tier: String(form.get("tier")) as Tier,
    };
    const res = await fetch("/api/players", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const next = (await res.json()) as Player;
      setPlayers((p) => [...p, next]);
      e.currentTarget.reset();
    }
  };

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="font-heading text-xl">Add Player</h2>
        <form onSubmit={submitPlayer} className="mt-4 grid gap-2">
          <input required name="username" className="rounded border border-border bg-muted p-2" placeholder="Username" />
          <input name="region" className="rounded border border-border bg-muted p-2" placeholder="Region (optional)" />
          <input required name="description" className="rounded border border-border bg-muted p-2" placeholder="Description" />
          <select name="tier" className="rounded border border-border bg-muted p-2" defaultValue="LT4">
            {TIER_ORDER.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
          <button className="rounded bg-blue-600 p-2 font-semibold text-white">Save Player</button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 lg:col-span-2">
        <h2 className="font-heading text-xl">Players</h2>
        <div className="mt-3 grid gap-2">
          {players.map((player) => (
            <article key={player.id} className="rounded border border-border bg-muted p-3">
              <p className="font-semibold">
                {player.username} <span className="text-xs text-zinc-400">({player.tier})</span>
              </p>
              <p className="text-sm text-zinc-300">{player.description}</p>
            </article>
          ))}
        </div>
      </section>

      {viewerRole === "owner" ? (
        <section className="rounded-2xl border border-border bg-card p-4 lg:col-span-3">
          <h2 className="font-heading text-xl">Users / Roles</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {users.map((user) => (
              <div key={user.id} className="rounded border border-border bg-muted p-3 text-sm">
                <p>{user.username}</p>
                <p className="text-zinc-400">{user.email}</p>
                <p className="uppercase tracking-wider text-blue-300">{user.role}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
