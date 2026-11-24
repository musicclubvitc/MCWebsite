import React, { useState, useEffect, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { Equalizer } from '../components/Equalizer';
import { 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  Disc, 
  Guitar,
  Sparkles,
  Info,
  Music,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';
import { formatImageUrl } from '../lib/imageUtils';

export const Home = ({ setActiveTab, onOpenAuthModal }) => {
  const { content } = useContent();

  const site = content?.site || {};
  const stats = content?.stats || [];
  const bands = content?.bands || [];
  const about = content?.about || {};

  // Bands Infinite Peek Carousel Setup
  const bandCount = bands.length;
  const repeatMultiplier = bandCount >= 4 ? 3 : Math.max(3, Math.ceil(9 / (bandCount || 1)));

  const extendedBands = useMemo(() => {
    if (bandCount === 0) return [];
    const list = [];
    for (let r = 0; r < repeatMultiplier; r++) {
      bands.forEach((b, originalIndex) => {
        list.push({ 
          ...b, 
          __originalIndex: originalIndex, 
          __uniqueKey: `${b.id || originalIndex}-${r}` 
        });
      });
    }
    return list;
  }, [bands, repeatMultiplier, bandCount]);

  const middleSegmentStartIndex = Math.floor(repeatMultiplier / 2) * bandCount;
  const [carouselIndex, setCarouselIndex] = useState(middleSegmentStartIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  // Sync index if bands array changes
  useEffect(() => {
    setNoTransition(true);
    setCarouselIndex(middleSegmentStartIndex);
  }, [bandCount, middleSegmentStartIndex]);

  const handlePrevBand = () => {
    if (bandCount <= 1 || isTransitioning) return;
    setNoTransition(false);
    setIsTransitioning(true);
    setCarouselIndex((prev) => prev - 1);
  };

  const handleNextBand = () => {
    if (bandCount <= 1 || isTransitioning) return;
    setNoTransition(false);
    setIsTransitioning(true);
    setCarouselIndex((prev) => prev + 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    // Seamlessly normalize when stepping out of the middle segment
    if (carouselIndex < bandCount) {
      setNoTransition(true);
      setCarouselIndex(carouselIndex + bandCount);
    } else if (carouselIndex >= bandCount * (repeatMultiplier - 1)) {
      setNoTransition(true);
      setCarouselIndex(carouselIndex - bandCount);
    }
  };

  const activeRealIndex = bandCount > 0 ? ((carouselIndex % bandCount) + bandCount) % bandCount : 0;

  const handleJumpToDot = (targetRealIdx) => {
    if (isTransitioning || targetRealIdx === activeRealIndex) return;
    let diff = targetRealIdx - activeRealIndex;
    if (diff > bandCount / 2) diff -= bandCount;
    if (diff < -bandCount / 2) diff += bandCount;
    setNoTransition(false);
    setIsTransitioning(true);
    setCarouselIndex((prev) => prev + diff);
  };

  const handleCardClick = (slideIdx) => {
    if (slideIdx === carouselIndex || isTransitioning) return;
    setNoTransition(false);
    setIsTransitioning(true);
    setCarouselIndex(slideIdx);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextBand();
      } else {
        handlePrevBand();
      }
    }
    setTouchStartX(null);
  };

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
            {about.image ? (
              <img 
                src={formatImageUrl(about.image)} 
                alt="About Music Club VITCC"
                style={{
                  width: '100%',
                  height: '340px',
                  objectFit: 'cover',
                  borderRadius: '14px',
                  border: '1px solid var(--blue-border)'
                }} 
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '340px',
                  borderRadius: '14px',
                  border: '1px dashed var(--blue-border)',
                  background: 'rgba(15, 23, 42, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  color: '#64748B'
                }}
              >
                <Music className="w-10 h-10" style={{ color: 'var(--blue-sky)', opacity: 0.6 }} />
                <span style={{ fontSize: '0.88rem' }}>VIT Chennai Music Club</span>
              </div>
            )}
          </div>

          <div>
            <div className="badge-sky" style={{ marginBottom: '10px' }}>
              <Music className="w-3.5 h-3.5" />
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

      {/* 4. OFFICIAL CLUB BANDS SHOWCASE (PEEK COVERFLOW CAROUSEL) */}
      <section style={{ width: '100%', overflow: 'hidden', padding: '16px 0 24px 0' }}>
        <div className="container-custom" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="badge-sky" style={{ marginBottom: '8px' }}>
            <Disc className="w-3.5 h-3.5" />
            OFFICIAL ROSTER
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC' }}>
            Official Club Bands
          </h2>
          <p style={{ color: '#94A3B8', marginTop: '6px', maxWidth: '580px', marginInline: 'auto', fontSize: '0.92rem' }}>
            Recognized performance units representing VIT Chennai across collegiate fests and campus stages.
          </p>
        </div>

        {bands.length === 0 ? (
          <div className="container-custom">
            <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
              No official bands showcased at the moment.
            </div>
          </div>
        ) : (
          <div 
            style={{ 
              position: 'relative',
              width: '100%',
              maxWidth: '100vw',
              overflow: 'hidden',
              padding: '16px 0',
              '--card-w': 'clamp(310px, 75vw, 880px)',
              '--card-gap': '20px',
              '--idx': carouselIndex
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding Track with Physical Movement Animation */}
            <div 
              onTransitionEnd={handleTransitionEnd}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                transform: 'translateX(calc(50% - (var(--card-w) / 2) - (var(--idx) * (var(--card-w) + var(--card-gap)))))',
                transition: noTransition ? 'none' : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'transform'
              }}
            >
              {extendedBands.map((band, slideIdx) => {
                const isCenter = slideIdx === carouselIndex;
                const followLink = band.instagram || band.followUrl || band.link;

                return (
                  <div
                    key={band.__uniqueKey || slideIdx}
                    onClick={() => handleCardClick(slideIdx)}
                    style={{
                      flex: '0 0 var(--card-w)',
                      width: 'var(--card-w)',
                      marginRight: 'var(--card-gap)',
                      boxSizing: 'border-box',
                      cursor: isCenter ? 'default' : 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div 
                      className="glass-panel band-showcase-grid"
                      style={{
                        position: 'relative',
                        height: '100%',
                        minHeight: '340px',
                        padding: 'clamp(20px, 3.5vw, 36px)',
                        borderRadius: '16px',
                        backgroundColor: isCenter ? 'rgba(15, 23, 42, 0.94)' : 'rgba(15, 23, 42, 0.65)',
                        border: isCenter ? '1.5px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                        boxShadow: isCenter ? '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.15)' : 'none',
                        transform: isCenter ? 'scale(1)' : 'scale(0.92)',
                        opacity: isCenter ? 1 : 0.45,
                        filter: isCenter ? 'none' : 'brightness(0.75)',
                        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Left Column: Band Text & Details */}
                      <div className="band-showcase-text">
                        
                        {/* Genre Badge */}
                        {band.genre && (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="badge-sky">
                              <Music className="w-3 h-3" />
                              {band.genre}
                            </span>
                          </div>
                        )}

                        {/* Band Name */}
                        <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC', margin: 0, lineHeight: 1.25 }}>
                          {band.name}
                        </h2>

                        {/* Band Description */}
                        {band.description && (
                          <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                            {band.description}
                          </p>
                        )}

                        {/* Members Lineup (if available) */}
                        {Array.isArray(band.members) && band.members.length > 0 && (
                          <div style={{ marginTop: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 700, color: 'var(--blue-sky)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                              <Users className="w-3.5 h-3.5" />
                              Lineup ({band.members.length} Members)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                              {band.members.map((m, mIdx) => (
                                <div 
                                  key={mIdx}
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--blue-border)',
                                    borderRadius: '8px',
                                    padding: '6px 10px'
                                  }}
                                >
                                  <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '0.82rem' }}>{m.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{m.role}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Follow Link CTA */}
                        {followLink && (
                          <div style={{ marginTop: '6px' }}>
                            <a 
                              href={followLink}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary"
                              onClick={(e) => e.stopPropagation()}
                              style={{ fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Follow {band.name}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Band Image */}
                      <div className="band-showcase-image-col">
                        {band.image ? (
                          <div className="band-showcase-image-wrapper">
                            {/* Ambient Glow */}
                            <div 
                              style={{
                                position: 'absolute',
                                inset: '-10px',
                                backgroundImage: `url(${formatImageUrl(band.image)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'blur(20px) brightness(0.3)',
                                opacity: 0.75
                              }}
                            />
                            <img 
                              src={formatImageUrl(band.image)} 
                              alt={band.name}
                              style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }} 
                            />
                          </div>
                        ) : (
                          <div 
                            className="band-showcase-image-wrapper"
                            style={{
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px dashed var(--blue-border)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#64748B',
                              fontSize: '0.88rem',
                              boxShadow: 'none'
                            }}
                          >
                            No Photo Available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Circular Floating Arrow Navigation Buttons (Matching Reference Design) */}
            {bandCount > 1 && (
              <>
                <button
                  onClick={handlePrevBand}
                  title="Previous Band"
                  style={{
                    position: 'absolute',
                    left: 'clamp(12px, 4vw, 32px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--blue-sky)',
                    color: '#030712',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(56, 189, 248, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(56, 189, 248, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5)';
                  }}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>

                <button
                  onClick={handleNextBand}
                  title="Next Band"
                  style={{
                    position: 'absolute',
                    right: 'clamp(12px, 4vw, 32px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--blue-sky)',
                    color: '#030712',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(56, 189, 248, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(56, 189, 248, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(56, 189, 248, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5)';
                  }}
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </>
            )}

            {/* Bottom Dot Indicators */}
            {bandCount > 1 && (
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '22px'
                }}
              >
                {bands.map((b, bIdx) => (
                  <button
                    key={b.id || bIdx}
                    onClick={() => handleJumpToDot(bIdx)}
                    title={`Jump to ${b.name}`}
                    style={{
                      width: activeRealIndex === bIdx ? '28px' : '9px',
                      height: '9px',
                      borderRadius: '5px',
                      background: activeRealIndex === bIdx ? 'var(--blue-sky)' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: activeRealIndex === bIdx ? '0 0 10px rgba(56, 189, 248, 0.6)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            )}
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
