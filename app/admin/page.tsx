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

  const players = await fetchPlayersOrdered();
  const users = await listProfilesAdminView();

  return <AdminPanel initialPlayers={players} users={users} viewerRole={viewer.role} viewerId={viewer.id} />;
}
