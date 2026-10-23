create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  region text not null default 'US',
  onboarding_completed boolean not null default false,
  preferences jsonb not null default '{"genres":[],"countries":[],"actors":[],"directors":[],"content_ratings":["G","PG","PG-13","R"]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.movies (
  tmdb_id integer primary key,
  title text not null,
  overview text,
  poster_path text,
  release_date date,
  vote_average numeric(3,1),
  genres jsonb not null default '[]'::jsonb,
  providers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id integer not null references public.movies(tmdb_id) on delete cascade,
  action text not null check (action in ('loved','hated','unknown','watchlist')),
  created_at timestamptz not null default now(),
  unique(user_id, movie_id)
);

create table if not exists public.watchlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id integer not null references public.movies(tmdb_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, movie_id)
);

alter table public.profiles enable row level security;
alter table public.movies enable row level security;
alter table public.user_interactions enable row level security;
alter table public.watchlist enable row level security;

create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can create their own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Movies are readable by signed-in users" on public.movies for select to authenticated using (true);
create policy "Users can manage their interactions" on public.user_interactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their watchlist" on public.watchlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
