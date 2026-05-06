import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AuthUser, Role } from "@/types";

type ProfileRow = {
  id: string;
  username: string;
  email: string | null;
  role: string;
};

export async function listProfilesAdminView(): Promise<AuthUser[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, username, email, role")
    .order("username", { ascending: true });

  if (error) throw error;
  return (
    (data as ProfileRow[] | null)?.map((row) => ({
      id: row.id,
      username: row.username,
      email: row.email ?? "",
      role: row.role as Role,
    })) ?? []
  );
}
