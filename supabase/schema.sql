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
  role text default 'Musician',
  instrument text,
  year_of_study text,
  joined_year text default '2024',
  secret_key text unique default encode(gen_random_bytes(12), 'hex'),
  is_verified boolean default false,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Automatic Profile Creation Trigger on Supabase Auth User Sign Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
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
    coalesce(new.raw_user_meta_data->>'role', 'Musician'),
    coalesce(new.raw_user_meta_data->>'instrument', 'Vocals / Guitar'),
    false,
    false
  ) on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, profiles.name);
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
-- INITIAL SEED DATA
-- ==============================================================================

-- 1. Profiles
insert into public.profiles (id, name, email, reg_number, role, is_admin, is_verified, secret_key) values
  ('usr-1', 'Sarvesh C', 'sarvesh.c2024@vitstudent.ac.in', '24BCE5259', 'Developer', true, true, '68ff9228ab0faf069397bb24'),
  ('usr-2', 'Michael Dias', 'michael.dias2024@vitstudent.ac.in', '24BCE5260', 'Creative Head', true, true, '6911a3522c9c7646f3f5911e'),
  ('usr-3', 'Aarav Sharma', 'aarav.sharma2022@vitstudent.ac.in', '22BCE1289', 'Guitarist', false, true, '68ff920169754d9fb129e4a2'),
  ('usr-4', 'Dhivi Bommisetty', 'dhivi.b2024@vitstudent.ac.in', '26BHC1062', 'Vocalist', false, false, '68ff925280e2ebc5981e2330'),
  ('usr-5', 'Aravindakshan C J', 'aravind.cj2024@vitstudent.ac.in', '26MIS1138', 'Drummer', false, false, '6900e3ff6657a7fe8361a944'),
  ('usr-6', 'Shruthika P', 'shruthika.p2024@vitstudent.ac.in', '26BBH1010', 'Keyboardist', false, true, '68ff92123456789abcdef012'),
  ('usr-7', 'Ajay', 'ajay2025@vitstudent.ac.in', '25BMV1028', 'Bassist', false, false, '68ff92987654321fedcba345')
on conflict (reg_number) do update set
  name = excluded.name,
  is_admin = excluded.is_admin,
  is_verified = excluded.is_verified;

-- 2. Bands
insert into public.bands (id, name, genre, leader_name, status) values
  ('band-101', 'VantaBound', 'Progressive Rock & Metal', 'Mervin Samuel', 'Approved'),
  ('band-102', 'TATVA', 'Indian Classical Fusion', 'Aditya Aryan Jha', 'Approved'),
  ('band-103', 'High Ground', 'Post-Hardcore / Alt Rock', 'Meera Sujith', 'Approved'),
  ('band-104', 'Karnaught', 'Thrash Metal', 'Jack Farrell Prabakaran', 'Approved'),
  ('band-105', 'Bandishhh', 'Bollywood & Sufi Rock', 'Sagarika', 'Approved'),
  ('band-106', 'Requiem', 'Jazz & Funk Collective', 'Soham', 'Approved'),
  ('band-107', 'Six Delusions', 'Hard Rock & Funk', 'Rheminth Simeon', 'Approved'),
  ('band-108', 'The Deccan Project', 'Carnatic Acoustic Fusion', 'Elena', 'Approved')
on conflict (id) do nothing;

