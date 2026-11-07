// Official Data for VIT Chennai Music Club

export const CLUB_STATS = [
  { label: "Total Events Conducted", value: "60+", change: "+12 this academic year" },
  { label: "Active Club Members", value: "125", change: "Singers, instrumentalists & crew" },
  { label: "Community Followers", value: "2.7k+", change: "Across Instagram & YouTube" },
  { label: "Trophies & Prizes", value: "54+", change: "National & Inter-collegiate wins" }
];

export const BANDS = [
  { 
    id: "six-delusions",
    name: "Six Delusions",
    genre: "Hard Rock & Funk",
    description: "A high-octane western band shredding through hard rock, heavy funk, and energetic stage sets that electrify college fests.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/sixdelusions/",
    members: [
      { name: "Rheminth Simeon", role: "Drummer", reg: "21BCE1402" },
      { name: "Anshul", role: "Lead Guitarist", reg: "21BCE2891" },
      { name: "Jerald Elias", role: "Rhythm Guitarist", reg: "22BEE0412" },
      { name: "Surya", role: "Keyboardist", reg: "21BME0911" },
      { name: "Aurum", role: "Bassist", reg: "22BCI0144" },
      { name: "Mihir", role: "Vocalist", reg: "21BCE1980" },
      { name: "Olivia", role: "Vocalist", reg: "22BCE3421" }
    ],
    status: "Active Roster",
    yearFormed: "2022"
  },
  {
    id: "band-ish",
    name: "Band-ish",
    genre: "Indo-Western Fusion & Carnatic Pop",
    description: "A soulful fusion band that seamlessly marries the intricate gamakas of Indian classical music with groove-laden contemporary western pop.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/vitcmusicclub",
    members: [
      { name: "Karthik Raj", role: "Carnatic Vocals", reg: "22BCI0812" },
      { name: "Sneha V", role: "Violinist", reg: "22BCE1145" },
      { name: "Aditya Mohan", role: "Mridangam / Percussion", reg: "21BME0221" },
      { name: "Rohan Nair", role: "Acoustic / Electric Guitar", reg: "22BCE2411" },
      { name: "Nandini R", role: "Flutist", reg: "23BCE0981" }
    ],
    status: "Active Roster",
    yearFormed: "2021"
  },
  {
    id: "fragments",
    name: "Fragments",
    genre: "Pop, Soul & Jazz",
    description: "Mastering silky smooth jazz voicings, infectious pop melodies, and acoustic arrangements that touch the deepest soul.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/vitcmusicclub",
    members: [
      { name: "Tara Menon", role: "Lead Vocals", reg: "22BCE0314" },
      { name: "David John", role: "Jazz Keys & Synth", reg: "21BCE2210" },
      { name: "Aryan Sen", role: "Saxophone / Flute", reg: "22BME1032" },
      { name: "Kiran Paul", role: "Fretless Bass", reg: "21BEE0931" }
    ],
    status: "Active Roster",
    yearFormed: "2022"
  },
  {
    id: "beatroots",
    name: "Beatroots",
    genre: "Rock & Alternative Metal",
    description: "Raw overdrive, crushing bass lines, and soaring anthems. Beatroots champions alt-rock and modern heavy guitar tones.",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/vitcmusicclub",
    members: [
      { name: "Akash Sharma", role: "Lead Vocalist", reg: "22BCE1590" },
      { name: "Vikram R", role: "Guitarist", reg: "21BCI0876" },
      { name: "Siddharth P", role: "Drummer", reg: "22BME0344" },
      { name: "Harish K", role: "Bassist", reg: "21BEE1120" }
    ],
    status: "Active Roster",
    yearFormed: "2021"
  },
  {
    id: "promethium-martyrs",
    name: "Promethium Martyrs",
    genre: "Western Heavy Metal",
    description: "Fast-paced thrash riffs, double-bass drum onslaughts, and technical guitar solos that leave audiences breathless.",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/vitcmusicclub",
    members: [
      { name: "Samuel Joseph", role: "Growls / Lead Vocals", reg: "21BCE0490" },
      { name: "Nikhil Joshi", role: "Lead Guitar", reg: "21BCI1209" },
      { name: "Rishabh Jain", role: "Rhythm Guitar", reg: "22BCE0911" },
      { name: "Tejas S", role: "Bass", reg: "21BME0455" },
      { name: "Varun R", role: "Drums", reg: "22BCE1833" }
    ],
    status: "Legacy Roster",
    yearFormed: "2020"
  },
  {
    id: "tenebris",
    name: "Tenebris",
    genre: "Deathcore & Progressive Metal",
    description: "Complex time signatures, relentless blast beats, and punishing breakdowns inspired by technical death metal legends.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    instagram: "https://www.instagram.com/vitcmusicclub",
    members: [
      { name: "Arjun Reddy", role: "Vocals", reg: "21BCE0765" },
      { name: "Kavya S", role: "7-String Guitar", reg: "21BEE0987" },
      { name: "Pranav M", role: "Drums", reg: "22BCE2001" }
    ],
    status: "Legacy Roster",
    yearFormed: "2020"
  }
];

