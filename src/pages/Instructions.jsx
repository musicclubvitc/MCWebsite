import React, { useState } from 'react';
import { 
  UserCheck, 
  Clock, 
  Guitar, 
  Users, 
  ShieldAlert, 
  CheckCircle2,
  BookOpen,
  Info,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const Instructions = ({ setActiveTab }) => {
  const [activeTab, setActiveInstructionTab] = useState('account');

  const instructionTabs = [
    { id: 'account', label: '1. Account Setup', icon: UserCheck },
    { id: 'booking', label: '2. Music Room Booking', icon: Clock },
    { id: 'instruments', label: '3. Instrument Policy', icon: Guitar },
    { id: 'bands', label: '4. Band Guidelines', icon: Users },
    { id: 'safety', label: '5. Studio Etiquette', icon: ShieldAlert }
  ];

  // Tab definitions with unified data structure
  const tabContents = {
    account: {
      icon: UserCheck,
      title: "Member Registration & Verification",
      subtitle: "Official authentication and profile activation steps for club musicians",
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
      ],
      notice: "Club auditions are conducted every academic year right after the Freshers' Talent Hunt. Verified members receive notifications for all internal jam sessions.",
      actionText: "Open Member Portal",
      actionTarget: "member-dashboard"
    },
    booking: {
      icon: Clock,
      title: "Music Room & Slot Reservation",
      subtitle: "Advance reservation rules, duration limits, and studio scheduling policies",
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
      ],
      notice: "Slot hoarding across multiple accounts of the same band is monitored by club admins and may result in temporary booking suspensions.",
      actionText: "Book a Practice Slot",
      actionTarget: "member-slot"
    },
    instruments: {
      icon: Guitar,
      title: "Instrument Requisition Policy",
      subtitle: "Borrowing electric guitars, synthesizers, drum hardware, and stage audio gear",
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
      ],
      notice: "Guitar picks, spare patch cords, drum keys, and vocal mic sanitizing wipes are available in the equipment cabinet upon request.",
      actionText: "Request Club Instruments",
      actionTarget: "member-instruments"
    },
    bands: {
      icon: Users,
      title: "Official Band Formation Guidelines",
      subtitle: "Roster composition limits, band leadership, and collegiate competition rules",
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
      ],
      notice: "Looking for musicians to complete your lineup? Drop a message in the official club WhatsApp group to connect with vocalists and instrumentalists.",
      actionText: "Register Your Band",
      actionTarget: "member-bands"
    },
    safety: {
      icon: ShieldAlert,
      title: "Studio Etiquette & Noise Regulations",
      subtitle: "Sound isolation protocols, equipment safety, and campus curfew compliance",
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
      ],
      notice: "Failure to adhere to studio etiquette, hostel curfew, or equipment safety guidelines will result in temporary suspension of music room booking rights.",
      actionText: "Check Rehearsal Schedule",
      actionTarget: "member-slot"
    }
  };

  const currentContent = tabContents[activeTab] || tabContents.account;
  const TabIcon = currentContent.icon;

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px' }}>
          <BookOpen className="w-3.5 h-3.5" />
          CLUB GUIDELINES
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          Instructions & Rules
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Standard operating rules for verified musicians regarding registration, music room slots, and equipment custody.
        </p>
      </div>

      {/* Tab Selectors */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}
      >
        {instructionTabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveInstructionTab(t.id)}
              style={{
                background: isSelected ? 'var(--blue-royal)' : 'rgba(15, 23, 42, 0.7)',
                color: isSelected ? '#ffffff' : '#CBD5E1',
                border: isSelected ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Unified Instruction Content Panel */}
      <div 
        className="glass-panel"
        style={{
          padding: 'clamp(24px, 4vw, 36px)',
          borderRadius: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Tab Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--blue-border)', paddingBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--blue-sky)' }}>
              <TabIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl md:text-2xl" style={{ color: '#F8FAFC', margin: 0 }}>
                {currentContent.title}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
                {currentContent.subtitle}
              </p>
            </div>
          </div>

          {currentContent.actionTarget && (
            <button
              onClick={() => setActiveTab(currentContent.actionTarget)}
              className="btn-primary"
              style={{ fontSize: '0.84rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {currentContent.actionText} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Unified Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {currentContent.items.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel-hover"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--blue-border)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--blue-sky)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  RULE #{item.num}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <h4 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.98rem', margin: '4px 0 0 0' }}>
                {item.title}
              </h4>

              <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Important Notice Callout Box */}
        {currentContent.notice && (
          <div 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 18px',
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid var(--blue-border)',
              borderRadius: '10px'
            }}
          >
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--blue-sky)' }}>Official Note: </strong>
              {currentContent.notice}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
