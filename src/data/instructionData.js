import { 
  UserCheck, 
  Clock, 
  Guitar, 
  Users, 
  ShieldAlert, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  AlertTriangle, 
  Music, 
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Award,
  Key
} from 'lucide-react';

export const INSTRUCTION_ICON_OPTIONS = [
  'UserCheck',
  'Clock',
  'Guitar',
  'Users',
  'ShieldAlert',
  'BookOpen',
  'FileText',
  'HelpCircle',
  'AlertTriangle',
  'Music',
  'Sparkles',
  'Info',
  'CheckCircle2',
  'Calendar',
  'Award',
  'Key'
];

export const INSTRUCTION_ICON_MAP = {
  UserCheck,
  Clock,
  Guitar,
  Users,
  ShieldAlert,
  BookOpen,
  FileText,
  HelpCircle,
  AlertTriangle,
  Music,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Award,
  Key
};

export const getInstructionIcon = (iconName) => {
  return INSTRUCTION_ICON_MAP[iconName] || BookOpen;
};

export const DEFAULT_INSTRUCTIONS = {
  badge: "CLUB GUIDELINES",
  title: "Instructions & Rules",
  subtitle: "Standard operating rules for verified musicians regarding registration, music room slots, and equipment custody.",
  tabs: [
    {
      id: "account",
      label: "1. Account Setup",
      icon: "UserCheck",
      title: "Member Registration & Verification",
      subtitle: "Official authentication and profile activation steps for club musicians",
      actionText: "Open Member Portal",
      actionTarget: "member-dashboard",
      notice: "Club auditions are conducted every academic year right after the Freshers' Talent Hunt. Verified members receive notifications for all internal jam sessions.",
      items: [
        {
          num: "01",
          title: "Access the Member Portal",
          desc: "Click on 'Member Login' in the navigation bar to sign in or initiate registration for club membership."
        },
        {
          num: "02",
          title: "VIT Student Email Required",
          desc: "Sign up using your official institutional email (e.g. name2024@vitstudent.ac.in). External domains are restricted."
        },
        {
          num: "03",
          title: "Registration Number Validation",
          desc: "Enter your 9-character VIT registration number (e.g. 24BCE5259) and declare your primary instruments or vocal roles."
        },
        {
          num: "04",
          title: "Spam & Inbox Verification",
          desc: "Check your Outlook inbox for the confirmation email. If not visible immediately, check the Junk/Spam folder."
        },
        {
          num: "05",
          title: "Full Member Privileges Unlocked",
          desc: "Once verified, you have complete access to book soundproof slots, register official bands, and request gear."
        }
      ]
    },
    {
      id: "booking",
      label: "2. Music Room Booking",
      icon: "Clock",
      title: "Music Room & Slot Reservation",
      subtitle: "Advance reservation rules, duration limits, and studio scheduling policies",
      actionText: "Book a Practice Slot",
      actionTarget: "member-slot",
      notice: "Slot hoarding across multiple accounts of the same band is monitored by club admins and may result in temporary booking suspensions.",
      items: [
        {
          num: "01",
          title: "Advance Booking Window",
          desc: "Practice slots open up to 7 days ahead. Reservations must be requested at least 12 hours prior to practice."
        },
        {
          num: "02",
          title: "Slot Duration Limits",
          desc: "Standard rehearsal sessions are 55 to 110 minutes per band per day. Extended sessions for fests require board approval."
        },
        {
          num: "03",
          title: "Cancellation Courtesy",
          desc: "Cancel at least 4 hours ahead if your group is unable to attend to free up the room for fellow club musicians."
        },
        {
          num: "04",
          title: "Equipment Power Shutdown",
          desc: "Always switch off guitar amplifier heads, Roland synthesizers, and PA mixers immediately after your session."
        },
        {
          num: "05",
          title: "Studio Cleanliness Standard",
          desc: "Coil audio cables, return mic stands to the corner, and ensure no bottles or trash are left in the sound room."
        }
      ]
    },
    {
      id: "instruments",
      label: "3. Instrument Policy",
      icon: "Guitar",
      title: "Instrument Requisition Policy",
      subtitle: "Borrowing electric guitars, synthesizers, drum hardware, and stage audio gear",
      actionText: "Request Club Instruments",
      actionTarget: "member-instruments",
      notice: "Guitar picks, spare patch cords, drum keys, and vocal mic sanitizing wipes are available in the equipment cabinet upon request.",
      items: [
        {
          num: "01",
          title: "Verified Member Eligibility",
          desc: "Only registered club members in good standing may borrow club guitars, synthesizers, and stage hardware."
        },
        {
          num: "02",
          title: "Same-Day Return Schedule",
          desc: "Equipment borrowed for on-campus rehearsals must be returned to the music room inventory by 9:00 PM on the same day."
        },
        {
          num: "03",
          title: "External Fest Clearance",
          desc: "Taking club instruments off campus for intercollegiate fests requires written approval from the Faculty Coordinator."
        },
        {
          num: "04",
          title: "Borrower Accountability",
          desc: "Physical damage, dropped microphones, or missing power adapters will be billed to the borrower's registration number."
        },
        {
          num: "05",
          title: "Pre-Issue Cable Inspection",
          desc: "Test all guitar jacks, XLR cables, and power adapters with a club board member before signing out any equipment."
        }
      ]
    },
    {
      id: "bands",
      label: "4. Band Guidelines",
      icon: "Users",
      title: "Official Band Formation Guidelines",
      subtitle: "Roster composition limits, band leadership, and collegiate competition rules",
      actionText: "Register Your Band",
      actionTarget: "member-bands",
      notice: "Looking for musicians to complete your lineup? Drop a message in the official club WhatsApp group to connect with vocalists and instrumentalists.",
      items: [
        {
          num: "01",
          title: "Lineup Size Requirements",
          desc: "An official club band must consist of at least 3 active student musicians and cannot exceed 9 members."
        },
        {
          num: "02",
          title: "Designated Band Leader",
          desc: "Every band must designate a leader responsible for slot bookings, equipment custody, and fest coordination."
        },
        {
          num: "03",
          title: "Dual-Roster Participation",
          desc: "Musicians may participate in up to two official club bands, provided rehearsal schedules and fest competitions do not conflict."
        },
        {
          num: "04",
          title: "Credential Authentication",
          desc: "Every member in your lineup must confirm their inclusion using their registration number and secret key credential."
        },
        {
          num: "05",
          title: "Collegiate Fest Representation",
          desc: "Only approved, verified bands may officially compete under the VIT Chennai Music Club banner at national fests."
        }
      ]
    },
    {
      id: "safety",
      label: "5. Studio Etiquette",
      icon: "ShieldAlert",
      title: "Studio Etiquette & Noise Regulations",
      subtitle: "Sound isolation protocols, equipment safety, and campus curfew compliance",
      actionText: "Check Rehearsal Schedule",
      actionTarget: "member-slot",
      notice: "Failure to adhere to studio etiquette, hostel curfew, or equipment safety guidelines will result in temporary suspension of music room booking rights.",
      items: [
        {
          num: "01",
          title: "Soundproof Double Doors",
          desc: "Both acoustic doors of the music room must remain securely latched during all amplified guitar, synth, and drum sessions."
        },
        {
          num: "02",
          title: "Strict Beverage & Liquid Ban",
          desc: "Open drinks, water bottles, and tea/coffee cups are strictly prohibited on or near amplifiers, pedalboards, and synthesizers."
        },
        {
          num: "03",
          title: "Hostel In-Time Curfew",
          desc: "Evening rehearsals conclude promptly by 8:30 PM on weekdays in adherence to VIT Chennai hostel curfew guidelines."
        },
        {
          num: "04",
          title: "Acoustic Volume Calibration",
          desc: "Keep master stage amplifiers and drum monitors below 85 dB to prevent sound spill into adjacent academic blocks."
        },
        {
          num: "05",
          title: "Punctuality & Transition",
          desc: "Arrive on time, wrap up playing 5 minutes before your slot ends, and leave the rehearsal room clean for the incoming band."
        }
      ]
    }
  ]
};