export const EVENTS = [
  {
    id: "resonance-2k25",
    name: "Resonance 2k25 - Annual Music Fest",
    type: "Intercollege Fest",
    date: "2025-03-14T17:00:00Z",
    dateDisplay: "March 14 - 16, 2025",
    venue: "Main Amphitheatre & Nethaji Auditorium",
    prizePool: "₹50,000",
    registrationFees: "₹150",
    status: "Upcoming",
    description: "VIT Chennai Music Club's flagship national inter-collegiate musical extravaganza! Three adrenaline-filled days of Western Battle of the Bands, Eastern Band Showdowns, Acoustic Solos, Beatboxing, and star celebrity performances.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "curtain-raiser-2k24",
    name: "Curtain Raiser 2k24",
    type: "Band Showcase",
    date: "2024-10-18T17:30:00Z",
    dateDisplay: "October 18, 2024",
    venue: "Nethaji Auditorium (AB1, 7th Floor)",
    prizePool: "Exhibition",
    registrationFees: "Free",
    status: "Completed",
    description: "The grand kickoff concert welcoming the new academic session. Catch all official club bands unveiling their freshest repertoires ranging from A.R. Rahman to Iron Maiden and Coldplay.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sleigh-along-2k24",
    name: "Sleigh Along - Christmas Carol Night",
    type: "Performances",
    date: "2024-12-21T18:00:00Z",
    dateDisplay: "December 21, 2024",
    venue: "MBA Amphitheatre",
    prizePool: "Exhibition",
    registrationFees: "Free",
    status: "Completed",
    description: "'Tis the season to be jolly! Music Club VITCC brings a festive Christmas choir and acoustically harmonized jingles under the starry Chennai night sky.",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "freshers-talent-hunt-2k24",
    name: "Fresher's Talent Hunt 2k24",
    type: "Competition",
    date: "2024-09-28T16:00:00Z",
    dateDisplay: "September 28, 2024",
    venue: "Nethaji Auditorium",
    prizePool: "₹6,000",
    registrationFees: "₹100",
    status: "Completed",
    description: "Exclusively for 1st-year students! Showcase your musical virtuosity across western vocals, carnatic singing, keyboard solos, guitar shredding, beatboxing, and drumming to earn a direct spot in the club.",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "polyphony-western-bob",
    name: "Polyphony - Western Battle of Bands",
    type: "Western Battle of Bands",
    date: "2024-03-22T17:00:00Z",
    dateDisplay: "March 22, 2024",
    venue: "MBA Amphitheatre Stage",
    prizePool: "₹15,000",
    registrationFees: "₹300",
    status: "Completed",
    description: "Ripping overdrive pedals, thumping slap bass, and thunderous drumming. Battle it out against top collegiate bands for ultimate western rock supremacy.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "aakriti-eastern-bob",
    name: "Aakriti - Eastern & Fusion Battle",
    type: "Eastern Battle of Bands",
    date: "2024-03-23T17:00:00Z",
    dateDisplay: "March 23, 2024",
    venue: "MBA Amphitheatre Stage",
    prizePool: "₹15,000",
    registrationFees: "₹300",
    status: "Completed",
    description: "Spine-chilling raagas, contemporary indie arrangements, and soulful Indian melodies clashing in an unforgettable battle of eastern bands.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "b-minor-instrumental",
    name: "B-Minor - Instrumental Championship",
    type: "Instrumental Competition",
    date: "2023-11-18T15:30:00Z",
    dateDisplay: "November 18, 2023",
    venue: "AB1 Audio Hall",
    prizePool: "₹5,000",
    registrationFees: "₹100",
    status: "Completed",
    description: "Striking the right chord and rhythm. A pure instrumental showcase for classical instruments, guitars, synthesizers, violins, and flutes.",
    image: "https://images.unsplash.com/photo-1520523839898-507121c2762a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "crescendo-western-solo",
    name: "Crescendo - Western Solo Vocals",
    type: "Western Solo",
    date: "2023-10-12T16:00:00Z",
    dateDisplay: "October 12, 2023",
    venue: "Mini Auditorium",
    prizePool: "₹5,000",
    registrationFees: "₹80",
    status: "Completed",
    description: "Hit those high vocal runs, pitch-perfect falsettos, and expressive dynamic control. Vit Chennai's premier western solo singing competition.",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "open-mic-acoustic",
    name: "Campus Unplugged - Open Mic Evening",
    type: "Open Mic",
    date: "2023-04-14T17:00:00Z",
    dateDisplay: "April 14, 2023",
    venue: "MBA Amphitheatre",
    prizePool: "Open Stage",
    registrationFees: "Free",
    status: "Completed",
    description: "A laid-back acoustic evening open to every student of VIT Chennai. Bring your acoustic guitar, cajón, or your voice, and share music freely.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
  }
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Curtain Raiser Live Concert",
    caption: "Full auditorium rocking with Six Delusions on stage",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    tag: "Concert"
  },
  {
    id: 2,
    title: "Sleigh Along Carol Choir",
    caption: "Warm winter melodies under fairy lights at the MBA Amphitheatre",
    url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1000&q=80",
    tag: "Performances"
  },
  {
    id: 3,
    title: "Music Room Rehearsals",
    caption: "Members gearing up for national collegiate battle of the bands",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    tag: "Rehearsal"
  },
  {
    id: 4,
    title: "Republic Day Patriotic Medley",
    caption: "Sitar, flute and choral ensemble performing for VIT leadership",
    url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80",
    tag: "Official"
  },
  {
    id: 5,
    title: "Electric Drum Solo Showcase",
    caption: "Polyphony western battle drum solo heat round",
    url: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1000&q=80",
    tag: "Battle"
  },
  {
    id: 6,
    title: "Core Board 2024-25 Induction",
    caption: "Passing on the mantle to lead Chennai's most vibrant campus music club",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
    tag: "Board"
  }
];

