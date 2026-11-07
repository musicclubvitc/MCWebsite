import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Equalizer } from '../components/Equalizer';
import { 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  Disc, 
  Guitar,
  Sparkles,
  Info
} from 'lucide-react';

export const Home = ({ setActiveTab, onOpenAuthModal }) => {
  const { content } = useContent();

  const site = content?.site || {};
  const stats = content?.stats || [];
  const bands = content?.bands || [];
  const about = content?.about || {};

  const [selectedBand, setSelectedBand] = useState(null);
  const activeBand = selectedBand || (bands.length > 0 ? bands[0] : null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      
      {/* 1. HERO SECTION */}
      <section 
        style={{
          position: 'relative',
          paddingTop: '48px',
          paddingBottom: '36px'
        }}
      >
        <div className="container-custom">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              alignItems: 'center',
              gap: '40px'
            }}
          >
            {/* Left Column */}
            <div style={{ textAlign: 'center' }}>

              <h1 
                className="hero-stylized-title"
                style={{
                  fontSize: 'clamp(3.2rem, 7vw, 5.6rem)',
                  marginBottom: '2px',
                  fontWeight: 700
                }}
              >
                Music Club
              </h1>

              <div 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
                  color: 'var(--blue-sky)',
                  fontWeight: 700,
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  marginBottom: '18px'
                }}
              >
                VIT Chennai
              </div>

              {/* Clean Single-Hue Equalizer */}
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <Equalizer count={14} height={38} />
              </div>

              <p 
                style={{
                  color: '#94A3B8',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  maxWidth: '520px',
                  marginBottom: '28px',
                  margin: '0 auto 28px'
                }}
              >
                {site.description || "The culmination of India's finest collegiate musicians, vocalists, and composers from classical ragas to modern rock, jazz, and metal."}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="btn-primary"
                  style={{ fontSize: '0.95rem', padding: '11px 24px' }}
                >
                  <Calendar className="w-4 h-4" />
                  Explore Events
                </button>

                <button 
                  onClick={() => setActiveTab('member-dashboard')}
                  className="btn-secondary"
                  style={{ fontSize: '0.95rem', padding: '11px 24px' }}
                >
                  <Disc className="w-4 h-4" />
                  Member Portal
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Illustration */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div 
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: '460px'
                }}
              >
                <img 
                  src="/hero-music.svg" 
                  alt="VIT Chennai Music Club Illustration"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    border: 'none',
                    outline: 'none'
                  }} 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CLUB STATS GRID */}
      <section className="container-custom">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px'
          }}
        >
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="glass-panel glass-panel-hover"
              style={{ padding: '22px 18px', textAlign: 'center' }}
            >
              <div 
                className="font-display font-bold text-blue"
                style={{ fontSize: '2.4rem', lineHeight: '1.1', marginBottom: '6px' }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '2px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                {stat.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section className="container-custom">
        <div 
          className="glass-panel"
          style={{
            padding: 'clamp(24px, 4vw, 44px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}
        >
          <div>
            <img 
              src={about.image || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"} 
              alt="About Music Club VITCC"
              style={{
                width: '100%',
                height: '340px',
                objectFit: 'cover',
                borderRadius: '14px',
                border: '1px solid var(--blue-border)'
              }} 
            />
          </div>

          <div>
            <div className="badge-sky" style={{ marginBottom: '10px' }}>
              ABOUT THE CLUB
            </div>
            
            <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC', marginBottom: '16px' }}>
              {about.title || "Where Melodies Meet Passion"}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {(about.paragraphs || []).map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setActiveTab('team')} 
                className="btn-primary"
                style={{ fontSize: '0.88rem' }}
              >
                Meet Our Board <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OFFICIAL CLUB BANDS SHOWCASE */}
      <section className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge-blue" style={{ marginBottom: '8px' }}>
            ROSTER
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC' }}>
            Official Club Bands
          </h2>
          <p style={{ color: '#94A3B8', marginTop: '6px', maxWidth: '580px', marginInline: 'auto', fontSize: '0.92rem' }}>
            Recognized performance units representing VIT Chennai across collegiate fests and campus stages.
          </p>
        </div>

        {/* Bands Selector Pills */}
        <div 
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px',
            scrollbarWidth: 'none'
          }}
        >
          {bands.map((band) => (
            <button
              key={band.id}
              onClick={() => setSelectedBand(band)}
              style={{
                background: activeBand?.id === band.id ? 'var(--blue-primary)' : 'rgba(15, 23, 42, 0.7)',
                color: activeBand?.id === band.id ? '#ffffff' : '#CBD5E1',
                border: activeBand?.id === band.id ? 'none' : '1px solid var(--blue-border)',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {band.name}
            </button>
          ))}
        </div>

        {/* Selected Band Feature Card */}
        {activeBand && (
          <div 
            className="glass-panel"
            style={{
              padding: 'clamp(20px, 3vw, 36px)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="badge-sky">{activeBand.genre}</span>
                <span className="badge-blue">{activeBand.status || 'Active Roster'}</span>
              </div>

              <h3 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
                {activeBand.name}
              </h3>

              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                {activeBand.description}
              </p>

              {/* Members Roster */}
              {activeBand.members && activeBand.members.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-sky)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Lineup ({activeBand.members.length} Members)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
                    {activeBand.members.map((m, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--blue-border)',
                          borderRadius: '8px',
                          padding: '7px 10px'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.85rem' }}>{m.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{m.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeBand.instagram && (
                <a 
                  href={activeBand.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Follow Band
                </a>
              )}
            </div>

            <div>
              <img 
                src={activeBand.image} 
                alt={activeBand.name}
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid var(--blue-border)'
                }} 
              />
            </div>
          </div>
        )}
      </section>

      {/* 5. CALL TO ACTION FOR MEMBERS */}
      <section className="container-custom">
        <div 
          className="glass-panel"
          style={{
            padding: '40px 28px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1.5px solid var(--blue-border)'
          }}
        >
          <Guitar className="w-10 h-10 text-sky-400" style={{ margin: '0 auto 14px auto' }} />
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
            Book the Music Room or Borrow Equipment
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '580px', margin: '0 auto 24px auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Verified members can reserve rehearsal hours, register band lineups, and request club guitars and synthesizers.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('member-dashboard')} 
              className="btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              Open Member Portal
            </button>
            <button 
              onClick={() => setActiveTab('instructions')} 
              className="btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Guidelines & Rules
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
