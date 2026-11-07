# VIT Chennai Music Club Website

A modern, fast, and practical website for the **VIT Chennai Music Club**, built with React, Vite, and modern CSS.

---

## 🌟 Key Features

1. **Public Pages:**
   - **Home:** Hero section with clean audio equalizer bars, live club statistics, about story, official club bands lineup, and call-to-actions.
   - **Events:** Searchable and filterable catalogue of 14+ annual events (*Resonance*, *Curtain Raiser*, *Polyphony*, *Aakriti*, *Fresher's Talent Hunt*, *Open Mic*) with event details modals and registration.
   - **Instructions:** Guidelines covering member account creation, music room rules, instrument lending policy, band formation rules (min 3, max 9 members), and studio etiquette.
   - **The Team:** Core Board members across sessions (2024-25, 2023-24) with designations, instruments, and social links.
   - **Contact:** Interactive message dispatch form, campus desk location (Room 412 & 414, AB1), direct telephone, email, and FAQs.

2. **Hidden Club Member Portal:**
   - **My Profile:** Musician credentials, VIT registration number, copyable Member ID, and activity counters.
   - **My Bands:** View registered bands and form new bands with real-time validation of the 3-to-9 members rule.
   - **Jam Slot Bookings:** Reserve rehearsal slots in Room 412 (Soundproof Rehearsal Hall, AB1), pick time slots, and specify required equipment.
   - **Instrument Requests:** Request electric guitars, bass, synthesizers, drum hardware, and stage mics with borrow/return dates.
   - **Superuser Approvals:** Toggle Admin mode to approve or reject pending slot bookings and instrument requests.

---

## 📝 Updating Page Content Without Code Access

Future club core committees have **two easy ways** to update all website content without touching source code:

### Method 1: Using the Built-In Admin CMS (In the Browser)
1. Open the website and click **Member Portal**.
2. Click **Admin** (or sign in as an administrator).
3. Select the **Site Content CMS** tab.
4. From here, you can:
   - Edit announcement notices, club stats, and hero text.
   - Add new events or mark existing ones as completed/upcoming.
   - Add or edit official bands, descriptions, and lineups.
   - Update core board members, photos, and roles.
   - Update contact details and student FAQs.
5. Click **Apply Changes** to see the updates instantly.
6. Click **Export content.json** to download the updated JSON file to keep or share.

### Method 2: Editing `public/content.json` Directly
All site copy, events, bands, team members, and contact info live in a single, human-readable JSON file:
```
public/content.json
```
Anyone on the committee can edit this file on GitHub or via a text editor, save it, and the website will automatically reflect the changes.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
