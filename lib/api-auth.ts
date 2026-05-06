import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
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

  return {
    id: user.id,
    email: user.email ?? "",
    username: profile.username as string,
    role: profile.role as Role,
  };
}

export async function requireRole(allowed: Role[]): Promise<SessionUser | null> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;
  return allowed.includes(sessionUser.role) ? sessionUser : null;
}
