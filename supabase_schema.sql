-- Run this SQL in your Supabase project's SQL Editor (Dashboard -> SQL Editor -> New Query)

-- 1. Profiles table with +1 auto-increment numeric ID (/Profile/1, /Profile/2, ...)
create table if not exists public.profiles (
  id bigint generated always as identity primary key,
  auth_uid uuid unique not null references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = auth_uid);

-- 2. Trigger to auto-create profile with +1 ID on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_username text;
begin
  raw_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    'User_' || left(new.id::text, 6)
  );
  insert into public.profiles (auth_uid, username, display_name)
  values (new.id, raw_username, raw_username)
  on conflict (auth_uid) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Helper RPC to resolve username -> email for login
create or replace function public.get_email_by_username(uname text)
returns text
language plpgsql
security definer set search_path = public, auth
as $$
declare
  found_email text;
begin
  select u.email into found_email
  from auth.users u
  join public.profiles p on p.auth_uid = u.id
  where lower(p.username) = lower(trim(uname))
  limit 1;
  return found_email;
end;
$$;

-- 4. Experiences table (shared across web, NoveloPlayer, and NoveloStudio)
create table if not exists public.experiences (
  id text primary key,
  owner_id bigint references public.profiles(id) on delete cascade,
  owner_uid uuid not null references auth.users(id) on delete cascade,
  owner_username text not null default 'Player',
  name text not null default 'Untitled Experience',
  promo text not null default '',
  description text not null default '',
  genre text not null default 'Genre',
  subgenre text not null default 'None',
  privacy text not null default 'Playtesters',
  thumbnail text not null default '',
  doc jsonb,
  archived boolean not null default false,
  updated_at bigint not null default (extract(epoch from now()) * 1000)::bigint,
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;

create policy "Public experiences are viewable by everyone, or own experiences"
  on public.experiences for select
  using ((privacy = 'Public' and archived = false) or auth.uid() = owner_uid);

create policy "Users can insert their own experiences"
  on public.experiences for insert
  with check (auth.uid() = owner_uid);

create policy "Users can update their own experiences"
  on public.experiences for update
  using (auth.uid() = owner_uid);

create policy "Users can delete their own experiences"
  on public.experiences for delete
  using (auth.uid() = owner_uid);