export const TEAM_SESSIONS = {
  "2026-27": [],
  "2025-26": [],
  "2024-25": [
    {
      role: "President",
      name: "Siddharth Raman",
      image: "",
      instrument: "Lead Vocals & Rhythm Guitar",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 99802 79489"
    },
    {
      role: "Vice President",
      name: "Aishwarya Iyer",
      image: "",
      instrument: "Carnatic Vocals & Veena",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 98401 23456"
    },
    {
      role: "General Secretary",
      name: "Jerald Elias",
      image: "",
      instrument: "Electric Guitar / Sound Engineering",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 97902 44321"
    },
    {
      role: "Management Head",
      name: "Meghna Roy",
      image: "",
      instrument: "Acoustic Guitar & Logistics",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 91234 56780"
    },
    {
      role: "Event Director",
      name: "Rheminth Simeon",
      image: "",
      instrument: "Drums & Stage Operations",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 96543 21890"
    },
    {
      role: "Creative Head",
      name: "Tanvi Deshmukh",
      image: "",
      instrument: "Keyboard & Visual Media",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 95432 10987"
    },
    {
      role: "Technical & Gear Head",
      name: "Aurum Sengupta",
      image: "",
      instrument: "Bass Guitar & Studio Gear",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 94321 09876"
    }
  ],
  "2023-24": [
    {
      role: "President",
      name: "Aditya Bhattacharya",
      image: "",
      instrument: "Western Vocals",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 99802 79489"
    },
    {
      role: "Vice President",
      name: "Ria Elizabeth",
      image: "",
      instrument: "Violinist",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 98765 43210"
    },
    {
      role: "General Secretary",
      name: "Varun Nair",
      image: "",
      instrument: "Drummer",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 97654 32109"
    },
    {
      role: "Event Director",
      name: "Shreya Joshi",
      image: "",
      instrument: "Keyboardist",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 96543 21098"
    },
    {
      role: "Management Head",
      name: "Gautam Rao",
      image: "",
      instrument: "Bass Guitar",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 95432 10987"
    }
  ],
  "2022-23": [
    {
      role: "President",
      name: "Prithvi Shankar",
      image: "",
      instrument: "Lead Guitarist",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 99802 79489"
    },
    {
      role: "Vice President",
      name: "Ananya Krishnan",
      image: "",
      instrument: "Vocals",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 98765 43210"
    },
    {
      role: "General Secretary",
      name: "Rohan Varghese",
      image: "",
      instrument: "Percussion",
      instagram: "https://instagram.com/vitcmusicclub",
      linkedin: "https://linkedin.com",
      phone: "+91 97654 32109"
    }
  ]
};

