import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { Role } from "@/types";

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  role: Role;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const admin = createSupabaseAdminClient();
  const { data: byIdProfile, error: byIdError } = await admin
    .from("profiles")
    .select("id, username, role, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!byIdError && byIdProfile) {
    return {
      id: user.id,
      email: user.email ?? "",
      username: (byIdProfile.username as string) ?? user.email?.split("@")[0] ?? "player",
      role: ((byIdProfile.role as Role) ?? "user"),
    };
  }

  if (user.email) {
    const { data: byEmailProfile } = await admin
      .from("profiles")
      .select("id, username, role, email")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byEmailProfile) {
      return {
        id: user.id,
        email: user.email,
        username: (byEmailProfile.username as string) ?? user.email.split("@")[0],
        role: ((byEmailProfile.role as Role) ?? "user"),
      };
    }
  }

  {
    const fallbackUsername =
      (user.user_metadata?.username as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      (user.email?.split("@")[0] ?? "player");

    return {
      id: user.id,
      email: user.email ?? "",
      username: fallbackUsername,
      role: "user",
    };
  }
}

export async function requireRole(allowed: Role[]): Promise<SessionUser | null> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;
  return allowed.includes(sessionUser.role) ? sessionUser : null;
}
