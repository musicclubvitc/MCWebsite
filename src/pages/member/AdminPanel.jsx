import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Clock, 
  Guitar, 
  Check, 
  X, 
  UsersRound, 
  Disc, 
  Trash2, 
  ChevronLeft, 
  Plus, 
  Minus,
  FileEdit
} from 'lucide-react';

const INITIAL_ADMIN_USERS = [
  { id: '1', name: 'Sarvesh C', email: 'sarvesh.c2024@vitstudent.ac.in', regNumber: '24BCE5259', role: 'Developer', type: 'Admin', verified: 'Verified', secretKey: '68ff9228ab0faf069397bb24' },
  { id: '2', name: 'Michael Dias', email: 'michael.dias2024@vitstudent.ac.in', regNumber: '24BCE5259', role: 'Creative Head', type: 'Admin', verified: 'Verified', secretKey: '6911a3522c9c7646f3f5911e' },
  { id: '3', name: 'Aarav Sharma', email: 'aarav.sharma2022@vitstudent.ac.in', regNumber: '22BCE1289', role: 'Guitarist', type: 'User', verified: 'Verified', secretKey: '68ff920169754d9fb129e4a2' },
  { id: '4', name: 'Dhivi Bommisetty', email: 'dhivi.b2024@vitstudent.ac.in', regNumber: '26BHC1062', role: 'Vocalist', type: 'User', verified: 'Unverified', secretKey: '68ff925280e2ebc5981e2330' },
  { id: '5', name: 'Aravindakshan C J', email: 'aravind.cj2024@vitstudent.ac.in', regNumber: '26MIS1138', role: 'Drummer', type: 'User', verified: 'Unverified', secretKey: '6900e3ff6657a7fe8361a944' },
  { id: '6', name: 'Shruthika P', email: 'shruthika.p2024@vitstudent.ac.in', regNumber: '26BBH1010', role: 'Keyboardist', type: 'User', verified: 'Verified', secretKey: '68ff92123456789abcdef012' },
  { id: '7', name: 'Ajay', email: 'ajay2025@vitstudent.ac.in', regNumber: '25BMV1028', role: 'Bassist', type: 'User', verified: 'Unverified', secretKey: '68ff92987654321fedcba345' },
];

const INITIAL_ADMIN_BANDS = [
  {
    id: '121',
    name: 'VantaBound',
    madeBy: 'Mervin Samuel',
    members: [
      { name: 'Mervin Samuel', reg: '25BLC1260', key: '6911a3522c9c7646f3f5911e' },
      { name: 'DHARANESH K', reg: '25BMH1209', key: '68ff920169754d9fb129e4a2' },
      { name: 'Dheeraj A', reg: '25BME1058', key: '68ff925280e2ebc5981e2330' },
      { name: 'Shyam Husain', reg: '24MIS1046', key: '6900e3ff6657a7fe8361a944' },
      { name: 'Shreyas Narayanan', reg: '24MIS1174', key: '68ff928877665544332211aa' }
    ]
  },
  { id: '122', name: 'TATVA', madeBy: 'Aditya Aryan Jha', members: [{ name: 'Aditya Aryan Jha', reg: '24BCE1120', key: '68ff9211aa' }] },
  { id: '123', name: 'High Ground', madeBy: 'Meera Sujith', members: [{ name: 'Meera Sujith', reg: '23BCE0911', key: '68ff9222bb' }] },
  { id: '124', name: 'Karnaught', madeBy: 'Jack Farrell Prabakaran', members: [{ name: 'Jack Farrell', reg: '22BCI0144', key: '68ff9233cc' }] },
  { id: '125', name: 'Bandishhh', madeBy: 'Sagarika', members: [{ name: 'Sagarika', reg: '23BCE2001', key: '68ff9244dd' }] },
  { id: '126', name: 'Requiem', madeBy: 'Soham', members: [{ name: 'Soham', reg: '24BCE1402', key: '68ff9255ee' }] },
  { id: '127', name: 'paalpacketmc', madeBy: 'Mervin Samuel', members: [{ name: 'Mervin Samuel', reg: '25BLC1260', key: '6911a3522c9c7646f3f5911e' }] },
  { id: '128', name: 'The Deccan Project', madeBy: 'Elena', members: [{ name: 'Elena', reg: '24BCE3421', key: '68ff9266ff' }] },
];