-- 3. Band Members
insert into public.band_members (band_id, member_name, register_number, secret_key) values
  ('band-101', 'Mervin Samuel', '25BLC1260', '6911a3522c9c7646f3f5911e'),
  ('band-101', 'DHARANESH K', '25BMH1209', '68ff920169754d9fb129e4a2'),
  ('band-101', 'Dheeraj A', '25BME1058', '68ff925280e2ebc5981e2330'),
  ('band-101', 'Shyam Husain', '24MIS1046', '6900e3ff6657a7fe8361a944'),
  ('band-101', 'Shreyas Narayanan', '24MIS1174', '68ff928877665544332211aa'),
  ('band-102', 'Aditya Aryan Jha', '24BCE1120', '68ff9211aa'),
  ('band-103', 'Meera Sujith', '23BCE0911', '68ff9222bb'),
  ('band-104', 'Jack Farrell', '22BCI0144', '68ff9233cc'),
  ('band-105', 'Sagarika', '23BCE2001', '68ff9244dd'),
  ('band-106', 'Soham', '24BCE1402', '68ff9255ee'),
  ('band-107', 'Rheminth Simeon', '21BCE1402', '68ff9266ff'),
  ('band-107', 'Aarav Sharma', '22BCE1289', '68ff920169754d9fb129e4a2');

-- 4. Instruments
insert into public.instruments (id, name, category, code, location, condition, available) values
  ('inst-1', 'Fender Player Stratocaster (HSS)', 'Electric Guitar', 'GTR-FEN-01', 'Music Room - Locker A', 'Excellent', true),
  ('inst-2', 'Yamaha FG800 Acoustic Guitar', 'Acoustic Guitar', 'GTR-YAM-04', 'Music Room - Cupboard 2', 'Good', true),
  ('inst-3', 'Ibanez SR305E 5-String Bass', 'Bass Guitar', 'BAS-IBA-02', 'Music Room - Rack B', 'Excellent', true),
  ('inst-4', 'Roland XPS-30 Synthesizer / Workstation', 'Keyboards & Synth', 'KEY-ROL-01', 'Music Room - Table 3', 'Mint', true),
  ('inst-5', 'Pearl Export 5-Piece Drum Kit & Meinl Cymbals', 'Drums & Percussion', 'DRM-PRL-01', 'Music Room - Stage Area', 'Stage Ready', true),
  ('inst-6', 'Shure SM58 Dynamic Vocal Microphones (Set of 3)', 'Microphones & Audio', 'MIC-SHU-03', 'Music Room - Audio Drawer', 'Excellent', true)
on conflict (id) do nothing;

-- 5. Slot Bookings
insert into public.slot_bookings (id, slot_date, time_slot, booker_name, booker_reg, band_name, status, block_reason) values
  ('BKG-1049', current_date + interval '2 day', '10:45 AM - 12:35 PM', 'Michael Dias', '24BCE5260', null, 'Blocked', 'Event setup & Soundcheck'),
  ('BKG-1048', current_date + interval '3 day', '04:15 PM - 05:10 PM', 'Aarav Sharma', '22BCE1289', null, 'Approved', null),
  ('BKG-1044', current_date + interval '5 day', '01:30 PM - 03:20 PM', 'Rheminth Simeon', '21BCE1402', 'Six Delusions', 'Approved', null)
on conflict (slot_date, time_slot) do nothing;

-- 6. Instrument Requests
insert into public.instrument_requests (id, instrument_name, instrument_code, borrow_date, return_date, event_name, booker_name, booker_reg, status) values
  ('REQ-8021', 'Fender Player Stratocaster (HSS)', 'GTR-FEN-01', current_date + interval '3 day', current_date + interval '4 day', 'College Cultural Fest Band Showcase', 'Aarav Sharma', '22BCE1289', 'Approved'),
  ('REQ-8022', 'Roland XPS-30 Synthesizer', 'KEY-ROL-01', current_date + interval '5 day', current_date + interval '6 day', 'Live Track Sequencing & Stage Audition', 'Aarav Sharma', '22BCE1289', 'Pending'),
  ('REQ-7994', 'Shure SM58 Dynamic Vocal Microphones (Set of 3)', 'MIC-SHU-03', current_date - interval '10 day', current_date - interval '9 day', 'Acoustic Unplugged Evening Rehearsal', 'Michael Dias', '24BCE5260', 'Returned')
on conflict (id) do nothing;
