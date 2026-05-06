-- Adds per-gamemode tiers for each player.

create table if not exists public.player_mode_tiers (
  player_id uuid not null references public.players (id) on delete cascade,
  mode text not null check (mode in ('vanilla', 'uhc', 'pot', 'nethop', 'smp', 'sword', 'axe', 'mace')),
  tier text not null check (
    tier in (
      'HT1', 'LT1', 'HT2', 'LT2', 'HT3', 'LT3',
      'HT4', 'LT4', 'HT5', 'LT5'
    )
  ),
  created_at timestamptz not null default now(),
  primary key (player_id, mode)
);

alter table public.player_mode_tiers enable row level security;

drop policy if exists "player_mode_tiers_select_public" on public.player_mode_tiers;
create policy "player_mode_tiers_select_public"
  on public.player_mode_tiers for select
  using (true);

drop policy if exists "player_mode_tiers_insert_privileged" on public.player_mode_tiers;
create policy "player_mode_tiers_insert_privileged"
  on public.player_mode_tiers for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );

drop policy if exists "player_mode_tiers_update_privileged" on public.player_mode_tiers;
create policy "player_mode_tiers_update_privileged"
  on public.player_mode_tiers for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );

drop policy if exists "player_mode_tiers_delete_privileged" on public.player_mode_tiers;
create policy "player_mode_tiers_delete_privileged"
  on public.player_mode_tiers for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'owner')
    )
  );
