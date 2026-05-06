/**
 * Supabase configuration (never hardcode secrets in source).
 *
 * `.env.local` (gitignored):
 * - Set **either** `NEXT_PUBLIC_SUPABASE_URL` **or** `SUPABASE_URL` to your Project URL
 *   (Dashboard → Project Settings → API → **Project URL**, e.g. https://xxxxx.supabase.co).
 * - `next.config.ts` copies `SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL` for the browser when needed.
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon / publishable key
 * - `SUPABASE_SERVICE_ROLE_KEY` — secret key (server-only; never `NEXT_PUBLIC_*`)
 */

function firstNonEmpty(...values: (string | undefined)[]): string {
  for (const v of values) {
    const t = v?.trim();
    if (t) return t;
  }
  return "";
}

export function getSupabaseUrl(): string {
  const url = firstNonEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL);
  if (!url) {
    throw new Error(
      "Supabase Project URL is missing. In `.env.local` add:\n" +
        "  NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co\n" +
        "or the same value as:\n" +
        "  SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co\n" +
        "Copy **Project URL** from Supabase → Project Settings → API.",
    );
  }
  return url;
}

/** Public (browser) key: anon or publishable — both work with createClient. */
export function getSupabaseAnonKey(): string {
  const key = firstNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local.",
    );
  }
  return key;
}

/** Server-only privileged key — never import this module from client components. */
export function getSupabaseServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing (server-only). Add it to .env.local.");
  }
  return key;
}
