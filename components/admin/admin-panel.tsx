"use client";

import { FormEvent, useState } from "react";
import { AuthUser, Player, Role, Tier } from "@/types";
import { TIER_ORDER } from "@/lib/constants";

export function AdminPanel({
  initialPlayers,
  users,
  viewerRole,
  viewerId,
}: {
  initialPlayers: Player[];
  users: AuthUser[];
  viewerRole: Role;
  viewerId: string;
}) {
  const [players, setPlayers] = useState(initialPlayers);
  const [members, setMembers] = useState(users);
  const [status, setStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });
  const [playerStatus, setPlayerStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });
  const [memberStatus, setMemberStatus] = useState<{ type: "idle" | "error" | "success"; message: string }>({
    type: "idle",
    message: "",
  });

  const submitPlayer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });
    const form = new FormData(e.currentTarget);
    const payload = {
      username: String(form.get("username")),
      description: String(form.get("description")),
      region: String(form.get("region") || ""),
      tier: String(form.get("tier")) as Tier,
    };
    const res = await fetch("/api/players", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const next = (await res.json()) as Player;
      setPlayers((p) => [...p, next]);
      e.currentTarget.reset();
      setStatus({ type: "success", message: "Player saved successfully." });
      return;
    }

    let message = "Saving failed.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore parsing error
    }
    setStatus({ type: "error", message });
  };

  const deletePlayer = async (player: Player) => {
    setPlayerStatus({ type: "idle", message: "" });
    const res = await fetch(`/api/players?id=${encodeURIComponent(player.id)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setPlayers((prev) => prev.filter((p) => p.id !== player.id));
      setPlayerStatus({ type: "success", message: `Deleted player ${player.username}.` });
      return;
    }

    let message = "Player delete failed.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore parsing error
    }
    setPlayerStatus({ type: "error", message });
  };

  const canDeleteMember = (member: AuthUser) => {
    if (member.id === viewerId) return false;
    if (viewerRole === "owner") return true;
    return member.role === "user";
  };

  const deleteMember = async (member: AuthUser) => {
    setMemberStatus({ type: "idle", message: "" });
    const res = await fetch(`/api/users?id=${encodeURIComponent(member.id)}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setMembers((prev) => prev.filter((u) => u.id !== member.id));
      setMemberStatus({ type: "success", message: `Deleted ${member.username}.` });
      return;
    }

    let message = "Delete failed.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore parsing error
    }
    setMemberStatus({ type: "error", message });
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
        {status.type !== "idle" ? (
          <p
            className={`mt-3 rounded px-3 py-2 text-sm ${
              status.type === "error"
                ? "border border-red-400/40 bg-red-500/10 text-red-200"
                : "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 lg:col-span-2">
        <h2 className="font-heading text-xl">Players</h2>
        <div className="mt-3 grid gap-2">
          {players.map((player) => (
            <article key={player.id} className="rounded border border-border bg-muted p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">
                  {player.username} <span className="text-xs text-zinc-400">({player.tier})</span>
                </p>
                <button
                  className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                  onClick={() => deletePlayer(player)}
                >
                  Delete player
                </button>
              </div>
              <p className="text-sm text-zinc-300">{player.description}</p>
            </article>
          ))}
        </div>
        {playerStatus.type !== "idle" ? (
          <p
            className={`mt-3 rounded px-3 py-2 text-sm ${
              playerStatus.type === "error"
                ? "border border-red-400/40 bg-red-500/10 text-red-200"
                : "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {playerStatus.message}
          </p>
        ) : null}
      </section>

      {viewerRole === "owner" || viewerRole === "admin" ? (
        <section className="rounded-2xl border border-border bg-card p-4 lg:col-span-3">
          <h2 className="font-heading text-xl">Users / Roles</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {members.map((user) => (
              <div key={user.id} className="rounded border border-border bg-muted p-3 text-sm">
                <p>{user.username}</p>
                <p className="text-zinc-400">{user.email}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="uppercase tracking-wider text-blue-300">{user.role}</p>
                  {canDeleteMember(user) ? (
                    <button
                      className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                      onClick={() => deleteMember(user)}
                    >
                      Delete member
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          {memberStatus.type !== "idle" ? (
            <p
              className={`mt-3 rounded px-3 py-2 text-sm ${
                memberStatus.type === "error"
                  ? "border border-red-400/40 bg-red-500/10 text-red-200"
                  : "border border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {memberStatus.message}
            </p>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
