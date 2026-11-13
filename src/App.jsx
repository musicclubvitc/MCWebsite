import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Instructions } from './pages/Instructions';
import { Contact } from './pages/Contact';
import { Team } from './pages/Team';
import { MemberDashboard } from './pages/member/MemberDashboard';

// Normalize URL hashes (e.g. #/member-bookings or #/events) to matching tab names
const normalizeTab = (raw) => {
  if (!raw) return 'home';
  const clean = String(raw).toLowerCase().trim().replace(/^#\/?/, '').replace(/\/$/, '');
  const aliasMap = {
    'profile': 'member-profile',
    'bands': 'member-bands',
    'bookings': 'member-bookings',
    'slot': 'member-slot',
    'instruments': 'member-instruments',
    'dashboard': 'member-dashboard',
    'admin': 'manage-bookings',
    'users': 'manage-users',
    'content': 'manage-content',
  };
  return aliasMap[clean] || clean || 'home';
};

export function AppContent() {
  const [activeTab, setActiveTabState] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return normalizeTab(window.location.hash);
    }
    return 'home';
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const setActiveTab = (tab) => {
    const nextTab = normalizeTab(tab);
    setActiveTabState(nextTab);
    if (typeof window !== 'undefined') {
      if (nextTab === 'home') {
        if (window.location.hash) {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        window.location.hash = `#/${nextTab}`;
      }
    }
  };

  // Sync state when user uses browser back / forward buttons
  useEffect(() => {
    const handleHash = () => {
      const resolved = normalizeTab(window.location.hash);
      setActiveTabState(resolved);
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'events':
        return <Events setActiveTab={setActiveTab} />;
      case 'gallery':
        return <Gallery setActiveTab={setActiveTab} />;
      case 'instructions':
        return <Instructions setActiveTab={setActiveTab} />;
      case 'team':
        return <Team />;
      case 'contact':
        return <Contact />;

      // Member pages
      case 'member-dashboard':
        return <MemberDashboard subTab="profile" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'member-profile':
        return <MemberDashboard subTab="profile" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'member-bands':
        return <MemberDashboard subTab="bands" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'member-bookings':
        return <MemberDashboard subTab="bookings" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'member-slot':
        return <MemberDashboard subTab="slot" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'member-instruments':
        return <MemberDashboard subTab="instruments" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;

      // Admin-only pages (dashboard guards access internally)
      case 'manage-users':
        return <MemberDashboard subTab="manage-users" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'manage-bands':
        return <MemberDashboard subTab="manage-bands" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'manage-bookings':
        return <MemberDashboard subTab="manage-bookings" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'manage-instruments':
        return <MemberDashboard subTab="manage-instruments" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;
      case 'manage-content':
        return <MemberDashboard subTab="manage-content" onOpenAuthModal={() => setAuthModalOpen(true)} onTabChange={setActiveTab} />;

      default:
        return <Home setActiveTab={setActiveTab} onOpenAuthModal={() => setAuthModalOpen(true)} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuthModal={() => setAuthModalOpen(true)} 
      />

      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>

      <Footer setActiveTab={setActiveTab} />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ContentProvider>
  );
}
