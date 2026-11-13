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
  CheckCircle2
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
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
                borderRadius: '14px'
              }}
            >
              {/* Event Image */}
              <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                <img 
                  src={formatImageUrl(event.image)} 
                  alt={event.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge-sky">{event.type}</span>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
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
              maxWidth: '620px',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid var(--blue-sky)',
              borderRadius: '16px',
              padding: '28px',
              maxHeight: '90vh',
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
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X className="w-4 h-4" />
            </button>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-sky">{activeModalEvent.type}</span>
              <span className={activeModalEvent.status === 'Upcoming' ? 'badge-success' : 'badge-blue'}>
                {activeModalEvent.status}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginBottom: '14px' }}>
              {activeModalEvent.name}
            </h2>

            <img 
              src={formatImageUrl(activeModalEvent.image)} 
              alt={activeModalEvent.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }} 
            />

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
