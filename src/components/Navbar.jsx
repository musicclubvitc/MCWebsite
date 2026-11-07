import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { 
  Music, 
  Calendar, 
  BookOpen, 
  Mail, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ChevronDown,
  Disc,
  Clock,
  Guitar,
  FileEdit,
  BookMarked,
  UsersRound,
  Sparkles
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenAuthModal }) => {
  const { user, isAdmin, toggleAdmin, logout } = useAuth();
  const { content } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const siteTitle = content?.site?.name || "Music Club";
  const campusTitle = content?.site?.campus || "VIT Chennai";

  const navLinks = [
    { id: 'home', label: 'Home', icon: Music },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'instructions', label: 'Instructions', icon: BookOpen },
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  // Member-level dropdown items (all logged-in users)
  const memberDropdownItems = [
    { id: 'member-profile',    label: 'My Profile',   icon: UserCheck },
    { id: 'member-bands',      label: 'My Bands',     icon: Disc },
    { id: 'member-bookings',   label: 'My Bookings',  icon: Clock },
    { id: 'member-slot',       label: 'Book a Slot',  icon: BookMarked },
  ];

  // Admin-only dropdown items
  const adminDropdownItems = [
    { id: 'manage-users',       label: 'Manage Users',       icon: UsersRound },
    { id: 'manage-bands',       label: 'Manage Bands',       icon: Disc },
    { id: 'manage-bookings',    label: 'Manage Bookings',    icon: Clock },
    { id: 'manage-instruments', label: 'Manage Instruments', icon: Guitar },
    { id: 'manage-content',     label: 'Update Content',     icon: FileEdit },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dropdownItemStyle = (id) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 14px',
    background: activeTab === id ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
    color: activeTab === id ? 'var(--blue-sky)' : '#CBD5E1',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '0.88rem',
    fontWeight: 500,
    borderRadius: '6px',
    transition: 'background 0.12s ease'
  });

  return (
    <>
      <header 
        className="glass-nav"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '12px 0'
        }}
      >
        <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflow: 'visible' }}>
          
          {/* Brand Logo & Title — fixed width, never wraps */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
              minWidth: 0
            }}
          >
            <img
              src="/logo.png"
              alt="VITC Music Club Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />

            <div style={{ flexShrink: 0 }}>
              <div 
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                  color: '#ffffff',
                  lineHeight: '1.15',
                  whiteSpace: 'nowrap'
                }}
              >
                Music Club
              </div>
              <div 
                style={{ 
                  fontSize: '0.68rem', 
                  color: 'var(--blue-sky)', 
                  fontWeight: 600, 
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.2'
                }}
              >
                VIT Chennai
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', gap: '2px', alignItems: 'center', overflow: 'hidden', flex: '1 1 auto', justifyContent: 'center' }} className="desktop-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                    color: isActive ? 'var(--blue-sky)' : '#CBD5E1',
                    padding: '7px 12px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right — Auth / User Dropdown */}
          <div style={{ display: 'none', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="desktop-actions">
            {user ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                {/* Welcome pill / trigger — no profile photo */}
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    borderRadius: '10px',
                    background: dropdownOpen ? 'rgba(56,189,248,0.1)' : 'rgba(30,41,59,0.8)',
                    border: dropdownOpen ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                    cursor: 'pointer',
                    color: '#F1F5F9',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Welcome, {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown style={{ width: '13px', height: '13px', color: '#94A3B8', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '210px',
                      background: 'rgba(11, 17, 32, 0.98)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid var(--blue-border)',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      zIndex: 9999
                    }}
                  >
                    {/* Member items */}
                    {memberDropdownItems.map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.id} style={dropdownItemStyle(item.id)} onClick={() => handleNavClick(item.id)}>
                          <Icon style={{ width: '15px', height: '15px', flexShrink: 0, opacity: 0.7 }} />
                          {item.label}
                        </button>
                      );
                    })}

                    {/* Admin-only section */}
                    {isAdmin && (
                      <>
                        <div style={{ height: '1px', background: 'var(--blue-border)', margin: '6px 4px' }} />
                        <div style={{ padding: '4px 10px 4px', fontSize: '0.68rem', fontWeight: 700, color: '#4a7fd4', letterSpacing: '1px', textTransform: 'uppercase' }}>
                          Admin
                        </div>
                        {adminDropdownItems.map(item => {
                          const Icon = item.icon;
                          return (
                            <button key={item.id} style={dropdownItemStyle(item.id)} onClick={() => handleNavClick(item.id)}>
                              <Icon style={{ width: '15px', height: '15px', flexShrink: 0, opacity: 0.7 }} />
                              {item.label}
                            </button>
                          );
                        })}
                      </>
                    )}

                    <div style={{ height: '1px', background: 'var(--blue-border)', margin: '6px 4px' }} />

                    {/* Toggle admin */}
                    <button
                      onClick={() => { toggleAdmin(); setDropdownOpen(false); }}
                      style={{ ...dropdownItemStyle('__admin-toggle'), color: isAdmin ? 'var(--blue-sky)' : '#94A3B8' }}
                    >
                      <ShieldCheck style={{ width: '15px', height: '15px', flexShrink: 0, opacity: 0.7 }} />
                      {isAdmin ? 'Exit Admin Mode' : 'Switch to Admin Mode'}
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      style={{ ...dropdownItemStyle('__logout'), color: '#f87171' }}
                    >
                      <LogOut style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 20px', borderRadius: '20px' }}
              >
                Member Portal / Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user && (
              <button
                onClick={() => handleNavClick('member-dashboard')}
                className="btn-primary"
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                Portal
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid var(--blue-border)',
                color: 'var(--blue-sky)',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(11, 17, 32, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              <span className="font-display font-bold text-lg text-white">VITC MUSIC CLUB</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--blue-border)',
                color: '#CBD5E1',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
              PAGES
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: isActive ? '1px solid var(--blue-sky)' : '1px solid rgba(255, 255, 255, 0.04)',
                    color: isActive ? 'var(--blue-sky)' : '#F1F5F9',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </div>

          {/* Member Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--blue-border)' }}>

            {user ? (
              <>
                {/* User info card (No profile photo) */}
                <div 
                  className="glass-panel"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}
                >
                  <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '1rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--blue-sky)' }}>{user.regNumber} • {user.role}</div>
                </div>

                {/* Member items */}
                <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '4px 0' }}>
                  MY ACCOUNT
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {memberDropdownItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className="btn-ghost"
                        style={{ padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }}
                      >
                        <Icon className="w-4 h-4" style={{ color: 'var(--blue-sky)' }} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Admin items — only if admin */}
                {isAdmin && (
                  <>
                    <div style={{ fontSize: '0.72rem', color: '#4a7fd4', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', margin: '8px 0 4px' }}>
                      ADMIN TOOLS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {adminDropdownItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className="btn-ghost"
                            style={{ padding: '10px', fontSize: '0.82rem', justifyContent: 'center', borderColor: 'rgba(56,189,248,0.2)' }}
                          >
                            <Icon className="w-4 h-4" style={{ color: '#60a5fa' }} />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <button
                  onClick={() => { toggleAdmin(); setMobileMenuOpen(false); }}
                  className="btn-ghost"
                  style={{
                    marginTop: '8px',
                    borderColor: isAdmin ? 'var(--blue-sky)' : undefined,
                    color: isAdmin ? '#38bdf8' : undefined,
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isAdmin ? 'Exit Admin Mode' : 'Switch to Admin Mode'}
                </button>

                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    marginTop: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  MEMBER PORTAL
                </div>
                <button
                  onClick={() => { onOpenAuthModal(); setMobileMenuOpen(false); }}
                  className="btn-primary"
                  style={{ justifyContent: 'center', padding: '10px' }}
                >
                  Member Login / Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
};
