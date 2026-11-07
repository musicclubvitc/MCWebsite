import React from 'react';
import { 
  Mail, 
  ArrowUp
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon } from './SocialIcons';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, #080d1a 100%)',
        borderTop: '1px solid var(--blue-border)',
        marginTop: '80px',
        padding: '50px 0 30px 0',
        position: 'relative'
      }}
    >
      <div className="container-custom">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
            alignItems: 'start'
          }}
        >
          {/* Column 1: Brand & Bio */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img 
                src="/logo.png" 
                alt="VITC Music Club Logo" 
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <span className="font-display font-bold text-lg" style={{ color: '#F8FAFC' }}>MUSIC CLUB</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--blue-sky)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  VIT Chennai
                </span>
              </div>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px', maxWidth: '440px' }}>
              Celebrating musical brilliance across genres, from classical carnatic and hindustani ragas to indie pop, jazz, and rock at Vellore Institute of Technology, Chennai.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href="https://www.instagram.com/vitcmusicclub" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--blue-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue-sky)',
                  transition: 'all 0.2s ease'
                }}
                className="glass-panel-hover"
                title="Follow on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a 
                href="https://www.youtube.com/@MusicClubVITChennai" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--blue-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue-sky)',
                  transition: 'all 0.2s ease'
                }}
                className="glass-panel-hover"
                title="Watch on YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Official Contact */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F1F5F9', marginBottom: '14px' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#CBD5E1' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, maxWidth: '400px' }}>
                There is no physical office for the club. For inquiries, auditions, or event collaborations, please reach out via our official email.
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:musicclubvitchennai@gmail.com" style={{ color: 'var(--blue-sky)', textDecoration: 'none', fontWeight: 500 }}>
                  musicclubvitchennai@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ color: '#64748B', fontSize: '0.85rem' }}>
            Copyright © 2012–2026. All Rights Reserved. Built with ❤️ for <span style={{ color: 'var(--blue-sky)', fontWeight: 600 }}>VITC Music Club</span>.
          </div>

          <button
            onClick={scrollToTop}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            title="Scroll to top of page"
          >
            <ArrowUp className="w-4 h-4 text-sky-400" />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
};
