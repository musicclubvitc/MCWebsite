// Fallback Data Structure for VIT Chennai Music Club (Live data is loaded from public/content.json & Supabase)

export const CLUB_STATS = [
  { label: "Total Events Conducted", value: "60+", change: "+12 this academic year" },
  { label: "Active Club Members", value: "125", change: "Singers, instrumentalists & crew" },
  { label: "Community Followers", value: "2.7k+", change: "Across Instagram & YouTube" },
  { label: "Trophies & Prizes", value: "54+", change: "National & Inter-collegiate wins" }
];

export const BANDS = [];

export const EVENTS_LIST = [];

export const GALLERY_PHOTOS = [];

export const TEAM_SESSIONS = {};

export const AVAILABLE_INSTRUMENTS = [];

export const JAM_ROOMS = [
  {
    id: "room-ab1-soundproof",
    name: "Soundproof Jam Station (Room 412, AB1)",
    capacity: "Up to 9 members",
    amenities: ["Pearl Drum Kit", "Marshall Guitar Half-Stack", "Hartke Bass Amp", "Roland XPS-30", "PA Monitor System", "Acoustic Treatment"]
  },
  {
    id: "room-studio-b",
    name: "Acoustic / Eastern Studio (Room 414, AB1)",
    capacity: "Up to 6 members",
    amenities: ["Tanpura & Shruti Box", "Harmonium", "Yamaha Acoustic Guitars", "Cajon & Djembe", "Condenser Mics"]
  },
  {
    id: "room-amphitheatre",
    name: "MBA Amphitheatre Stage (Rehearsals)",
    capacity: "Large Bands (Up to 15 members)",
    amenities: ["Open Air Acoustic Setup", "Mobile Portable PA", "Power Distribution", "Stage Lighting"]
  }
];
