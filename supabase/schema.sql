-- Milford AI Exchange MVP schema
-- Run in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

create type app_role as enum ('user','team_admin','global_admin');
create type prompt_status as enum ('draft','pending_review','approved','archived');
create type risk_level as enum ('low','medium','high');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role app_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.team_members (
  team_id uuid references public.teams(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  is_admin boolean not null default false,
  primary key (team_id, profile_id)
);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique
);

create table public.prompts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  body text not null,
  expected_output text,
  model text not null default 'Claude',
  risk risk_level not null default 'medium',
  status prompt_status not null default 'pending_review',
  version text not null default '1.0',
  owner_name text,
  team_id uuid references public.teams(id),
  category_id uuid references public.categories(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

create table public.prompt_tags (
  prompt_id uuid references public.prompts(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (prompt_id, tag_id)
);

create table public.prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references public.prompts(id) on delete cascade,
  version text not null,
  body text not null,
  change_note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references public.prompts(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  body text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.ratings (
  prompt_id uuid references public.prompts(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (prompt_id, profile_id)
);

create table public.favourites (
  prompt_id uuid references public.prompts(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (prompt_id, profile_id)
);

create table public.collections (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  team_id uuid references public.teams(id),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.collection_prompts (
  collection_id uuid references public.collections(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete cascade,
  sort_order int not null default 1,
  primary key (collection_id, prompt_id)
);

create table public.prompt_usage_events (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references public.prompts(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  event_type text not null check (event_type in ('view','copy','favourite','rate')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.categories enable row level security;
alter table public.prompts enable row level security;
alter table public.tags enable row level security;
alter table public.prompt_tags enable row level security;
alter table public.prompt_versions enable row level security;
alter table public.comments enable row level security;
alter table public.ratings enable row level security;
alter table public.favourites enable row level security;
alter table public.collections enable row level security;
alter table public.collection_prompts enable row level security;
alter table public.prompt_usage_events enable row level security;

-- MVP policies: authenticated users can read approved knowledge; authors/admins can submit.
create policy "read approved prompts" on public.prompts for select using (status = 'approved' or auth.uid() = created_by);
create policy "insert own prompts" on public.prompts for insert with check (auth.uid() = created_by);
create policy "update own draft prompts" on public.prompts for update using (auth.uid() = created_by and status in ('draft','pending_review'));

create policy "read public lookup tables" on public.teams for select using (true);
create policy "read categories" on public.categories for select using (true);
create policy "read tags" on public.tags for select using (true);
create policy "read prompt tags" on public.prompt_tags for select using (true);
create policy "read versions" on public.prompt_versions for select using (true);
create policy "read collections" on public.collections for select using (true);
create policy "read collection prompts" on public.collection_prompts for select using (true);

create policy "comments read" on public.comments for select using (true);
create policy "comments insert own" on public.comments for insert with check (auth.uid() = profile_id);
create policy "ratings read" on public.ratings for select using (true);
create policy "ratings upsert own" on public.ratings for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "favourites own" on public.favourites for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "usage insert own" on public.prompt_usage_events for insert with check (auth.uid() = profile_id);
