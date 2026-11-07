import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MemberProfile } from './MemberProfile';
import { MemberBands } from './MemberBands';
import { MemberBookings } from './MemberBookings';
import { MemberSlot } from './MemberSlot';
import { MemberInstruments } from './MemberInstruments';
import { AdminPanel } from './AdminPanel';
import { ContentManager } from './ContentManager';
import { 
  User, 
  Disc, 
  Clock, 
  Guitar, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  LogOut,
  FileEdit,
  UsersRound,
  BookMarked,
  Settings
} from 'lucide-react';

// Access guard shown when a regular member tries to visit an admin-only tab
const AdminGuard = () => (
  <div 
    className="glass-panel"
    style={{
      maxWidth: '520px',
      margin: '0 auto',
      padding: '48px 32px',
      textAlign: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.95)'
    }}
  >
    <div 
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f87171',
        margin: '0 auto 20px auto'
      }}
    >
      <Lock className="w-7 h-7" />
    </div>

    <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
      Administrator Access Required
    </h2>
    <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
      This console is restricted to authorized VITC Music Club Board Members and Superusers.
    </p>
  </div>
);

export const MemberDashboard = ({ subTab = 'profile', onOpenAuthModal }) => {
  const { user, isAdmin, logout } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(subTab);

  useEffect(() => {
    if (subTab) {
      setActiveSubTab(subTab);
    }
  }, [subTab]);

  // Not logged in
  if (!user) {
    return (
      <div className="container-custom" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div 
          className="glass-panel"
          style={{
            maxWidth: '560px',
            margin: '0 auto',
            padding: '44px 32px',
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.95)'
          }}
        >
          <div 
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue-sky)',
              margin: '0 auto 20px auto'
            }}
          >
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC', marginBottom: '12px' }}>
            Member Portal
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
            This section contains protected member features for verified VIT Chennai musicians to manage band rosters, book soundproof jam slots, and request instruments.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
            <button
              onClick={onOpenAuthModal}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              Sign In or Register with VIT Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tab definitions
  const memberTabs = [
    { id: 'profile',    label: 'My Profile',       icon: User },
    { id: 'bands',      label: 'My Bands',          icon: Disc },
    { id: 'bookings',   label: 'My Bookings',       icon: Clock },
    { id: 'slot',       label: 'Book a Slot',       icon: BookMarked },
    { id: 'instruments',label: 'Instrument Requests', icon: Guitar },
  ];

  const adminTabs = [
    { id: 'manage-users',       label: 'Manage Users',       icon: UsersRound },
    { id: 'manage-bands',       label: 'Manage Bands',       icon: Disc },
    { id: 'manage-bookings',    label: 'Manage Bookings',    icon: Clock },
    { id: 'manage-instruments', label: 'Manage Instruments', icon: Guitar },
    { id: 'manage-content',     label: 'Update Content',     icon: FileEdit },
  ];

  const isAdminTab = adminTabs.some(t => t.id === activeSubTab);

  const renderPanel = () => {
    // Admin-only panels — show guard if not admin
    if (isAdminTab) {
      if (!isAdmin) return <AdminGuard />;
      switch (activeSubTab) {
        case 'manage-users':
        case 'manage-bands':
        case 'manage-bookings':
        case 'manage-instruments':
          return <AdminPanel activeSection={activeSubTab} onSectionChange={setActiveSubTab} />;
        case 'manage-content':
          return <ContentManager />;
        default:
          return <AdminPanel activeSection={activeSubTab} onSectionChange={setActiveSubTab} />;
      }
    }

    // Member panels
    switch (activeSubTab) {
      case 'profile':      return <MemberProfile setActiveMemberSubTab={setActiveSubTab} />;
      case 'bands':        return <MemberBands />;
      case 'bookings':     return <MemberBookings />;
      case 'slot':         return <MemberSlot />;
      case 'instruments':  return <MemberInstruments />;
      default:             return <MemberProfile setActiveMemberSubTab={setActiveSubTab} />;
    }
  };

  return (
    <div className="container-custom" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      
      {/* Top Header */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div className="badge-sky" style={{ marginBottom: '6px' }}>
            {isAdmin ? 'ADMIN · MEMBER PORTAL' : 'CLUB MEMBER PORTAL'}
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC' }}>
            Welcome back, {user.name.split(' ')[0]}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAdmin && (
            <span style={{
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid var(--blue-border)',
              color: 'var(--blue-sky)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck className="w-3.5 h-3.5" /> Board Admin
            </span>
          )}

          <button
            onClick={logout}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '28px' }}>
        {/* Member tabs row */}
        <div 
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none'
          }}
        >
          {memberTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                style={{
                  background: isActive ? 'var(--blue-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#ffffff' : '#94A3B8',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Admin tabs row — only visible when isAdmin */}
        {isAdmin && (
          <div 
            style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginTop: '6px',
              scrollbarWidth: 'none',
              borderTop: '1px solid rgba(56,189,248,0.15)',
              paddingTop: '8px'
            }}
          >
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              color: '#4a7fd4', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              alignSelf: 'center',
              marginRight: '4px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}>
              ADMIN
            </span>
            {adminTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  style={{
                    background: isActive ? 'rgba(37, 99, 235, 0.35)' : 'rgba(37, 99, 235, 0.08)',
                    color: isActive ? '#ffffff' : '#7fb3f5',
                    border: isActive ? '1px solid rgba(56,189,248,0.5)' : '1px solid rgba(56,189,248,0.15)',
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom border */}
        <div style={{ borderBottom: '1px solid var(--blue-border)', marginTop: '2px' }} />
      </div>

      {/* Panel Content */}
      <div>
        {renderPanel()}
      </div>

    </div>
  );
};
