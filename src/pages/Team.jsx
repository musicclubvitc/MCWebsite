import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { TEAM_SESSIONS } from '../data/clubData';
import { 
  Users, 
  Music,
  User
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '../components/SocialIcons';
import { formatImageUrl } from '../lib/imageUtils';

export const Team = () => {
  const { content } = useContent();
  const allSessions = content?.team || TEAM_SESSIONS;

  const sessionKeys = Object.keys(allSessions);
  const [selectedSession, setSelectedSession] = useState(sessionKeys[0] || "2024-25");

  const currentMembers = allSessions[selectedSession] || [];

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px' }}>
          CLUB COMMITTEE
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          The Core Board
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '580px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          The students orchestrating events, directing sound production, and driving the music culture at VIT Chennai.
        </p>
      </div>

      {/* Tenure Selector Pills */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}
      >
        {sessionKeys.map((sess) => (
          <button
            key={sess}
            onClick={() => setSelectedSession(sess)}
            style={{
              background: selectedSession === sess ? 'var(--blue-primary)' : 'rgba(15, 23, 42, 0.7)',
              color: selectedSession === sess ? '#ffffff' : '#CBD5E1',
              border: selectedSession === sess ? 'none' : '1px solid var(--blue-border)',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Tenure {sess}
          </button>
        ))}
      </div>

      {/* Team Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}
      >
        {currentMembers.length === 0 ? (
          <div 
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '64px 20px',
              borderRadius: '16px',
              border: '1px dashed var(--blue-border)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)'
            }}
          >
            <Users className="w-12 h-12" style={{ color: 'var(--blue-sky)', margin: '0 auto 14px auto', opacity: 0.5 }} />
            <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC', marginBottom: '8px' }}>
              Tenure {selectedSession} Board Not Announced
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
              The core board details and council roster for this tenure will be announced soon.
            </p>
          </div>
        ) : (
          currentMembers.map((member, idx) => (
            <div 
              key={idx}
              className="glass-panel glass-panel-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '28px 20px',
                borderRadius: '16px'
              }}
            >
              {/* Member Photo (Allow photos, leave blank if not provided) */}
              {member.image ? (
                <img 
                  src={formatImageUrl(member.image)} 
                  alt={member.name}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--blue-border)',
                    marginBottom: '14px',
                    backgroundColor: 'rgba(30, 41, 59, 0.6)'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div 
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    border: '2px dashed rgba(56, 189, 248, 0.3)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                    color: '#64748B'
                  }}
                  title="Photo to be uploaded"
                >
                  <User className="w-10 h-10" style={{ color: '#64748B', opacity: 0.5 }} />
                </div>
              )}

              {/* Top Designation Pill */}
              <div className="badge-sky" style={{ marginBottom: '14px' }}>
                {member.role}
              </div>

              {/* Name */}
              <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC', marginBottom: '8px' }}>
                {member.name}
              </h3>

              {/* Instrument tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--blue-sky)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
                <Music className="w-4 h-4 shrink-0" />
                <span>{member.instrument}</span>
              </div>

              {/* Social Links */}
              <div 
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--blue-border)',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#94A3B8' }}
                    title="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}

                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#94A3B8' }}
                    title="LinkedIn"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
