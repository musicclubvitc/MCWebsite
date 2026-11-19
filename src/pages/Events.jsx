import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Ticket, 
  Search, 
  X, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { formatImageUrl } from '../lib/imageUtils';

export const Events = ({ setActiveTab }) => {
  const { content } = useContent();
  const { showToast } = useAuth();
  
  const events = content?.events || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState({});

  const categories = ['All', 'Performances', 'Western Battle of Bands', 'Eastern Battle of Bands', 'Competition', 'Western Solo', 'Open Mic', 'Intercollege Fest'];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || 
      event.type.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesStatus = 
      selectedStatus === 'All' || 
      event.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRegister = (event) => {
    setRegisteredEvents(prev => ({ ...prev, [event.id]: true }));
    showToast(`Registered for ${event.name}! Details sent to your student email.`);
  };

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px' }}>
          <Calendar className="w-3.5 h-3.5" />
          EVENTS & SHOWCASES
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          Club Events & Concerts
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Annual battle of the bands, acoustic open mics, and inter-collegiate music fests.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div 
        className="glass-panel"
        style={{
          padding: '16px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search events, venues, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '38px', paddingBlock: '8px' }}
            />
            <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Status Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(11, 17, 32, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
            {['All', 'Upcoming', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  background: selectedStatus === status ? 'var(--blue-primary)' : 'transparent',
                  color: selectedStatus === status ? '#ffffff' : '#94A3B8',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? 'var(--blue-sky)' : '#CBD5E1',
                border: selectedCategory === cat ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <Calendar className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#F1F5F9', fontSize: '1.1rem', fontWeight: 600 }}>No events match your criteria</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px' }}>Try resetting filters or searching for other terms.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
            className="btn-secondary"
            style={{ marginTop: '16px', fontSize: '0.82rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 320px))',
            gap: '24px',
            justifyContent: 'start'
          }}
        >
          {filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="glass-panel glass-panel-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '14px',
                width: '100%',
                maxWidth: '320px'
              }}
            >
              {/* Event Poster Container (Native Aspect Ratio preserved with ambient aura) */}
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '240px', 
                  backgroundColor: '#030712', 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveModalEvent(event)}
              >
                {/* Ambient Blurred Backdrop */}
                {event.image && (
                  <div 
                    style={{
                      position: 'absolute',
                      inset: '-12px',
                      backgroundImage: `url(${formatImageUrl(event.image)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(16px) brightness(0.28)',
                      opacity: 0.85
                    }} 
                  />
                )}
                
                {/* Native Poster Image */}
                {event.image ? (
                  <img 
                    src={formatImageUrl(event.image)} 
                    alt={event.name} 
                    style={{ 
                      position: 'relative',
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                ) : (
                  <div style={{ color: '#64748B', fontSize: '0.85rem' }}>No Poster Available</div>
                )}
                
                {/* Overlay Badges */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                  <span className="badge-sky">{event.type}</span>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                  <span className={event.status === 'Upcoming' ? 'badge-success' : 'badge-blue'}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                <h3 className="font-display font-bold text-lg" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
                  {event.name}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{event.dateDisplay}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{event.venue}</span>
                  </div>

                  {event.prizePool && event.prizePool !== 'Exhibition' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Prize Pool: <strong style={{ color: '#FCD34D' }}>{event.prizePool}</strong></span>
                    </div>
                  )}
                </div>

                <p 
                  style={{ 
                    color: '#94A3B8', 
                    fontSize: '0.88rem', 
                    lineHeight: '1.5',
                    marginBottom: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {event.description}
                </p>

                {/* Footer Action */}
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--blue-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setActiveModalEvent(event)}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    View Details
                  </button>

                  {event.status === 'Upcoming' && (
                    <button
                      onClick={() => handleRegister(event)}
                      className={registeredEvents[event.id] ? "btn-ghost" : "btn-primary"}
                      style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                      disabled={registeredEvents[event.id]}
                    >
                      {registeredEvents[event.id] ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34D399' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                        </span>
                      ) : (
                        'Register'
                      )}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {activeModalEvent && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            backgroundColor: 'rgba(8, 12, 22, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveModalEvent(null)}
        >
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '720px',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid var(--blue-sky)',
              borderRadius: '16px',
              padding: 'clamp(20px, 3.5vw, 28px)',
              maxHeight: '92vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalEvent(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: '#94A3B8',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-sky">{activeModalEvent.type}</span>
              <span className={activeModalEvent.status === 'Upcoming' ? 'badge-success' : 'badge-blue'}>
                {activeModalEvent.status}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC', marginBottom: '16px' }}>
              {activeModalEvent.name}
            </h2>

            {/* Native Aspect Ratio Poster Showcase with Ambient Aura */}
            {activeModalEvent.image && (
              <div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  backgroundColor: '#020617', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--blue-border)', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '260px',
                  maxHeight: '62vh',
                  padding: '12px'
                }}
              >
                {/* Ambient glow aura */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: '-20px',
                    backgroundImage: `url(${formatImageUrl(activeModalEvent.image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(24px) brightness(0.24)',
                    opacity: 0.85
                  }} 
                />

                {/* Uncropped Native Poster */}
                <img 
                  src={formatImageUrl(activeModalEvent.image)} 
                  alt={activeModalEvent.name}
                  style={{ 
                    position: 'relative',
                    maxWidth: '100%', 
                    maxHeight: '58vh', 
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)'
                  }} 
                />

                {/* Full Resolution Link */}
                <a
                  href={formatImageUrl(activeModalEvent.image)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--blue-border)',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--blue-sky)',
                    borderRadius: '20px',
                    textDecoration: 'none'
                  }}
                  title="Open full resolution poster in a new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Full Size
                </a>
              </div>
            )}

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '14px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '0.85rem',
                border: '1px solid var(--blue-border)'
              }}
            >
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>SCHEDULE</span>
                <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{activeModalEvent.dateDisplay}</span>
              </div>

              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>VENUE</span>
                <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{activeModalEvent.venue}</span>
              </div>

              {activeModalEvent.prizePool && (
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>PRIZE POOL</span>
                  <span style={{ color: '#FCD34D', fontWeight: 600 }}>{activeModalEvent.prizePool}</span>
                </div>
              )}
            </div>

            <div style={{ color: '#CBD5E1', lineHeight: '1.6', fontSize: '0.92rem', marginBottom: '24px' }}>
              <h4 style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '6px' }}>Event Overview</h4>
              <p>{activeModalEvent.description}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setActiveModalEvent(null)} className="btn-ghost">
                Close
              </button>

              {activeModalEvent.status === 'Upcoming' && (
                <button
                  onClick={() => {
                    handleRegister(activeModalEvent);
                    setActiveModalEvent(null);
                  }}
                  className="btn-primary"
                  disabled={registeredEvents[activeModalEvent.id]}
                >
                  {registeredEvents[activeModalEvent.id] ? 'Already Registered' : 'Confirm Registration'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
