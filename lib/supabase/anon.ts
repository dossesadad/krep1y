import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Anonymous Supabase client (no cookies). Use for public reads like the tier list
 * where no signed-in user is required — avoids session/cookie edge cases in RSC.
 */
export function createSupabaseAnonClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
