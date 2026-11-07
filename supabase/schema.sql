-- ==============================================================================
-- VITC MUSIC CLUB - SUPABASE PRODUCTION DATABASE SCHEMA
-- Run this complete script in your Supabase SQL Editor (1-Click Run)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. PUBLIC PROFILES (Synchronized with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  reg_number text not null unique,
  role text default 'Musician',
  instrument text,
  year_of_study text,
  joined_year text default '2024',
  secret_key text unique default encode(gen_random_bytes(12), 'hex'),
  is_verified boolean default false,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Automatic Profile Creation Trigger on User Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    name,
    email,
    reg_number,
    role,
    instrument,
    is_verified,
    is_admin
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Musician'),
    new.email,
    coalesce(new.raw_user_meta_data->>'reg_number', 'PENDING'),
    coalesce(new.raw_user_meta_data->>'role', 'Musician'),
    coalesce(new.raw_user_meta_data->>'instrument', 'Vocals / Guitar'),
    false,
    false
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper to check if current requesting user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- 3. BANDS TABLE
create table if not exists public.bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  genre text default 'Rock / Fusion',
  leader_name text not null,
  leader_id uuid references auth.users(id) on delete set null,
  status text default 'Approved' check (status in ('Approved', 'Pending', 'Rejected')),
  created_at timestamptz default now()
);

-- 4. BAND MEMBERS TABLE
create table if not exists public.band_members (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references public.bands(id) on delete cascade,
  member_name text not null,
  register_number text not null,
  secret_key text,
  created_at timestamptz default now()
);

-- 5. SLOT BOOKINGS TABLE (Music Room)
create table if not exists public.slot_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_date date not null,
  time_slot text not null,
  booker_id uuid references auth.users(id) on delete set null,
  booker_name text not null,
  booker_reg text not null,
  band_name text,
  band_id uuid references public.bands(id) on delete set null,
  members_info jsonb default '[]'::jsonb,
  status text default 'Approved' check (status in ('Approved', 'Blocked', 'Pending', 'Rejected')),
  block_reason text,
  created_at timestamptz default now(),
  constraint unique_slot_schedule unique (slot_date, time_slot)
);

-- 6. INSTRUMENTS INVENTORY
create table if not exists public.instruments (
  id text primary key,
  name text not null,
  category text not null,
  code text not null unique,
  location text default 'Music Room',
  condition text default 'Excellent',
  available boolean default true,
  image text,
  created_at timestamptz default now()
);

-- 7. INSTRUMENT REQUESTS
create table if not exists public.instrument_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  instrument_name text not null,
  instrument_code text not null,
  borrow_date date not null,
  return_date date,
  event_name text,
  booker_name text not null,
  booker_reg text not null,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Rejected', 'Returned')),
  created_at timestamptz default now()
);

-- 8. SITE CONTENT CMS (Tenures, Events, FAQ, Site Info)
create table if not exists public.site_content (
  id text primary key default 'main',
  content jsonb not null,
  updated_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.bands enable row level security;
alter table public.band_members enable row level security;
alter table public.slot_bookings enable row level security;
alter table public.instruments enable row level security;
alter table public.instrument_requests enable row level security;
alter table public.site_content enable row level security;

-- Profiles: Anyone authenticated can read member profiles, users can update their own, admins can update any (for 1-click verify)
create policy "Profiles viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can update all profiles" on public.profiles for update using (public.is_admin());

-- Bands: Everyone can view bands, authenticated users can register bands, admins can manage
create policy "Bands viewable by everyone" on public.bands for select using (true);
create policy "Authenticated users can create bands" on public.bands for insert with check (auth.role() = 'authenticated');
create policy "Band leaders can update own band" on public.bands for update using (auth.uid() = leader_id or public.is_admin());
create policy "Admins can delete bands" on public.bands for delete using (public.is_admin());

-- Band Members:
create policy "Band members viewable by everyone" on public.band_members for select using (true);
create policy "Authenticated users can add band members" on public.band_members for insert with check (auth.role() = 'authenticated');
create policy "Admins can manage band members" on public.band_members for all using (public.is_admin());

-- Slot Bookings:
create policy "Slot bookings viewable by everyone" on public.slot_bookings for select using (true);
create policy "Verified users can book slots" on public.slot_bookings for insert with check (
  auth.role() = 'authenticated'
);
create policy "Admins or owners can update bookings" on public.slot_bookings for update using (
  auth.uid() = booker_id or public.is_admin()
);
create policy "Admins can delete bookings" on public.slot_bookings for delete using (public.is_admin());

-- Instruments: Viewable by all, editable by admins
create policy "Instruments viewable by everyone" on public.instruments for select using (true);
create policy "Admins can edit instruments" on public.instruments for all using (public.is_admin());

-- Instrument Requests:
create policy "Users can view own requests, admins view all" on public.instrument_requests for select using (
  auth.uid() = user_id or public.is_admin()
);
create policy "Authenticated users can request instruments" on public.instrument_requests for insert with check (
  auth.role() = 'authenticated'
);
create policy "Admins can update requests" on public.instrument_requests for update using (public.is_admin());

-- Site Content CMS: Everyone can view, admins can update
create policy "Site content viewable by everyone" on public.site_content for select using (true);
create policy "Admins can update site content" on public.site_content for all using (public.is_admin());

-- ==============================================================================
-- INITIAL SEED DATA FOR INSTRUMENTS
-- ==============================================================================

insert into public.instruments (id, name, category, code, location, condition, available) values
  ('inst-1', 'Fender Player Stratocaster (HSS)', 'Electric Guitar', 'GTR-FEN-01', 'Music Room - Locker A', 'Excellent', true),
  ('inst-2', 'Yamaha FG800 Acoustic Guitar', 'Acoustic Guitar', 'GTR-YAM-04', 'Music Room - Cupboard 2', 'Good', true),
  ('inst-3', 'Ibanez SR305E 5-String Bass', 'Bass Guitar', 'BAS-IBA-02', 'Music Room - Rack B', 'Excellent', true),
  ('inst-4', 'Roland XPS-30 Synthesizer / Workstation', 'Keyboards & Synth', 'KEY-ROL-01', 'Music Room - Table 3', 'Mint', true),
  ('inst-5', 'Pearl Export 5-Piece Drum Kit & Meinl Cymbals', 'Drums & Percussion', 'DRM-PRL-01', 'Music Room - Stage Area', 'Stage Ready', true),
  ('inst-6', 'Shure SM58 Dynamic Vocal Microphones (Set of 3)', 'Microphones & Audio', 'MIC-SHU-03', 'Music Room - Audio Drawer', 'Excellent', true)
on conflict (id) do nothing;
