import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Disc, 
  Clock, 
  Guitar, 
  Copy, 
  Calendar, 
  Key
} from 'lucide-react';

export const MemberProfile = ({ setActiveMemberSubTab }) => {
  const { user, myBands, bookings, instrumentRequests, showToast } = useAuth();

  if (!user) return null;

  const copyField = (val, label) => {
    navigator.clipboard.writeText(val);
    showToast(`${label} copied to clipboard!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Profile Card */}
      <div 
        className="glass-panel"
        style={{
          padding: 'clamp(24px, 4vw, 36px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          alignItems: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.9)'
        }}
      >
        {/* Left: Identity info (No profile photo) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#F8FAFC', margin: 0 }}>
            {user.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-sky">{user.role}</span>
            <span className="badge-success">Verified</span>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '4px 0 0 0', lineHeight: '1.5' }}>
            Registered member of the VIT Chennai Music Club community.
          </p>
        </div>

        {/* Right: Credentials */}
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#F1F5F9', marginBottom: '14px' }}>
            Musician Identity & Credentials
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Full Name</span>
              <strong style={{ color: '#F1F5F9', fontSize: '0.9rem' }}>{user.name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Registration Number</span>
              <strong style={{ color: 'var(--blue-sky)', fontSize: '0.9rem' }}>{user.regNumber}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Student Email</span>
              <span style={{ color: '#F1F5F9', fontSize: '0.85rem' }}>{user.email}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)' }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Role in Club</span>
              <span style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>{user.role}</span>
            </div>

            {/* Secret Key with show/hide */}
            <SecretKeyRow secretKey={user.secretKey || user.id} onCopy={copyField} />

          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        <div 
          onClick={() => setActiveMemberSubTab('bands')}
          className="glass-panel glass-panel-hover"
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '10px', color: 'var(--blue-sky)' }}>
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC' }}>{myBands ? myBands.length : 0}</div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>My Bands</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveMemberSubTab('bookings')}
          className="glass-panel glass-panel-hover"
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '12px', borderRadius: '10px', color: '#60a5fa' }}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC' }}>{bookings.length}</div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Slot Bookings</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveMemberSubTab('instruments')}
          className="glass-panel glass-panel-hover"
          style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '10px', color: 'var(--blue-sky)' }}>
            <Guitar className="w-6 h-6" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#F8FAFC' }}>{instrumentRequests.length}</div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Equipment Requests</div>
          </div>
        </div>
      </div>

    </div>
  );
};

// Secret Key row with show/hide toggle
const SecretKeyRow = ({ secretKey, onCopy }) => {
  const [visible, setVisible] = React.useState(false);
  const masked = '•'.repeat(Math.min(secretKey.length, 24));

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.85rem', flexShrink: 0 }}>
        <Key style={{ width: '14px', height: '14px' }} />
        Your Key
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <span style={{ color: visible ? 'var(--blue-sky)' : '#64748B', fontSize: '0.82rem', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {visible ? secretKey : masked}
        </span>
        <button
          onClick={() => setVisible(v => !v)}
          style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid var(--blue-border)', color: 'var(--blue-sky)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {visible ? 'HIDE' : 'SHOW'}
        </button>
        {visible && (
          <button
            onClick={() => onCopy(secretKey, 'Secret Key')}
            style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
          >
            <Copy style={{ width: '13px', height: '13px' }} />
          </button>
        )}
      </div>
    </div>
  );
};