export const AdminPanel = ({ activeSection = 'manage-bookings', onSectionChange }) => {
  const { 
    bookings, 
    updateBookingStatus, 
    instrumentRequests, 
    updateInstrumentStatus, 
    toggleAdmin,
    showToast,
    user
  } = useAuth();

  const currentSection = activeSection || 'manage-bookings';

  // Users state
  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
  const [selectedUser, setSelectedUser] = useState(null);

  // Bands state
  const [adminBands, setAdminBands] = useState(INITIAL_ADMIN_BANDS);
  const [selectedBand, setSelectedBand] = useState(null);

  // Bookings state
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  // Instruments state
  const [selectedInstDetails, setSelectedInstDetails] = useState(null);

  // Reset detail sub-views whenever section changes
  useEffect(() => {
    setSelectedUser(null);
    setSelectedBand(null);
    setSelectedBookingDetails(null);
    setSelectedInstDetails(null);
  }, [activeSection]);

  const handleSectionSwitch = (secId) => {
    if (onSectionChange) {
      onSectionChange(secId);
    }
  };

  // ---------------- USER ACTIONS ----------------
  const toggleUserVerification = (userId) => {
    setAdminUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.verified === 'Verified' ? 'Unverified' : 'Verified';
        showToast(`${u.name} is now marked ${nextStatus}`);
        return { ...u, verified: nextStatus };
      }
      return u;
    }));
  };

  const handleUpdateUser = () => {
    setAdminUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    showToast(`Updated user ${selectedUser.name}`);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    showToast(`Deleted member account`, 'info');
    setSelectedUser(null);
  };

  // ---------------- BAND ACTIONS ----------------
  const handleUpdateBand = () => {
    setAdminBands(prev => prev.map(b => b.id === selectedBand.id ? selectedBand : b));
    showToast(`Updated band ${selectedBand.name}`);
    setSelectedBand(null);
  };

  const handleDeleteBand = (id) => {
    setAdminBands(prev => prev.filter(b => b.id !== id));
    showToast(`Deleted band`, 'info');
    setSelectedBand(null);
  };

  const handleRemoveBandMember = (mIdx) => {
    setSelectedBand(prev => ({
      ...prev,
      members: prev.members.filter((_, idx) => idx !== mIdx)
    }));
  };

  const handleAddBandMember = () => {
    setSelectedBand(prev => ({
      ...prev,
      members: [...prev.members, { name: '', reg: '', key: '' }]
    }));
  };

  // ---------------- BOOKING ACTIONS ----------------
  const toggleSelectAllBookings = () => {
    if (selectedBookingIds.length === bookings.length) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(bookings.map(b => b.id));
    }
  };

  const toggleSelectBooking = (id) => {
    setSelectedBookingIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteBookings = () => {
    if (selectedBookingIds.length === 0) return;
    selectedBookingIds.forEach(id => updateBookingStatus(id, 'Declined'));
    setSelectedBookingIds([]);
    showToast(`Updated/Removed ${selectedBookingIds.length} bookings`, 'info');
  };

  // Filtered bookings
  const filteredBookings = dateFilter 
    ? bookings.filter(b => b.date === dateFilter)
    : bookings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '20px 24px',
          background: 'rgba(37, 99, 235, 0.08)',
          border: '1.5px solid var(--blue-border)',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div>
            <h3 className="font-display font-bold text-lg" style={{ color: '#F8FAFC' }}>
              Superuser / Admin Console
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Manage users, registered bands, slot bookings, and gear requests
            </p>
          </div>
        </div>

        <button
          onClick={toggleAdmin}
          className="btn-ghost"
          style={{ fontSize: '0.82rem' }}
        >
          Exit Admin View
        </button>
      </div>

      {/* Navigation Sub-Tabs (Strictly Synced with Parent Dashboard) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '1px solid var(--blue-border)', paddingBottom: '8px' }}>
        {[
          { id: 'manage-users', label: 'All Users', icon: UsersRound },
          { id: 'manage-bands', label: 'All Bands', icon: Disc },
          { id: 'manage-bookings', label: 'All Bookings', icon: Clock },
          { id: 'manage-instruments', label: 'Instrument Requests', icon: Guitar },
          { id: 'manage-content', label: 'Update Content', icon: FileEdit }
        ].map(tab => {
          const Icon = tab.icon;
          const isAct = currentSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSectionSwitch(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: isAct ? 'var(--blue-primary)' : 'rgba(255,255,255,0.03)',
                color: isAct ? '#fff' : '#94A3B8',
                border: isAct ? '1px solid var(--blue-sky)' : '1px solid transparent',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===================== 1. ALL BOOKINGS ===================== */}
      {currentSection === 'manage-bookings' && (
        <div>
          {selectedBookingDetails ? (
            /* Booking Details View */
            <div className="glass-panel" style={{ padding: '32px', backgroundColor: 'rgba(15,23,42,0.95)', border: '1.5px solid var(--blue-border)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>MUSIC CLUB</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--blue-sky)', letterSpacing: '1px' }}>VIT CHENNAI</div>
                </div>
              </div>

              <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginBottom: '24px' }}>
                BOOKING DETAILS (<span style={{ color: selectedBookingDetails.status === 'Approved' ? '#22c55e' : (selectedBookingDetails.status === 'Blocked' ? '#fbbf24' : '#ef4444') }}>{selectedBookingDetails.status}</span>)
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKING DATE</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedBookingDetails.date?.split('-').reverse().join('-')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKING DAY</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedBookingDetails.day}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKING TIME</div>
                  <div style={{ color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.95rem', fontFamily: 'monospace' }}>{selectedBookingDetails.timeSlot}</div>
                </div>
              </div>

              {selectedBookingDetails.status === 'Blocked' && selectedBookingDetails.blockReason && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', color: '#fbbf24', fontSize: '0.9rem' }}>
                  <strong>Block Reason:</strong> {selectedBookingDetails.blockReason}
                </div>
              )}

              <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '12px' }}>
                Following members details for the booking:
              </p>

              <div style={{ overflowX: 'auto', marginBottom: '28px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--blue-border)', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>S.No.</th>
                      <th style={{ padding: '8px 12px' }}>Member Name</th>
                      <th style={{ padding: '8px 12px' }}>Register Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedBookingDetails.members || [
                      { name: selectedBookingDetails.bookerName || 'Sarvesh C', reg: selectedBookingDetails.bookerReg || '26BAI1141' },
                      { name: 'Dhivi Bommisetty', reg: '26BHC1062' },
                      { name: 'Aravindakshan C J', reg: '26MIS1138' },
                      { name: 'Shruthika P', reg: '26BBH1010' },
                      { name: 'Ajay', reg: '25BMV1028' }
                    ]).map((m, mIdx) => (
                      <tr key={mIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>{mIdx + 1}</td>
                        <td style={{ padding: '10px 12px', color: '#F1F5F9', fontWeight: 600 }}>{m.name}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{m.reg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Approval Audit Trail */}
              <div style={{ marginBottom: '28px', borderTop: '1px solid var(--blue-border)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Approved by</div>
                <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{user?.name || 'Michael Dias'}</div>
                <div style={{ color: 'var(--blue-sky)', fontSize: '0.82rem' }}>{user?.role || 'Creative Head'}</div>
                <div style={{ color: '#64748B', fontSize: '0.78rem' }}>November 02, 2026</div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBookingDetails.id, 'Declined');
                    setSelectedBookingDetails(null);
                  }}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            /* Bookings Table View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                  ALL BOOKINGS
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input-field"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  />
                  {dateFilter && (
                    <button onClick={() => setDateFilter('')} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '6px 10px' }}>
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleBulkDeleteBookings}
                    disabled={selectedBookingIds.length === 0}
                    style={{
                      background: selectedBookingIds.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                      border: selectedBookingIds.length > 0 ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--blue-border)',
                      color: selectedBookingIds.length > 0 ? '#f87171' : '#64748B',
                      padding: '8px 18px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: selectedBookingIds.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>
                        <input
                          type="checkbox"
                          checked={selectedBookingIds.length > 0 && selectedBookingIds.length === bookings.length}
                          onChange={toggleSelectAllBookings}
                          style={{ accentColor: 'var(--blue-sky)' }}
                        />
                      </th>
                      <th style={{ padding: '12px 10px' }}>S.No.</th>
                      <th style={{ padding: '12px 14px' }}>Name</th>
                      <th style={{ padding: '12px 14px' }}>Date ↑</th>
                      <th style={{ padding: '12px 14px' }}>Day</th>
                      <th style={{ padding: '12px 14px' }}>Time</th>
                      <th style={{ padding: '12px 14px' }}>Status ↑</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, idx) => {
                      const isChecked = selectedBookingIds.includes(b.id);
                      const isApproved = b.status === 'Approved';
                      return (
                        <tr key={b.id || idx} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectBooking(b.id)}
                              style={{ accentColor: 'var(--blue-sky)' }}
                            />
                          </td>
                          <td style={{ padding: '12px 10px', color: '#64748B' }}>{idx + 1}</td>
                          <td style={{ padding: '12px 14px', color: '#F1F5F9', fontWeight: 600 }}>{b.bookerName || 'Sarvesh C'}</td>
                          <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>{b.date?.split('-').reverse().join('-')}</td>
                          <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>{b.day}</td>
                          <td style={{ padding: '12px 14px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{b.timeSlot}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 700, color: isApproved ? '#22c55e' : (b.status === 'Blocked' ? '#fbbf24' : '#ef4444') }}>
                              {b.status}
                            </span>
                            {b.status === 'Blocked' && b.blockReason && (
                              <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '2px' }}>
                                Reason: {b.blockReason}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <button
                              onClick={() => setSelectedBookingDetails(b)}
                              className="btn-secondary"
                              style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== 2. ALL BANDS ===================== */}
      {currentSection === 'manage-bands' && (
        <div>
          {selectedBand ? (
            /* Band Edit Details View */
            <div className="glass-panel" style={{ padding: '32px', backgroundColor: 'rgba(15,23,42,0.95)', border: '1.5px solid var(--blue-border)', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                  DETAILS OF BAND "{selectedBand.name.toUpperCase()}"
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Band Name</label>
                  <input
                    type="text"
                    value={selectedBand.name}
                    onChange={(e) => setSelectedBand({ ...selectedBand, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Made By</label>
                  <input
                    type="text"
                    value={selectedBand.madeBy}
                    onChange={(e) => setSelectedBand({ ...selectedBand, madeBy: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Members List with Remove button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {selectedBand.members.map((m, mIdx) => (
                  <div key={mIdx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr auto', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Member Name"
                      value={m.name}
                      onChange={(e) => {
                        const updated = [...selectedBand.members];
                        updated[mIdx].name = e.target.value;
                        setSelectedBand({ ...selectedBand, members: updated });
                      }}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Register Number"
                      value={m.reg}
                      onChange={(e) => {
                        const updated = [...selectedBand.members];
                        updated[mIdx].reg = e.target.value;
                        setSelectedBand({ ...selectedBand, members: updated });
                      }}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Secret Key"
                      value={m.key}
                      onChange={(e) => {
                        const updated = [...selectedBand.members];
                        updated[mIdx].key = e.target.value;
                        setSelectedBand({ ...selectedBand, members: updated });
                      }}
                      className="input-field"
                      style={{ fontFamily: 'monospace' }}
                    />
                    <button
                      onClick={() => handleRemoveBandMember(mIdx)}
                      style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Remove Member
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={handleUpdateBand}
                  className="btn-primary"
                  style={{ borderRadius: '20px', padding: '8px 24px' }}
                >
                  Update
                </button>

                <button
                  onClick={handleAddBandMember}
                  className="btn-ghost"
                  style={{ borderRadius: '20px', padding: '8px 24px', borderColor: 'var(--blue-border)' }}
                >
                  Add Member
                </button>

                <button
                  onClick={() => handleDeleteBand(selectedBand.id)}
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>

            </div>
          ) : (
            /* Bands Table View */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                  ALL BANDS
                </h2>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 18px' }}>S.No.</th>
                      <th style={{ padding: '12px 18px' }}>Band Name</th>
                      <th style={{ padding: '12px 18px' }}>Made by</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminBands.map((band, idx) => (
                      <tr key={band.id} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                        <td style={{ padding: '12px 18px', color: '#64748B' }}>{band.id}</td>
                        <td style={{ padding: '12px 18px', color: '#F1F5F9', fontWeight: 600 }}>{band.name}</td>
                        <td style={{ padding: '12px 18px', color: '#CBD5E1' }}>{band.madeBy}</td>
                        <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedBand(band)}
                            className="btn-secondary"
                            style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== 3. ALL USERS ===================== */}
      {currentSection === 'manage-users' && (
        <div>
          {selectedUser ? (
            /* Member Edit Details View */
            <div className="glass-panel" style={{ padding: '32px', backgroundColor: 'rgba(15,23,42,0.95)', border: '1.5px solid var(--blue-border)', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                  EDIT MEMBER "{selectedUser.name.toUpperCase()}"
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Name</label>
                  <input
                    type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Register Number</label>
                  <input
                    type="text"
                    value={selectedUser.regNumber}
                    onChange={(e) => setSelectedUser({ ...selectedUser, regNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Student Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Secret Key</label>
                  <input
                    type="text"
                    value={selectedUser.secretKey}
                    onChange={(e) => setSelectedUser({ ...selectedUser, secretKey: e.target.value })}
                    className="input-field"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Type</label>
                  <select
                    value={selectedUser.type}
                    onChange={(e) => setSelectedUser({ ...selectedUser, type: e.target.value })}
                    className="input-field"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Role in Club</label>
                  <input
                    type="text"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Verification</label>
                  <select
                    value={selectedUser.verified}
                    onChange={(e) => setSelectedUser({ ...selectedUser, verified: e.target.value })}
                    className="input-field"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <button
                  onClick={handleUpdateUser}
                  className="btn-primary"
                  style={{ borderRadius: '20px', padding: '8px 24px' }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            /* Users Table View with 1-Click Verification */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                  ALL MEMBERS
                </h2>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>S.No.</th>
                      <th style={{ padding: '12px 14px' }}>Name</th>
                      <th style={{ padding: '12px 14px' }}>VIT Email</th>
                      <th style={{ padding: '12px 14px' }}>Register Number</th>
                      <th style={{ padding: '12px 14px' }}>Role</th>
                      <th style={{ padding: '12px 14px' }}>Type</th>
                      <th style={{ padding: '12px 14px' }}>Verification Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((u, idx) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px', color: '#F1F5F9', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '12px 14px', color: '#94A3B8' }}>{u.email}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{u.regNumber}</td>
                        <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>{u.role}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: u.type === 'Admin' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                            color: u.type === 'Admin' ? '#c084fc' : 'var(--blue-sky)'
                          }}>
                            {u.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {/* 1-Click Verification Button */}
                          <button
                            onClick={() => toggleUserVerification(u.id)}
                            title="Click to toggle member verification"
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              border: u.verified === 'Verified' ? '1px solid #10B981' : '1px solid #f59e0b',
                              background: u.verified === 'Verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: u.verified === 'Verified' ? '#34D399' : '#fbbf24',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {u.verified === 'Verified' ? (
                              <>
                                <Check className="w-3 h-3" /> Verified
                              </>
                            ) : (
                              <>
                                Verify
                              </>
                            )}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="btn-secondary"
                            style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== 4. ALL INSTRUMENT REQUESTS ===================== */}
      {currentSection === 'manage-instruments' && (
        <div>
          {selectedInstDetails ? (
            /* Instrument Request Details View */
            <div className="glass-panel" style={{ padding: '32px', backgroundColor: 'rgba(15,23,42,0.95)', border: '1.5px solid var(--blue-border)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>MUSIC CLUB</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--blue-sky)', letterSpacing: '1px' }}>VIT CHENNAI</div>
                </div>
              </div>

              <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginBottom: '24px' }}>
                INSTRUMENT REQUEST
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKING DATE</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedInstDetails.date || '22-10-2026'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKING DAY</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedInstDetails.day || 'Thursday'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKING TIME</div>
                  <div style={{ color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.95rem', fontFamily: 'monospace' }}>{selectedInstDetails.time || '06:00 AM - 09:00 PM'}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--blue-border)', marginBottom: '20px' }}>
                <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                  Dear Coordinators,<br />
                  I'm <strong>{selectedInstDetails.name || 'Manoj S'}</strong> from <strong>{selectedInstDetails.club || 'Arignar Anna Tamizh Mandram'}</strong> need the following instruments for <strong>{selectedInstDetails.purpose || 'Diwali'}</strong>.
                </p>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--blue-border)', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 12px' }}>S.No.</th>
                      <th style={{ padding: '8px 12px' }}>Instrument Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInstDetails.items || ['Keyboard', 'Drum Set']).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px', color: '#F1F5F9', fontWeight: 600 }}>{item}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '28px' }}>
                Please approve the request to borrow the instruments from the room.
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedInstDetails(null)}
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      updateInstrumentStatus(selectedInstDetails.id, 'Approved');
                      setSelectedInstDetails(null);
                    }}
                    className="btn-primary"
                    style={{ background: '#10B981', padding: '8px 20px', borderRadius: '20px' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      updateInstrumentStatus(selectedInstDetails.id, 'Rejected');
                      setSelectedInstDetails(null);
                    }}
                    style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Instrument Requests Table */
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                  ALL INSTRUMENT REQUESTS
                </h2>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>S.No.</th>
                      <th style={{ padding: '12px 14px' }}>Name</th>
                      <th style={{ padding: '12px 14px' }}>Date</th>
                      <th style={{ padding: '12px 14px' }}>Day</th>
                      <th style={{ padding: '12px 14px' }}>Time</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(instrumentRequests.length > 0 ? instrumentRequests : [
                      { id: '1', requester: 'Manoj S', date: '22-10-2026', day: 'Thursday', time: '06:00 AM - 09:00 PM', status: 'Approved', club: 'Arignar Anna Tamizh Mandram', purpose: 'Diwali', items: ['Keyboard', 'Drum Set'] }
                    ]).map((inst, idx) => (
                      <tr key={inst.id || idx} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px', color: '#F1F5F9', fontWeight: 600 }}>{inst.requester || inst.name || 'Manoj S'}</td>
                        <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>{inst.date || inst.borrowDate}</td>
                        <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>{inst.day || 'Thursday'}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{inst.time || `${inst.borrowTime} - ${inst.returnTime}`}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: inst.status === 'Approved' ? '#22c55e' : (inst.status === 'Pending' ? '#f59e0b' : '#ef4444') }}>
                          {inst.status}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedInstDetails(inst)}
                            className="btn-secondary"
                            style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
