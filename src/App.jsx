import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { Instructions } from './pages/Instructions';
import { Contact } from './pages/Contact';
import { Team } from './pages/Team';
import { MemberDashboard } from './pages/member/MemberDashboard';

export function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'events':
        return <Events setActiveTab={setActiveTab} />;
      case 'instructions':
        return <Instructions setActiveTab={setActiveTab} />;
      case 'team':
        return <Team />;
      case 'contact':
        return <Contact />;

      // Member pages
      case 'member-dashboard':
        return <MemberDashboard subTab="profile" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'member-profile':
        return <MemberDashboard subTab="profile" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'member-bands':
        return <MemberDashboard subTab="bands" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'member-bookings':
        return <MemberDashboard subTab="bookings" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'member-slot':
        return <MemberDashboard subTab="slot" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'member-instruments':
        return <MemberDashboard subTab="instruments" onOpenAuthModal={() => setAuthModalOpen(true)} />;

      // Admin-only pages (dashboard guards access internally)
      case 'manage-users':
        return <MemberDashboard subTab="manage-users" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'manage-bands':
        return <MemberDashboard subTab="manage-bands" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'manage-bookings':
        return <MemberDashboard subTab="manage-bookings" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'manage-instruments':
        return <MemberDashboard subTab="manage-instruments" onOpenAuthModal={() => setAuthModalOpen(true)} />;
      case 'manage-content':
        return <MemberDashboard subTab="manage-content" onOpenAuthModal={() => setAuthModalOpen(true)} />;

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
