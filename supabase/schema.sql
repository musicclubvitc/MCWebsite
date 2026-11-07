-- ==============================================================================
-- VITC MUSIC CLUB - SUPABASE PRODUCTION DATABASE SCHEMA & SEED DATA
-- Run this complete script in your Supabase SQL Editor (1-Click Run)
-- ==============================================================================

-- Clean reset of existing public club tables to ensure clean types & constraints
drop table if exists public.band_members cascade;
drop table if exists public.bands cascade;
drop table if exists public.slot_bookings cascade;
drop table if exists public.instrument_requests cascade;
drop table if exists public.instruments cascade;
drop table if exists public.site_content cascade;
drop table if exists public.profiles cascade;

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. PUBLIC PROFILES
create table public.profiles (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  reg_number text not null unique,
  role text default 'Member',
  instrument text,
  year_of_study text,
  joined_year text default '2026',
  secret_key text unique default encode(gen_random_bytes(12), 'hex'),
  is_verified boolean default false,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Automatic Profile Creation Trigger on Supabase Auth User Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
declare
  existing_profile_id text;
begin
  -- Check if member profile already pre-exists (e.g. imported verified club members)
  select id into existing_profile_id from public.profiles where lower(email) = lower(new.email) limit 1;
  
  if existing_profile_id is not null then
    -- Link Supabase Auth user to existing pre-verified profile
    update public.profiles set
      user_id = new.id,
      name = coalesce(nullif(new.raw_user_meta_data->>'name', ''), profiles.name),
      reg_number = coalesce(nullif(new.raw_user_meta_data->>'reg_number', ''), profiles.reg_number)
    where id = existing_profile_id;
  else
    insert into public.profiles (
      id,
      user_id,
      name,
      email,
      reg_number,
      role,
      instrument,
      is_verified,
      is_admin
    ) values (
      new.id::text,
      new.id,
      coalesce(new.raw_user_meta_data->>'name', 'Musician'),
      new.email,
      coalesce(new.raw_user_meta_data->>'reg_number', 'PENDING-' || substr(new.id::text, 1, 6)),
      coalesce(new.raw_user_meta_data->>'role', 'Member'),
      coalesce(new.raw_user_meta_data->>'instrument', 'Vocals'),
      false,
      false
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. BANDS TABLE
create table public.bands (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  genre text default 'Rock / Fusion',
  leader_name text not null,
  status text default 'Approved' check (status in ('Approved', 'Pending', 'Rejected')),
  created_at timestamptz default now()
);

-- 4. BAND MEMBERS TABLE
create table public.band_members (
  id text primary key default gen_random_uuid()::text,
  band_id text references public.bands(id) on delete cascade,
  member_name text not null,
  register_number text not null,
  secret_key text,
  created_at timestamptz default now()
);

-- 5. SLOT BOOKINGS TABLE (Music Room)
create table public.slot_bookings (
  id text primary key default ('BKG-' || floor(1000 + random() * 9000)::text),
  slot_date date not null,
  time_slot text not null,
  booker_name text not null,
  booker_reg text not null,
  band_name text,
  members_info jsonb default '[]'::jsonb,
  status text default 'Approved' check (status in ('Approved', 'Blocked', 'Pending', 'Rejected')),
  block_reason text,
  created_at timestamptz default now(),
  constraint unique_slot_schedule unique (slot_date, time_slot)
);

-- 6. INSTRUMENTS INVENTORY
create table public.instruments (
  id text primary key default ('INST-' || floor(1000 + random() * 9000)::text),
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
create table public.instrument_requests (
  id text primary key default ('REQ-' || floor(1000 + random() * 9000)::text),
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
create table public.site_content (
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

-- Permissive policies for modern client-side Jamstack / Member Portal
create policy "Profiles viewable by everyone" on public.profiles for select using (true);
create policy "Profiles insertable and updatable" on public.profiles for all using (true) with check (true);

create policy "Bands viewable by everyone" on public.bands for select using (true);
create policy "Bands insertable and updatable" on public.bands for all using (true) with check (true);

create policy "Band members viewable by everyone" on public.band_members for select using (true);
create policy "Band members insertable and updatable" on public.band_members for all using (true) with check (true);

create policy "Slot bookings viewable by everyone" on public.slot_bookings for select using (true);
create policy "Slot bookings insertable and updatable" on public.slot_bookings for all using (true) with check (true);

create policy "Instruments viewable by everyone" on public.instruments for select using (true);
create policy "Instruments insertable and updatable" on public.instruments for all using (true) with check (true);

create policy "Instrument requests viewable by everyone" on public.instrument_requests for select using (true);
create policy "Instrument requests insertable and updatable" on public.instrument_requests for all using (true) with check (true);

create policy "Site content viewable by everyone" on public.site_content for select using (true);
create policy "Site content insertable and updatable" on public.site_content for all using (true) with check (true);

-- ==============================================================================
-- POST-DEPLOYMENT INSTRUCTIONS:
-- 1. Run this entire script in Supabase SQL Editor.
-- 2. When the club lead or admin signs up via the website, grant admin privileges:
--    UPDATE public.profiles SET is_admin = true, is_verified = true WHERE email = 'your.email@vitstudent.ac.in';
-- ==============================================================================