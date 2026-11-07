import React, { useState } from 'react';
import { 
  UserCheck, 
  Clock, 
  Guitar, 
  Users, 
  ShieldAlert, 
  CheckCircle2
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

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px' }}>
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
                background: isSelected ? 'var(--blue-primary)' : 'rgba(15, 23, 42, 0.7)',
                color: isSelected ? '#ffffff' : '#CBD5E1',
                border: isSelected ? 'none' : '1px solid var(--blue-border)',
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

      {/* Main Instruction Content Panels */}
      <div 
        className="glass-panel"
        style={{
          padding: 'clamp(24px, 4vw, 36px)',
          borderRadius: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)'
        }}
      >
        {/* Tab 1: Account Setup */}
        {activeTab === 'account' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--blue-sky)' }}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
                  Member Registration & Verification
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Authentication steps for club musicians</p>
              </div>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  step: "1",
                  title: "Access the Member Portal",
                  desc: "Click on 'Member Login' in the navigation bar to sign in or create an account."
                },
                {
                  step: "2",
                  title: "VIT Student Email Required",
                  desc: "Sign up using your institutional email (name2023@vitstudent.ac.in). Personal domains are restricted."
                },
                {
                  step: "3",
                  title: "Registration Number Validation",
                  desc: "Enter your 9-digit VIT registration number (e.g. 22BCE1289) and indicate your primary instrument."
                },
                {
                  step: "4",
                  title: "Spam Folder Verification",
                  desc: "If verification confirmation is not immediately visible in Outlook inbox, check the Junk/Spam folder."
                },
                {
                  step: "5",
                  title: "Unlocked Features",
                  desc: "Once verified, you have full access to schedule music room slots, register band rosters, and borrow gear."
                }
              ].map((item, idx) => (
                <li 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px 18px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--blue-border)',
                    borderRadius: '10px'
                  }}
                >
                  <span 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--blue-primary)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shrink: 0
                    }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h4 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.92rem', marginBottom: '2px' }}>
                      {item.title}
                    </h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 2: Music Room Booking */}
        {activeTab === 'booking' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--blue-sky)' }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
                  Music Room & Rehearsal Guidelines
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Governing music room practice sessions</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {[
                {
                  title: "Advance Booking",
                  desc: "Slots open up to 7 days ahead. Bookings must be made at least 12 hours prior to practice."
                },
                {
                  title: "Duration Limits",
                  desc: "Standard slot is 90 minutes per band per day. Rehearsals for official fests may extend with board approval."
                },
                {
                  title: "Cancellation",
                  desc: "Cancel at least 4 hours ahead if your group is unable to attend to free up the space for other musicians."
                },
                {
                  title: "Power & Shutdown",
                  desc: "Turn off guitar amplifier power, Roland keyboard power, and PA mixers after every session."
                }
              ].map((card, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--blue-border)',
                    borderRadius: '10px',
                    padding: '16px'
                  }}
                >
                  <h4 style={{ color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.92rem', marginBottom: '6px' }}>
                    {card.title}
                  </h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={() => setActiveTab('member-bookings')}
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                Go to Slot Bookings
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Instrument Policy */}
        {activeTab === 'instruments' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--blue-sky)' }}>
                <Guitar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
                  Instrument Requisition Policy
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Borrowing electric guitars, synthesizers, drum hardware, and stage mics</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                "Only verified club members in good standing may request instruments.",
                "Instruments borrowed for on-campus practices must be returned by 9:00 PM on the same day.",
                "External collegiate fest usage requires written confirmation from the Faculty Coordinator.",
                "Physical breakage or damage to club gear will be billed to the borrower's student registration number.",
                "Check all cables and power adapters before signing out equipment."
              ].map((rule, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.5' }}>{rule}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={() => setActiveTab('member-instruments')}
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                Request an Instrument
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Band Guidelines */}
        {activeTab === 'bands' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--blue-sky)' }}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
                  Official Band Formation Guidelines
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Lineup regulations</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--blue-border)', borderRadius: '10px', padding: '16px' }}>
                <div className="badge-sky" style={{ marginBottom: '6px' }}>Lineup Size</div>
                <h4 style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>Minimum 3 — Maximum 9 Members</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  An official club band must consist of at least 3 active student musicians and cannot exceed 9 members.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--blue-border)', borderRadius: '10px', padding: '16px' }}>
                <div className="badge-blue" style={{ marginBottom: '6px' }}>Band Representation</div>
                <h4 style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>Designated Band Leader</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Every band specifies a leader responsible for coordinating rehearsals, equipment checkout, and fest submissions.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button 
                onClick={() => setActiveTab('member-bands')}
                className="btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                Register a Band
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Studio Etiquette */}
        {activeTab === 'safety' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--blue-sky)' }}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
                  Studio Etiquette & Noise Regulations
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Music room studio regulations</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#CBD5E1', fontSize: '0.9rem' }}>
              <p>
                1. <strong>Soundproof Doors:</strong> Double doors of the music room must remain closed during all amplified electric guitar and drumkit rehearsals.
              </p>
              <p>
                2. <strong>No Open Beverages:</strong> Keep liquids away from amplifiers, pedalboards, and synthesizers at all times.
              </p>
              <p>
                3. <strong>Hostel Curfew:</strong> Rehearsals conclude promptly by 8:30 PM on weekdays in adherence to hostel regulations.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
