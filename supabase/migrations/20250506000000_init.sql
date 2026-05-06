-- Crystal Tiers — run in Supabase SQL Editor (or via CLI).
-- Creates profiles, players, RLS, and auth → profile trigger.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  email text,
  role text not null default 'user' check (role in ('user', 'admin', 'owner')),
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  tier text not null check (
    tier in (
      'HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3',
      'HT4', 'LT4', 'HT5', 'LT5'
    )
  ),
  region text,
  description text default '',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, 'player'), '@', 1)
    ),
    new.email,
    'user'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.players enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_select_admin_or_owner" on public.profiles;
create policy "profiles_select_admin_or_owner"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p2.role from public.profiles p2 where p2.id = auth.uid())
  );

drop policy if exists "profiles_update_owner" on public.profiles;
create policy "profiles_update_owner"
  on public.profiles for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'owner')
  );

drop policy if exists "players_select_public" on public.players;
create policy "players_select_public"
  on public.players for select
  using (true);

drop policy if exists "players_insert_privileged" on public.players;
create policy "players_insert_privileged"
  on public.players for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );

drop policy if exists "players_update_privileged" on public.players;
create policy "players_update_privileged"
  on public.players for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );

drop policy if exists "players_delete_privileged" on public.players;
create policy "players_delete_privileged"
  on public.players for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );

-- Optional seed (delete this block if you prefer an empty table)
insert into public.players (username, tier, region, description)
values
  ('Zephyr', 'HT1', 'EU', 'Fast anchor placement and clutching.'),
  ('Nox', 'LT1', 'NA', 'High-pressure duels specialist.'),
  ('Arxi', 'HT2', 'AS', 'Strong off-angle and crystal timing.'),
  ('Kairo', 'LT2', 'EU', 'Consistent in tournament sets.'),
  ('Vyn', 'HT3', 'NA', 'Improving decision-making pace.');