export const AVAILABLE_INSTRUMENTS = [
  {
    id: "inst-1",
    name: "Fender Player Stratocaster (HSS)",
    category: "Electric Guitar",
    code: "GTR-FEN-01",
    location: "Music Room - Locker A",
    condition: "Excellent",
    available: true,
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "inst-2",
    name: "Yamaha FG800 Acoustic Guitar",
    category: "Acoustic Guitar",
    code: "GTR-YAM-04",
    location: "Music Room - Cupboard 2",
    condition: "Good",
    available: true,
    image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "inst-3",
    name: "Ibanez SR305E 5-String Bass",
    category: "Bass Guitar",
    code: "BAS-IBA-02",
    location: "Music Room - Rack B",
    condition: "Excellent",
    available: true,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "inst-4",
    name: "Roland XPS-30 Synthesizer / Workstation",
    category: "Keyboards & Synth",
    code: "KEY-ROL-01",
    location: "Music Room - Table 3",
    condition: "Mint",
    available: true,
    image: "https://images.unsplash.com/photo-1520523839898-507121c2762a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "inst-5",
    name: "Pearl Export 5-Piece Drum Kit & Meinl Cymbals",
    category: "Drums & Percussion",
    code: "DRM-PRL-01",
    location: "Music Room - Stage Area",
    condition: "Stage Ready",
    available: true,
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "inst-6",
    name: "Shure SM58 Dynamic Vocal Microphones (Set of 3)",
    category: "Audio & Mics",
    code: "MIC-SHU-03",
    location: "Equipment Vault Case 4",
    condition: "Excellent",
    available: true,
    image: "https://images.unsplash.com/photo-1520523839898-507121c2762a?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "inst-7",
    name: "Yamaha MG10XU 10-Channel Mixer + XLR Cables",
    category: "PA & Mixers",
    code: "MIX-YAM-01",
    location: "Console Table AB1",
    condition: "Working",
    available: true,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80"
  }
];

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
