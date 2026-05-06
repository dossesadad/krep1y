import { requireRole } from "@/lib/api-auth";
import { fetchPlayersOrdered } from "@/lib/data/players";
import { listProfilesAdminView } from "@/lib/data/profiles";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const viewer = await requireRole(["admin", "owner"]);
  if (!viewer) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="rounded border border-red-500/40 bg-red-500/10 p-4 text-red-200">
          You are not authorized to access admin routes.
        </p>
      </main>
    );
  }

  let players = [] as Awaited<ReturnType<typeof fetchPlayersOrdered>>;
  let users = [] as Awaited<ReturnType<typeof listProfilesAdminView>>;
  let loadError: string | null = null;

  try {
    players = await fetchPlayersOrdered();
    users = await listProfilesAdminView();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load admin data.";
  }

  if (loadError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="rounded border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
          {loadError}
          <br />
          Run both migrations in Supabase SQL Editor:
          <br />
          <code>supabase/migrations/20250506000000_init.sql</code>
          <br />
          <code>supabase/migrations/20250506210000_player_mode_tiers.sql</code>
        </p>
      </main>
    );
  }

  return <AdminPanel initialPlayers={players} users={users} viewerRole={viewer.role} viewerId={viewer.id} />;
}
