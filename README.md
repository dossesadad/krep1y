# Crystal Tiers (Minecraft Crystal PvP)

Next.js + Supabase app: Crystal PvP tier list, bilingual UI shell, roles (`user` / `admin` / `owner`), and admin tools.

## Setup

1. `npm install`
2. Create **Supabase** project → **Settings → API**: copy **Project URL**, **anon/publishable** key, **service_role** secret.
3. Create `.env.local` (gitignored) — see `.env.example`:
   - **Project URL** — `NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co` *or* the same value as `SUPABASE_URL` (either works; copy from Dashboard → **Settings → API → Project URL**)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (paste the **publishable** key here)
   - `SUPABASE_SERVICE_ROLE_KEY` (paste the **secret** key here — **never** `NEXT_PUBLIC_*`)
4. In Supabase **SQL Editor**, run `supabase/migrations/20250506000000_init.sql`.
5. In **Authentication → URL configuration**, set **Site URL** to your app origin (e.g. `http://localhost:3000`) and add the same to **Redirect URLs** (include `http://localhost:3000/auth/callback`).
6. `npm run dev`

## First owner account

After your first user exists in **Authentication → Users**, promote them in SQL:

```sql
update public.profiles
set role = 'owner'
where id = '<paste-user-uuid-from-auth-users>';
```

## Security

- **Never** commit `.env.local` or put the service role key in client code or `NEXT_PUBLIC_*` variables.
- If a secret was pasted in chat or committed, **rotate** it in the Supabase dashboard.

## Tier order

Best → worst: `HT1, LT1, HT2, LT2, HT3, LT3, HT4, LT4, HT5, LT5`.

## Schema (implemented)

- `profiles` — `id` (auth user), `username`, `email`, `role`, RLS
- `players` — `username`, `tier`, `region`, `description`, public read, admin/owner write
