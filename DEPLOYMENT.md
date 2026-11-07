# VITC Music Club - Netlify & Supabase Deployment Guide

This project is configured for automated deployment on **Netlify** with a **Supabase** cloud database for multi-user authentication, real-time slot bookings, band lineups, and CMS persistence.

---

## Part 1: Supabase Setup (5 Minutes)

1. Go to [supabase.com](https://supabase.com) and click **"Start your project"** (Sign in with GitHub).
2. Click **"New Project"**:
   - **Name:** `vitc-music-club`
   - **Database Password:** (Choose a secure password and save it)
   - **Region:** Select **South Asia (Mumbai)** for lowest latency in India.
3. Once the project is created, open the **SQL Editor** from the left navigation.
4. Click **"New Query"**, copy the contents of [`supabase/schema.sql`](supabase/schema.sql), paste it in, and click **Run** (green button).
   - This sets up all tables (`profiles`, `bands`, `slot_bookings`, `instruments`, `site_content`), triggers, RLS security policies, and initial instrument seed data.
5. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**:
   - Copy the **Project URL** (`https://xyz.supabase.co`)
   - Copy the **anon public API Key** (`eyJhbGciOi...`)

---

## Part 2: Netlify Deployment (2 Minutes)

### Option A: Via GitHub (Recommended for automatic continuous deployment)

1. Initialize Git and push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Production release for Netlify and Supabase"
   git remote add origin https://github.com/<your-username>/vitc-music-club.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to [netlify.com](https://www.netlify.com).
3. Click **"Add new site"** -> **"Import an existing project"** -> Choose **GitHub**.
4. Select your `vitc-music-club` repository.
5. In **Build settings** (Netlify will auto-detect from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click **"Environment variables"** -> **"Add a variable"**:
   - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
7. Click **"Deploy site"**. Your site will be live on a `*.netlify.app` domain in ~30 seconds.

### Option B: Drag-and-Drop (Instant preview without Git)

1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the `vitc-music-club/dist` folder into the drop zone.
4. Go to **Site configuration** -> **Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and trigger a re-deploy.

---

## Part 3: Campus Wi-Fi Verification

- Netlify's global CDN and edge domains (`*.netlify.app`) work reliably across college Wi-Fi and mobile networks.
- Supabase REST and Realtime WebSockets communicate directly over standard HTTPS port 443 (`https://*.supabase.co`), which bypasses campus firewall filters.
