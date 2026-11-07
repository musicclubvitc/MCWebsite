import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, testSupabaseTables } from '../../lib/supabase';
import { BookingPrintSlip } from '../../components/BookingPrintSlip';
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
  FileEdit,
  Database,
  RefreshCw,
  Printer,
  Package,
  Search,
  Edit3
} from 'lucide-react';

export const AdminPanel = ({ activeSection = 'manage-bookings', onSectionChange }) => {
  const { 
    bookings, 
    updateBookingStatus, 
    deleteBooking,
    instrumentRequests, 
    updateInstrumentStatus, 
    deleteInstrumentRequest,
    instruments,
    addInstrument,
    updateInstrument,
    deleteInstrument,
    toggleAdmin,
    showToast,
    user,
    allUsers,
    verifyMember,
    updateAdminUser,
    deleteAdminUser,
    bands,
    updateAdminBand,
    deleteAdminBand,
    refreshAllLiveData
  } = useAuth();

  const currentSection = activeSection || 'manage-bookings';

  // Selected item states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBand, setSelectedBand] = useState(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [selectedInstIds, setSelectedInstIds] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedInstDetails, setSelectedInstDetails] = useState(null);
  const [printBooking, setPrintBooking] = useState(null);

  // Gear Inventory Management States
  const [gearSubTab, setGearSubTab] = useState('inventory'); // 'inventory' | 'requests'
  const [gearSearch, setGearSearch] = useState('');
  const [gearCategory, setGearCategory] = useState('All');
  const [showAddGearModal, setShowAddGearModal] = useState(false);
  const [editingGear, setEditingGear] = useState(null);
  const [gearForm, setGearForm] = useState({
    name: '',
    category: 'Electric Guitar',
    code: '',
    location: 'Music Room',
    condition: 'Excellent',
    available: true,
    image: ''
  });

  // Supabase Diagnostics
  const [diagRunning, setDiagRunning] = useState(false);
  const [diagResults, setDiagResults] = useState(null);

  const runDiagnostics = async () => {
    setDiagRunning(true);
    try {
      const res = await testSupabaseTables();
      setDiagResults(res);
      if (res.configured) {
        showToast("Database test complete! Check table status below.");
        if (refreshAllLiveData) await refreshAllLiveData();
      } else {
        showToast("Supabase not detected in build.", "error");
      }
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDiagRunning(false);
    }
  };

  // Reset detail sub-views whenever section changes
  useEffect(() => {
    setSelectedUser(null);
    setSelectedBand(null);
    setSelectedBookingDetails(null);
    setSelectedInstDetails(null);
    setSelectedBookingIds([]);
    setSelectedInstIds([]);
  }, [activeSection]);

  // ---------------- USER ACTIONS ----------------
  const toggleUserVerification = (userIdOrReg) => {
    verifyMember(userIdOrReg);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    updateAdminUser(selectedUser);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    deleteAdminUser(id);
    setSelectedUser(null);
  };

  // ---------------- BAND ACTIONS ----------------
  const handleUpdateBand = () => {
    if (!selectedBand) return;
    updateAdminBand(selectedBand);
    setSelectedBand(null);
  };

  const handleDeleteBand = (id) => {
    deleteAdminBand(id);
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
      members: [...(prev.members || []), { name: '', reg: '', key: '' }]
    }));
  };

  // ---------------- BOOKING ACTIONS ----------------
  const toggleSelectAllBookings = () => {
    if (selectedBookingIds.length === filteredBookings.length) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(filteredBookings.map(b => b.id));
    }
  };

  const toggleSelectBooking = (id) => {
    setSelectedBookingIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteBookings = () => {
    if (selectedBookingIds.length === 0) return;
    selectedBookingIds.forEach(id => {
      if (deleteBooking) deleteBooking(id);
    });
    setSelectedBookingIds([]);
    showToast(`Deleted ${selectedBookingIds.length} booking(s)`, 'info');
  };

  // ---------------- INSTRUMENT ACTIONS ----------------
  const toggleSelectAllInst = () => {
    if (selectedInstIds.length === instrumentRequests.length) {
      setSelectedInstIds([]);
    } else {
      setSelectedInstIds(instrumentRequests.map(r => r.id));
    }
  };

  const toggleSelectInst = (id) => {
    setSelectedInstIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteInst = () => {
    if (selectedInstIds.length === 0) return;
    selectedInstIds.forEach(id => {
      if (deleteInstrumentRequest) deleteInstrumentRequest(id);
    });
    setSelectedInstIds([]);
  };

  // Filter bookings by date
  const filteredBookings = dateFilter
    ? bookings.filter(b => b.date === dateFilter)
    : bookings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Superuser Status Banner */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 className="font-display font-bold text-lg" style={{ color: '#F8FAFC' }}>
                Superuser / Admin Console
              </h3>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: isSupabaseConfigured ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)',
                color: isSupabaseConfigured ? '#4ade80' : '#facc15',
                border: isSupabaseConfigured ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(234,179,8,0.3)'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSupabaseConfigured ? '#22c55e' : '#eab308' }} />
                {isSupabaseConfigured ? 'Supabase Connected' : 'Demo / Offline Mode'}
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '2px' }}>
              Manage users, registered bands, slot bookings, gear requests & database sync
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={runDiagnostics}
            disabled={diagRunning}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${diagRunning ? 'animate-spin' : ''}`} />
            {diagRunning ? 'Testing DB...' : 'Test Database Tables'}
          </button>
        </div>
      </div>

      {/* Database Diagnostic Results Card (if tested) */}
      {diagResults && (
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--blue-border)', background: 'rgba(15,23,42,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#F8FAFC' }}>
              Database Tables Status:
            </span>
            <button onClick={() => setDiagResults(null)} className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>Dismiss</button>
          </div>
          {diagResults.configured ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
              {Object.entries(diagResults.results || {}).map(([tbl, res]) => (
                <div key={tbl} style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: res.ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: res.ok ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#E2E8F0', fontFamily: 'monospace' }}>{tbl}</span>
                  <span style={{ color: res.ok ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                    {res.ok ? `${res.rows} rows` : 'Error'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#facc15', fontSize: '0.85rem' }}>
              ⚠️ Netlify environment variables were not available when the current deployment was built.
              <br />
              <strong>Fix:</strong> In Netlify, navigate to <strong>Deploys &gt; Trigger deploy &gt; Clear cache and deploy site</strong>.
            </div>
          )}
        </div>
      )}

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
                    {(
                      (selectedBookingDetails.membersInfo && selectedBookingDetails.membersInfo.length > 0)
                        ? selectedBookingDetails.membersInfo
                        : (selectedBookingDetails.bookerName ? [{ name: selectedBookingDetails.bookerName, reg: selectedBookingDetails.bookerReg || '—' }] : [])
                    ).map((m, mIdx) => (
                      <tr key={mIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '10px 12px', color: '#64748B' }}>{mIdx + 1}</td>
                        <td style={{ padding: '10px 12px', color: '#F1F5F9', fontWeight: 600 }}>{m.name || m.memberName}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{m.reg || m.registerNumber || m.regNumber || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={() => setSelectedBookingDetails(null)}
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setPrintBooking(selectedBookingDetails)}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <Printer className="w-4 h-4" /> Print Booking Pass (PDF)
                  </button>
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBookingDetails.id, 'Declined');
                      setSelectedBookingDetails(null);
                    }}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    Decline Booking
                  </button>
                  <button
                    onClick={() => {
                      deleteBooking(selectedBookingDetails.id);
                      setSelectedBookingDetails(null);
                    }}
                    style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    Delete Permanently
                  </button>
                </div>
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
                    DELETE ({selectedBookingIds.length})
                  </button>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedBookingIds.length > 0 && selectedBookingIds.length === filteredBookings.length}
                          onChange={toggleSelectAllBookings}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '12px 14px' }}>S.No.</th>
                      <th style={{ padding: '12px 14px' }}>Date</th>
                      <th style={{ padding: '12px 14px' }}>Day</th>
                      <th style={{ padding: '12px 14px' }}>Slot</th>
                      <th style={{ padding: '12px 14px' }}>Mode</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                          No slot bookings recorded yet.
                        </td>
                      </tr>
                    ) : filteredBookings.map((b, idx) => {
                      const isSel = selectedBookingIds.includes(b.id);
                      return (
                        <tr key={b.id} style={{ borderBottom: '1px solid var(--blue-border)', background: isSel ? 'rgba(37, 99, 235, 0.1)' : (idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent') }}>
                          <td style={{ padding: '12px 14px' }}>
                            <input
                              type="checkbox"
                              checked={isSel}
                              onChange={() => toggleSelectBooking(b.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748B' }}>{idx + 1}</td>
                          <td style={{ padding: '12px 14px', color: '#F1F5F9', fontWeight: 600 }}>{b.date?.split('-').reverse().join('-')}</td>
                          <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>{b.day}</td>
                          <td style={{ padding: '12px 14px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{b.timeSlot}</td>
                          <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>
                            {b.bookingMode || 'Self'}
                            {b.bandName && <span style={{ color: 'var(--blue-sky)', marginLeft: '6px' }}>({b.bandName})</span>}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: b.status === 'Approved' ? 'rgba(34, 197, 94, 0.15)' : (b.status === 'Blocked' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                              color: b.status === 'Approved' ? '#22c55e' : (b.status === 'Blocked' ? '#fbbf24' : '#ef4444')
                            }}>
                              {b.status}
                            </span>
                            {b.blockReason && (
                              <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '2px' }}>
                                Reason: {b.blockReason}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={() => setPrintBooking(b)}
                                style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                                title="Print Booking Pass / PDF"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedBookingDetails(b)}
                                className="btn-secondary"
                                style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                              >
                                Details
                              </button>
                              <button
                                onClick={() => deleteBooking(b.id)}
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                                title="Delete booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                  DETAILS OF BAND "{(selectedBand.name || '').toUpperCase()}"
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Band Name</label>
                  <input
                    type="text"
                    value={selectedBand.name || ''}
                    onChange={(e) => setSelectedBand({ ...selectedBand, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '4px' }}>Made By / Leader</label>
                  <input
                    type="text"
                    value={selectedBand.madeBy || selectedBand.leader || ''}
                    onChange={(e) => setSelectedBand({ ...selectedBand, madeBy: e.target.value, leader: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Members List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {(selectedBand.members || []).map((m, mIdx) => (
                  <div key={mIdx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.5fr auto', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Member Name"
                      value={m.name || ''}
                      onChange={(e) => {
                        const updated = [...selectedBand.members];
                        updated[mIdx].name = e.target.value;
                        setSelectedBand({ ...selectedBand, members: updated });
                      }}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Register Number"
                      value={m.reg || ''}
                      onChange={(e) => {
                        const updated = [...selectedBand.members];
                        updated[mIdx].reg = e.target.value;
                        setSelectedBand({ ...selectedBand, members: updated });
                      }}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                    />
                    <input
                      type="text"
                      placeholder="Secret Key"
                      value={m.key || ''}
                      onChange={(e) => {
                        const updated = [...selectedBand.members];
                        updated[mIdx].key = e.target.value;
                        setSelectedBand({ ...selectedBand, members: updated });
                      }}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                    />
                    <button
                      onClick={() => handleRemoveBandMember(mIdx)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={handleUpdateBand}
                  className="btn-primary"
                  style={{ borderRadius: '20px', padding: '8px 24px' }}
                >
                  Update Band
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
                  Delete Band
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
                      <th style={{ padding: '12px 18px' }}>Genre</th>
                      <th style={{ padding: '12px 18px' }}>Made by</th>
                      <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bands.map((band, idx) => (
                      <tr key={band.id} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                        <td style={{ padding: '12px 18px', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '12px 18px', color: '#F1F5F9', fontWeight: 600 }}>{band.name}</td>
                        <td style={{ padding: '12px 18px', color: '#94A3B8' }}>{band.genre || 'Rock'}</td>
                        <td style={{ padding: '12px 18px', color: '#CBD5E1' }}>{band.madeBy || band.leader}</td>
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
                    value={selectedUser.secretKey || ''}
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
                  Save Profile
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete Member
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
                    {allUsers.map((u, idx) => (
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
                          {/* 1-Click Verification Toggle Button */}
                          <button
                            onClick={() => toggleUserVerification(u.id)}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              border: u.verified === 'Verified' ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                              background: u.verified === 'Verified' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: u.verified === 'Verified' ? '#4ade80' : '#f87171'
                            }}
                          >
                            {u.verified === 'Verified' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            {u.verified}
                          </button>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="btn-secondary"
                            style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                          >
                            Edit
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

      {/* ===================== 4. INSTRUMENTS & GEAR MANAGEMENT ===================== */}
      {currentSection === 'manage-instruments' && (
        <div>
          {/* Sub Navigation: Inventory vs Requisitions */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setGearSubTab('inventory'); setSelectedInstDetails(null); }}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: gearSubTab === 'inventory' ? 'var(--blue-royal)' : 'rgba(255,255,255,0.04)',
                color: gearSubTab === 'inventory' ? '#ffffff' : '#94A3B8',
                border: gearSubTab === 'inventory' ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Package className="w-4 h-4" /> Club Gear Inventory ({instruments.length})
            </button>
            <button
              onClick={() => { setGearSubTab('requests'); setSelectedInstDetails(null); }}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: gearSubTab === 'requests' ? 'var(--blue-royal)' : 'rgba(255,255,255,0.04)',
                color: gearSubTab === 'requests' ? '#ffffff' : '#94A3B8',
                border: gearSubTab === 'requests' ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Guitar className="w-4 h-4" /> Member Requisitions ({instrumentRequests.length})
            </button>
          </div>

          {/* SUB-VIEW 1: LIVE GEAR INVENTORY */}
          {gearSubTab === 'inventory' && (
            <div>
              {/* Header & Add Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                    CLUB GEAR & INSTRUMENT INVENTORY
                  </h2>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '2px' }}>
                    Live equipment catalog stored in Supabase, available for verified musicians to borrow
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingGear(null);
                    setGearForm({
                      name: '',
                      category: 'Electric Guitar',
                      code: `GEAR-${Math.floor(100 + Math.random() * 900)}`,
                      location: 'Music Room',
                      condition: 'Excellent',
                      available: true,
                      image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=400&q=80'
                    });
                    setShowAddGearModal(true);
                  }}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px', borderRadius: '20px', fontSize: '0.85rem' }}
                >
                  <Plus className="w-4 h-4" /> Add New Equipment
                </button>
              </div>

              {/* Filters row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
                  <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search gear by name or code..."
                    value={gearSearch}
                    onChange={(e) => setGearSearch(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '36px', paddingBlock: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <select
                  value={gearCategory}
                  onChange={(e) => setGearCategory(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', paddingBlock: '8px', fontSize: '0.85rem' }}
                >
                  <option value="All">All Categories ({instruments.length})</option>
                  <option value="Electric Guitar">Electric Guitars</option>
                  <option value="Acoustic Guitar">Acoustic Guitars</option>
                  <option value="Bass Guitar">Bass Guitars</option>
                  <option value="Keyboards & Synth">Keyboards & Synth</option>
                  <option value="Drums & Percussion">Drums & Percussion</option>
                  <option value="Audio & Mics">Audio & Microphones</option>
                  <option value="PA & Mixers">PA & Mixers</option>
                  <option value="Other">Other Gear</option>
                </select>
              </div>

              {/* Equipment Grid */}
              {(() => {
                const filteredGear = instruments.filter(inst => {
                  const matchSearch = (inst.name || '').toLowerCase().includes(gearSearch.toLowerCase()) ||
                                      (inst.code || '').toLowerCase().includes(gearSearch.toLowerCase()) ||
                                      (inst.location || '').toLowerCase().includes(gearSearch.toLowerCase());
                  const matchCat = gearCategory === 'All' || inst.category === gearCategory;
                  return matchSearch && matchCat;
                });

                if (filteredGear.length === 0) {
                  return (
                    <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center', borderRadius: '12px' }}>
                      <Package className="w-12 h-12 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
                      <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1.1rem' }}>No equipment found in inventory</h3>
                      <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
                        Click <strong>"+ Add New Equipment"</strong> above to populate the club's gear catalog.
                      </p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {filteredGear.map(item => (
                      <div
                        key={item.id}
                        className="glass-panel"
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: '1px solid var(--blue-border)',
                          background: 'rgba(15,23,42,0.85)'
                        }}
                      >
                        <div>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: '0.98rem' }}>{item.name}</div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--blue-sky)', fontFamily: 'monospace', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                              {item.code}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>
                            📂 <strong>{item.category}</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>
                            📍 {item.location || 'Music Room'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '12px' }}>
                            Condition: <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{item.condition || 'Good'}</span>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button
                            onClick={() => updateInstrument(item.id, { available: !item.available })}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: item.available ? '1px solid #22c55e' : '1px solid #f59e0b',
                              background: item.available ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                              color: item.available ? '#4ade80' : '#fbbf24'
                            }}
                            title="Click to toggle availability"
                          >
                            {item.available ? '✓ Available' : '⏳ In Use'}
                          </button>

                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setEditingGear(item);
                                setGearForm({
                                  name: item.name,
                                  category: item.category,
                                  code: item.code,
                                  location: item.location || 'Music Room',
                                  condition: item.condition || 'Good',
                                  available: item.available !== false,
                                  image: item.image || ''
                                });
                                setShowAddGearModal(true);
                              }}
                              className="btn-ghost"
                              style={{ padding: '6px', borderRadius: '8px' }}
                              title="Edit equipment"
                            >
                              <Edit3 className="w-4 h-4 text-sky-400" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${item.name} from club inventory?`)) {
                                  deleteInstrument(item.id);
                                }
                              }}
                              className="btn-ghost"
                              style={{ padding: '6px', borderRadius: '8px' }}
                              title="Delete equipment"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* SUB-VIEW 2: MEMBER REQUISITION REQUESTS */}
          {gearSubTab === 'requests' && (
            <div>
              {selectedInstDetails ? (
                /* Instrument Requisition Details View */
                <div className="glass-panel" style={{ padding: '32px', backgroundColor: 'rgba(15,23,42,0.95)', border: '1.5px solid var(--blue-border)', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>MUSIC CLUB</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--blue-sky)', letterSpacing: '1px' }}>VIT CHENNAI</div>
                    </div>
                  </div>

                  <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC', marginBottom: '24px' }}>
                    REQUISITION FOR {selectedInstDetails.instrumentName?.toUpperCase()}
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>REQUEST ID</div>
                      <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedInstDetails.id}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>GEAR CODE</div>
                      <div style={{ color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.95rem', fontFamily: 'monospace' }}>{selectedInstDetails.instrumentCode}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>REQUESTER</div>
                      <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedInstDetails.requester} ({selectedInstDetails.regNumber})</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>CURRENT STATUS</div>
                      <div style={{ color: selectedInstDetails.status === 'Approved' ? '#22c55e' : (selectedInstDetails.status === 'Pending' ? '#fbbf24' : '#38bdf8'), fontWeight: 700, fontSize: '0.95rem' }}>
                        {selectedInstDetails.status}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--blue-border)', marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '4px' }}>Borrow Schedule & Purpose</div>
                    <div style={{ color: '#F8FAFC', fontSize: '0.9rem', marginBottom: '6px' }}>
                      <strong>Borrow:</strong> {selectedInstDetails.borrowDate} @ {selectedInstDetails.borrowTime || '17:00'} | <strong>Return:</strong> {selectedInstDetails.returnDate} @ {selectedInstDetails.returnTime || '10:00'}
                    </div>
                    <div style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
                      <strong>Purpose:</strong> {selectedInstDetails.purpose}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedInstDetails(null)}
                      className="btn-ghost"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {selectedInstDetails.status !== 'Approved' && (
                        <button
                          onClick={() => {
                            updateInstrumentStatus(selectedInstDetails.id, 'Approved');
                            setSelectedInstDetails(null);
                          }}
                          className="btn-primary"
                          style={{ padding: '8px 20px', borderRadius: '20px' }}
                        >
                          Approve Request
                        </button>
                      )}
                      {selectedInstDetails.status === 'Approved' && (
                        <button
                          onClick={() => {
                            updateInstrumentStatus(selectedInstDetails.id, 'Returned');
                            setSelectedInstDetails(null);
                          }}
                          className="btn-secondary"
                          style={{ padding: '8px 20px', borderRadius: '20px', color: '#38bdf8' }}
                        >
                          Mark Returned
                        </button>
                      )}
                      <button
                        onClick={() => {
                          updateInstrumentStatus(selectedInstDetails.id, 'Rejected');
                          setSelectedInstDetails(null);
                        }}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          deleteInstrumentRequest(selectedInstDetails.id);
                          setSelectedInstDetails(null);
                        }}
                        style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Instrument Requests Table View with Checkboxes & Bulk Delete */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                      GEAR REQUISITION REQUESTS
                    </h2>

                    <button
                      onClick={handleBulkDeleteInst}
                      disabled={selectedInstIds.length === 0}
                      style={{
                        background: selectedInstIds.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                        border: selectedInstIds.length > 0 ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--blue-border)',
                        color: selectedInstIds.length > 0 ? '#f87171' : '#64748B',
                        padding: '8px 18px',
                        borderRadius: '20px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: selectedInstIds.length > 0 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      DELETE ({selectedInstIds.length})
                    </button>
                  </div>

                  <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 14px', width: '40px' }}>
                            <input
                              type="checkbox"
                              checked={selectedInstIds.length > 0 && selectedInstIds.length === instrumentRequests.length}
                              onChange={toggleSelectAllInst}
                              style={{ cursor: 'pointer' }}
                            />
                          </th>
                          <th style={{ padding: '12px 16px' }}>Req ID</th>
                          <th style={{ padding: '12px 16px' }}>Instrument</th>
                          <th style={{ padding: '12px 16px' }}>Code</th>
                          <th style={{ padding: '12px 16px' }}>Borrow Date</th>
                          <th style={{ padding: '12px 16px' }}>Requester</th>
                          <th style={{ padding: '12px 16px' }}>Status</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instrumentRequests.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                              No gear requisition requests found in database.
                            </td>
                          </tr>
                        ) : instrumentRequests.map((req, idx) => {
                          const isSel = selectedInstIds.includes(req.id);
                          return (
                            <tr key={req.id} style={{ borderBottom: '1px solid var(--blue-border)', background: isSel ? 'rgba(37, 99, 235, 0.1)' : (idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent') }}>
                              <td style={{ padding: '12px 14px' }}>
                                <input
                                  type="checkbox"
                                  checked={isSel}
                                  onChange={() => toggleSelectInst(req.id)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </td>
                              <td style={{ padding: '12px 16px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{req.id}</td>
                              <td style={{ padding: '12px 16px', color: '#F1F5F9', fontWeight: 600 }}>{req.instrumentName}</td>
                              <td style={{ padding: '12px 16px', color: '#94A3B8', fontFamily: 'monospace' }}>{req.instrumentCode}</td>
                              <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>{req.borrowDate}</td>
                              <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>{req.requester}</td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: req.status === 'Approved' ? 'rgba(34, 197, 94, 0.15)' : (req.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)'),
                                  color: req.status === 'Approved' ? '#22c55e' : (req.status === 'Pending' ? '#fbbf24' : '#38bdf8')
                                }}>
                                  {req.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                  <button
                                    onClick={() => setSelectedInstDetails(req)}
                                    className="btn-secondary"
                                    style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: '20px' }}
                                  >
                                    Details
                                  </button>
                                  <button
                                    onClick={() => deleteInstrumentRequest(req.id)}
                                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                                    title="Delete request"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
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
        </div>
      )}

      {/* ===================== 5. UPDATE CONTENT CMS ===================== */}
      {currentSection === 'manage-content' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '14px', textAlign: 'center' }}>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#F8FAFC' }}>
            Website Content & Tenure Manager
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '20px' }}>
            Update events with poster images, about paragraphs, statistics, team tenures (2024-25, 2025-26, 2026-27), FAQs, and links.
          </p>
          <button
            onClick={() => onSectionChange ? onSectionChange('content-manager') : null}
            className="btn-primary"
            style={{ borderRadius: '20px', padding: '10px 28px' }}
          >
            Open Content Manager CMS
          </button>
        </div>
      )}

      {/* ===================== ADD / EDIT GEAR MODAL ===================== */}
      {showAddGearModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            border: '1.5px solid var(--blue-border)',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package className="w-5 h-5 text-sky-400" />
                <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC', margin: 0 }}>
                  {editingGear ? 'Edit Equipment' : 'Add Equipment to Inventory'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddGearModal(false)}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '8px' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (editingGear) {
                await updateInstrument(editingGear.id, gearForm);
              } else {
                await addInstrument(gearForm);
              }
              setShowAddGearModal(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Equipment / Instrument Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fender Player Stratocaster (HSS)"
                  value={gearForm.name}
                  onChange={(e) => setGearForm({ ...gearForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={gearForm.category}
                    onChange={(e) => setGearForm({ ...gearForm, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Electric Guitar">Electric Guitar</option>
                    <option value="Acoustic Guitar">Acoustic Guitar</option>
                    <option value="Bass Guitar">Bass Guitar</option>
                    <option value="Keyboards & Synth">Keyboards & Synth</option>
                    <option value="Drums & Percussion">Drums & Percussion</option>
                    <option value="Audio & Mics">Audio & Mics</option>
                    <option value="PA & Mixers">PA & Mixers</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Asset Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GTR-FEN-01"
                    value={gearForm.code}
                    onChange={(e) => setGearForm({ ...gearForm, code: e.target.value.toUpperCase() })}
                    className="input-field"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Storage Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Music Room - Locker A"
                    value={gearForm.location}
                    onChange={(e) => setGearForm({ ...gearForm, location: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                    Condition
                  </label>
                  <select
                    value={gearForm.condition}
                    onChange={(e) => setGearForm({ ...gearForm, condition: e.target.value })}
                    className="input-field"
                  >
                    <option value="Mint">Mint</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Maintenance">Needs Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                  Equipment Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={gearForm.image}
                  onChange={(e) => setGearForm({ ...gearForm, image: e.target.value })}
                  className="input-field"
                />
                {gearForm.image && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={gearForm.image}
                      alt="Preview"
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--blue-border)' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="gearAvailableCheck"
                  checked={gearForm.available}
                  onChange={(e) => setGearForm({ ...gearForm, available: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="gearAvailableCheck" style={{ fontSize: '0.85rem', color: '#CBD5E1', cursor: 'pointer' }}>
                  Mark as Available for Borrowing
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddGearModal(false)}
                  className="btn-ghost"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                >
                  {editingGear ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== PRINT BOOKING PASS (PDF) ===================== */}
      {printBooking && (
        <BookingPrintSlip
          booking={printBooking}
          onClose={() => setPrintBooking(null)}
          approverName={user?.name || 'V.Mithra'}
          approverRole={user?.role || 'Creative Head'}
        />
      )}

    </div>
  );
};
