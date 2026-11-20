# 🎵 VIT Chennai Music Club

> The official digital home, rehearsal studio manager, and archive for the **VIT Chennai Music Club** — built by student musicians, for student musicians.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_DB-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🎸 Why We Built This

Running a college music club sounds all fun and rock 'n' roll until you're juggling 10+ student bands fighting over time in the campus sound room, borrowing expensive electric guitars and synthesizers on scrap paper, or asking in chaotic WhatsApp groups who booked Room 412 between 4:00 PM and 6:00 PM.

This website was built to solve all of that in one beautiful, reliable place. It acts as both our **public face** to the university (announcing fests, archiving jam photos, showcasing official bands) and an **internal backstage studio engine** where verified club members reserve jam slots, borrow gear, and collaborate.

Best of all, it includes an in-browser **No-Code CMS**, meaning future Core Boards don't need a computer science degree just to add new band photos, announce annual auditions, or update the club guidelines.

---

## ✨ Features at a Glance

### 🌐 The Public Experience

* **Home Page**: Dynamic audio equalizer aesthetic, live club metrics (active musicians, gigs played, stage hardware), our founding story, and a featured band showcase.
* **Events & Showcases**: A curated, filterable catalogue of university fests (*Resonance*, *Curtain Raiser*, *Battle of Bands*, *Open Mic*, *Aakriti*).
  * **Native Poster Showcase**: Posters scale in their original aspect ratios (portrait, square, or landscape) with an ambient blurred glow backdrop and a one-click *"View Full Size"* high-res viewer.
  * Direct registration for upcoming performances.
* **Club Photo & Video Gallery**: High-res concert moments, acoustic jam archives, and audition memories with category filtering and a responsive photo lightbox.
  * Supports manual direct image links and automatic Google Drive share-link conversion.
* **The Core Board**: Meet the students directing sound production, organizing fests, and leading the club.
  * Automatically defaults to the **latest academic tenure** (`2026-27`, `2025-26`, etc.).
  * Designation badges, primary instruments, and direct Instagram/LinkedIn connections.
* **Instructions & Guidelines**: Complete operating rulebook for musicians covering registration requirements, slot duration limits, studio noise etiquette, and equipment custody.
* **Contact & Desk Info**: Reach out for collaborations, fest invites, or general questions, with an interactive contact form and student FAQ accordion.

---

### 🔐 The Musicians' Backstage Portal

Verified club members (signed in with their official `@vitstudent.ac.in` student email) unlock access to our private member portal:

1. **Member Profile**:
   * Displays student registration number, validated roles (vocals, guitar, drums, keys), copyable Member ID, and individual statistics (slots booked, gear borrowed).
2. **Music Room Slot Booking (Room 412, AB1)**:
   * Reserve rehearsal time in the campus soundproof room up to 7 days in advance.
   * Pick dates and specific time slots with real-time double-booking prevention.
   * Specify equipment needs (drum kit, Roland synth, guitar half-stacks, vocal mics).
   * Generates a **clean, printable confirmation slip** to show at the studio door.
3. **Stage Gear & Instrument Requisition**:
   * Browse available club hardware (electric guitars, multi-effects pedalboards, synthesizers, acoustic-electric violins, and XLR audio cables).
   * Submit borrow and return dates with automatic custody logging.
4. **Official Band Registration**:
   * Form new performance units with built-in validation for the club's 3-to-9 musicians rule.
   * Manage member lineups and authenticate credentials.

---

### 🛡️ Admin Console & Studio Management

Club board members and superusers have a dedicated management suite:

* **Live Multi-Client Sync**: Manual and real-time refresh controls so booking approvals reflect instantly across all student screens.
* **One-Click Approvals**: Review pending slot reservations and equipment requisitions, approving or declining requests with automated status updates.
* **Inventory Control**: Log returned instruments and monitor room capacity.

---

### 🎛️ Built-In No-Code CMS (Effortless Handover)

Every academic year brings a new Core Board. To ensure the site never becomes obsolete or requires code changes for routine updates, administrators can manage everything directly from the browser:

| Section | What Can Be Managed |
| :--- | :--- |
| **Site & Hero** | Club title, hero badge, headline, and call-to-action buttons |
| **About & Stats** | Our story narrative, mission statement, and live campus statistics |
| **Events & Posters** | Add new fests, upload poster URLs, update venue, prizes, and dates |
| **Bands Showcase** | Update active band rosters, descriptions, and member lineups |
| **Drive Gallery** | Add photos, assign albums, tags, and link shared Google Drive folders |
| **Tenures & Team** | Add new academic tenures (e.g., `2027-28`), reorder tenure buttons, and click **"Sort Latest First"** |
| **Instructions & Rules** | Add, rename, or reorder guideline tabs, edit individual rule cards, customize icons, and edit official notice alerts |
| **FAQs & Contact** | Update desk room numbers, club email, socials, and student FAQs |
| **Backup & Restore** | One-click **Export `content.json`** and **Import `content.json`** for safe offline backups |

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) for lightning-fast HMR and minimal bundle footprint.
* **Database & Realtime Backend**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Realtime subscriptions, and auto-seeding).
* **Styling & Design System**: Modern, pure CSS with custom design tokens (`--blue-primary`, `--blue-sky`, `--blue-royal`), custom scrollbars, and deep glassmorphism.
* **Icons**: [Lucide React](https://lucide.dev/) for clean, consistent UI icons.
* **Reliability**: Seamless offline-first architecture. If Supabase credentials are missing or the connection is interrupted, the site automatically falls back to bundled JSON and `localStorage` so public users never see a broken screen.

---

## 🚀 Getting Started Locally

### Prerequisites

* Node.js (v18 or newer recommended)
* npm or pnpm

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/Emdymc/MCWebsite.git
cd MCWebsite

# Install dependencies
npm install
```

### 2. Configure Environment Variables (Optional for Local Demo)

The application works out of the box with bundled fallback content. To connect your live Supabase database, create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### 3. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📦 Database Tables Overview (Supabase)

If setting up a fresh Supabase instance, the application utilizes the following core tables:

* `site_content`: Holds dynamic CMS configuration (JSON payload for site copy, gallery, tenures, and instructions).
* `profiles`: Verified club members with their registration numbers and instrument roles.
* `slot_bookings`: Music room reservations with status (`Pending`, `Approved`, `Declined`, `Blocked`).
* `bands` & `band_members`: Registered campus bands and active musician lineups.
* `instruments` & `instrument_requests`: Equipment inventory and requisition custody logs.

---

## 🤝 Core Board Handover Guide

If you just took over as the Web Lead or Secretary for the upcoming academic tenure, **welcome!** Here's all you need to know:

1. **Sign into the Member Portal** using an admin account.
2. Click **Admin Console** in the top navigation, then switch to the **Site Content CMS** tab.
3. Under **Tenures & Team**:
   * Type your new academic year (e.g., `2027-28`) into the input box and click **Add Tenure**.
   * Click **Sort Latest First** so your team is the first thing visitors see.
   * Add your board members, designations, and profile pictures.
4. Under **Instructions & Rules**:
   * Review room rules or add new tabs if studio booking rules change.
5. Click **Save Changes** — Supabase will sync the new information instantly to all devices.
6. Before any major revamp, click **Export content.json** from the top bar so you always have a rollback file handy.

---

## 📄 License

Created with ❤️ by the **VIT Chennai Music Club Core Team**. Open-sourced under the [MIT License](LICENSE).
