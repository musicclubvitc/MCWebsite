import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
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
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus, 
  Minus,
  FileEdit,
  Database,
  RefreshCw,
  Printer,
  Package,
  Search,
  Filter,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { getBookingDeltaInfo } from '../../lib/bookingUtils';

const PaginationControls = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalItems <= pageSize && currentPage === 1) return null;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      padding: '12px 18px',
      background: 'rgba(15, 23, 42, 0.75)',
      borderTop: '1px solid var(--blue-border)',
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px'
    }}>
      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
        Showing <strong style={{ color: '#F1F5F9' }}>{startItem}</strong>–<strong style={{ color: '#F1F5F9' }}>{endItem}</strong> of <strong style={{ color: 'var(--blue-sky)' }}>{totalItems}</strong> records
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="btn-ghost"
          style={{ padding: '4px 8px', fontSize: '0.78rem', opacity: currentPage === 1 ? 0.35 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn-ghost"
          style={{ padding: '4px 10px', fontSize: '0.78rem', opacity: currentPage === 1 ? 0.35 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <span style={{ fontSize: '0.82rem', color: '#CBD5E1', padding: '0 8px', fontWeight: 600 }}>
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn-ghost"
          style={{ padding: '4px 10px', fontSize: '0.78rem', opacity: currentPage >= totalPages ? 0.35 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
          title="Next Page"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="btn-ghost"
          style={{ padding: '4px 8px', fontSize: '0.78rem', opacity: currentPage >= totalPages ? 0.35 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

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
    refreshAllLiveData,
    refreshLiveBookings
  } = useAuth();

  const currentSection = activeSection || 'manage-bookings';

  // Selected item states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBand, setSelectedBand] = useState(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const [selectedInstIds, setSelectedInstIds] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [isRefreshingBookings, setIsRefreshingBookings] = useState(false);
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

  // Refresh Live Supabase Data
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      if (refreshAllLiveData) {
        await refreshAllLiveData();
      }
      showToast("Data refreshed successfully!");
    } catch (e) {
      showToast(e.message || "Failed to refresh data", "error");
    } finally {
      setIsRefreshing(false);
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

  // ==================== 1. BOOKINGS (Earliest to Latest) ====================
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [bookingPage, setBookingPage] = useState(1);
  const BOOKINGS_PAGE_SIZE = 15;

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const dComp = (a.date || '').localeCompare(b.date || '');
      if (dComp !== 0) return dComp;
      return (a.timeSlot || '').localeCompare(b.timeSlot || '');
    });
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return sortedBookings.filter(b => {
      if (dateFilter && b.date !== dateFilter) return false;
      if (bookingStatusFilter !== 'All' && b.status !== bookingStatusFilter) return false;
      if (bookingSearch.trim()) {
        const q = bookingSearch.toLowerCase();
        const bName = (b.bookerName || '').toLowerCase();
        const bReg = (b.bookerReg || '').toLowerCase();
        const band = (b.bandName || '').toLowerCase();
        const slot = (b.timeSlot || '').toLowerCase();
        const id = (b.id || '').toLowerCase();
        if (!bName.includes(q) && !bReg.includes(q) && !band.includes(q) && !slot.includes(q) && !id.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [sortedBookings, dateFilter, bookingStatusFilter, bookingSearch]);

  const totalBookingPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PAGE_SIZE));
  const paginatedBookings = useMemo(() => {
    const start = (bookingPage - 1) * BOOKINGS_PAGE_SIZE;
    return filteredBookings.slice(start, start + BOOKINGS_PAGE_SIZE);
  }, [filteredBookings, bookingPage]);

  const toggleSelectAllBookings = () => {
    if (selectedBookingIds.length === paginatedBookings.length && paginatedBookings.length > 0) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(paginatedBookings.map(b => b.id));
    }
  };

  // ==================== 2. BANDS (Latest to Earliest) ====================
  const [bandSearch, setBandSearch] = useState('');
  const [bandStatusFilter, setBandStatusFilter] = useState('All');
  const [bandPage, setBandPage] = useState(1);
  const BANDS_PAGE_SIZE = 15;

  const sortedBands = useMemo(() => {
    return [...bands].sort((a, b) => {
      const dComp = (b.createdAt || '').localeCompare(a.createdAt || '');
      if (dComp !== 0) return dComp;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [bands]);

  const filteredBands = useMemo(() => {
    return sortedBands.filter(band => {
      if (bandStatusFilter !== 'All' && (band.status || 'Approved') !== bandStatusFilter) return false;
      if (bandSearch.trim()) {
        const q = bandSearch.toLowerCase();
        const name = (band.name || '').toLowerCase();
        const leader = (band.madeBy || band.leader || '').toLowerCase();
        const genre = (band.genre || '').toLowerCase();
        if (!name.includes(q) && !leader.includes(q) && !genre.includes(q)) return false;
      }
      return true;
    });
  }, [sortedBands, bandStatusFilter, bandSearch]);

  const totalBandPages = Math.max(1, Math.ceil(filteredBands.length / BANDS_PAGE_SIZE));
  const paginatedBands = useMemo(() => {
    const start = (bandPage - 1) * BANDS_PAGE_SIZE;
    return filteredBands.slice(start, start + BANDS_PAGE_SIZE);
  }, [filteredBands, bandPage]);

  // ==================== 3. USERS (Latest to Earliest) ====================
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [userPage, setUserPage] = useState(1);
  const USERS_PAGE_SIZE = 15;

  const sortedUsers = useMemo(() => {
    return [...allUsers].sort((a, b) => {
      const dComp = (b.createdAt || '').localeCompare(a.createdAt || '');
      if (dComp !== 0) return dComp;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [allUsers]);

  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(u => {
      if (userStatusFilter === 'Pending') {
        if (u.verified === 'Verified' || u.type === 'Admin') return false;
      } else if (userStatusFilter === 'Verified') {
        if (u.verified !== 'Verified') return false;
      } else if (userStatusFilter === 'Admin') {
        if (u.type !== 'Admin') return false;
      }

      if (userSearch.trim()) {
        const q = userSearch.toLowerCase();
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const reg = (u.regNumber || '').toLowerCase();
        const role = (u.role || '').toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !reg.includes(q) && !role.includes(q)) return false;
      }
      return true;
    });
  }, [sortedUsers, userStatusFilter, userSearch]);

  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * USERS_PAGE_SIZE;
    return filteredUsers.slice(start, start + USERS_PAGE_SIZE);
  }, [filteredUsers, userPage]);

  // ==================== 4. INSTRUMENT REQUESTS (Earliest to Latest) ====================
  const [instReqSearch, setInstReqSearch] = useState('');
  const [instReqStatusFilter, setInstReqStatusFilter] = useState('All');
  const [instReqPage, setInstReqPage] = useState(1);
  const INST_REQ_PAGE_SIZE = 15;

  const sortedInstRequests = useMemo(() => {
    return [...instrumentRequests].sort((a, b) => {
      const dComp = (a.borrowDate || '').localeCompare(b.borrowDate || '');
      if (dComp !== 0) return dComp;
      return (a.borrowTime || '').localeCompare(b.borrowTime || '');
    });
  }, [instrumentRequests]);

  const filteredInstRequests = useMemo(() => {
    return sortedInstRequests.filter(req => {
      if (instReqStatusFilter !== 'All' && req.status !== instReqStatusFilter) return false;
      if (instReqSearch.trim()) {
        const q = instReqSearch.toLowerCase();
        const instName = (req.instrumentName || '').toLowerCase();
        const instCode = (req.instrumentCode || '').toLowerCase();
        const requester = (req.requester || '').toLowerCase();
        const reg = (req.regNumber || '').toLowerCase();
        const id = (req.id || '').toLowerCase();
        if (!instName.includes(q) && !instCode.includes(q) && !requester.includes(q) && !reg.includes(q) && !id.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [sortedInstRequests, instReqStatusFilter, instReqSearch]);

  const totalInstReqPages = Math.max(1, Math.ceil(filteredInstRequests.length / INST_REQ_PAGE_SIZE));
  const paginatedInstRequests = useMemo(() => {
    const start = (instReqPage - 1) * INST_REQ_PAGE_SIZE;
    return filteredInstRequests.slice(start, start + INST_REQ_PAGE_SIZE);
  }, [filteredInstRequests, instReqPage]);

  const toggleSelectAllInst = () => {
    if (selectedInstIds.length === paginatedInstRequests.length && paginatedInstRequests.length > 0) {
      setSelectedInstIds([]);
    } else {
      setSelectedInstIds(paginatedInstRequests.map(r => r.id));
    }
  };

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
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing Data...' : 'Refresh Data'}
          </button>
        </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>SLOT DATE</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>
                    {getBookingDeltaInfo(selectedBookingDetails.date, selectedBookingDetails.createdAt).formattedSlotDate}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>BOOKED ON</div>
                  {(() => {
                    const dInfo = getBookingDeltaInfo(selectedBookingDetails.date, selectedBookingDetails.createdAt);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }} title={dInfo.tooltip}>
                        <span style={{ color: dInfo.isOverLimit ? '#fbbf24' : '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>
                          {dInfo.formattedBookingDate}
                        </span>
                        {dInfo.isOverLimit && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            color: '#fbbf24',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700
                          }}>
                            <AlertTriangle style={{ width: '12px', height: '12px' }} />
                            +{dInfo.daysDelta}d (Advance booking limit exceeded)
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>SLOT DAY</div>
                  <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem' }}>{selectedBookingDetails.day}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>SLOT TIME</div>
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
                  {selectedBookingDetails.status !== 'Approved' && (
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBookingDetails.id, 'Approved');
                        setSelectedBookingDetails(prev => ({ ...prev, status: 'Approved' }));
                      }}
                      className="btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        background: '#16a34a',
                        borderColor: '#22c55e'
                      }}
                    >
                      <Check className="w-4 h-4" /> Approve Booking
                    </button>
                  )}
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
                <div>
                  <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                    ALL BOOKINGS
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                    Ordered earliest to latest • Total: {filteredBookings.length}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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

              {/* Search & Filter Toolbar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px', maxWidth: '420px', position: 'relative' }}>
                  <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="Search by booker, reg no, band, slot..."
                    value={bookingSearch}
                    onChange={(e) => {
                      setBookingSearch(e.target.value);
                      setBookingPage(1);
                    }}
                    className="input-field"
                    style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%' }}
                  />
                  {bookingSearch && (
                    <button
                      onClick={() => { setBookingSearch(''); setBookingPage(1); }}
                      style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Status Pills */}
                  {['All', 'Pending', 'Approved', 'Blocked', 'Declined'].map((st) => {
                    const isActive = bookingStatusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => { setBookingStatusFilter(st); setBookingPage(1); }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: isActive ? 'var(--blue-sky)' : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#0b1120' : '#CBD5E1',
                          border: isActive ? '1px solid var(--blue-sky)' : '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {st}
                      </button>
                    );
                  })}

                  {/* Date Filter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => { setDateFilter(e.target.value); setBookingPage(1); }}
                      className="input-field"
                      style={{ padding: '5px 10px', fontSize: '0.82rem', colorScheme: 'dark' }}
                      title="Filter by specific date"
                    />
                    {dateFilter && (
                      <button
                        onClick={() => { setDateFilter(''); setBookingPage(1); }}
                        className="btn-ghost"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Manual Refresh Button */}
                  <button
                    onClick={async () => {
                      setIsRefreshingBookings(true);
                      if (refreshLiveBookings) await refreshLiveBookings();
                      else if (refreshAllLiveData) await refreshAllLiveData();
                      setIsRefreshingBookings(false);
                      showToast("Bookings refreshed!");
                    }}
                    disabled={isRefreshingBookings}
                    className="btn-ghost"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      borderRadius: '20px',
                      border: '1px solid var(--blue-border)',
                      color: 'var(--blue-sky)',
                      cursor: 'pointer',
                      background: 'rgba(56, 189, 248, 0.08)'
                    }}
                    title="Refresh bookings from server"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingBookings ? 'animate-spin' : ''}`} />
                    {isRefreshingBookings ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                  <table style={{ width: '100%', minWidth: '980px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 14px', width: '40px' }}>
                          <input
                            type="checkbox"
                            checked={selectedBookingIds.length > 0 && selectedBookingIds.length === paginatedBookings.length}
                            onChange={toggleSelectAllBookings}
                            style={{ cursor: 'pointer' }}
                          />
                        </th>
                        <th style={{ padding: '12px 14px' }}>S.No.</th>
                        <th style={{ padding: '12px 14px' }}>Booked By</th>
                        <th style={{ padding: '12px 14px' }}>Slot Date</th>
                        <th style={{ padding: '12px 14px' }}>Booked On</th>
                        <th style={{ padding: '12px 14px' }}>Day</th>
                        <th style={{ padding: '12px 14px' }}>Slot</th>
                        <th style={{ padding: '12px 14px' }}>Mode</th>
                        <th style={{ padding: '12px 14px' }}>Status</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBookings.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                            {filteredBookings.length === 0 ? 'No bookings found matching filters.' : 'No bookings on this page.'}
                          </td>
                        </tr>
                      ) : paginatedBookings.map((b, idx) => {
                        const globalIdx = (bookingPage - 1) * BOOKINGS_PAGE_SIZE + idx + 1;
                        const isSel = selectedBookingIds.includes(b.id);
                        const deltaInfo = getBookingDeltaInfo(b.date, b.createdAt);
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
                            <td style={{ padding: '12px 14px', color: '#64748B' }}>{globalIdx}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ color: '#F8FAFC', fontWeight: 600 }}>{b.bookerName || 'Member'}</div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{b.bookerReg || ''}</div>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#F1F5F9', fontWeight: 600 }}>{deltaInfo.formattedSlotDate}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <div
                                title={deltaInfo.tooltip}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  cursor: 'help'
                                }}
                              >
                                <span style={{
                                  color: deltaInfo.isOverLimit ? '#fbbf24' : '#E2E8F0',
                                  fontWeight: deltaInfo.isOverLimit ? 600 : 500,
                                  whiteSpace: 'nowrap'
                                }}>
                                  {deltaInfo.formattedBookingDate}
                                </span>
                                {deltaInfo.isOverLimit && (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                      background: 'rgba(245, 158, 11, 0.15)',
                                      border: '1px solid rgba(245, 158, 11, 0.35)',
                                      color: '#fbbf24',
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      whiteSpace: 'nowrap'
                                    }}
                                    title={`Warning: Booked ${deltaInfo.daysDelta} days in advance (exceeds 3-day limit)`}
                                  >
                                    <AlertTriangle style={{ width: '12px', height: '12px' }} />
                                    +{deltaInfo.daysDelta}d
                                  </span>
                                )}
                              </div>
                            </td>
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
                                background: b.status === 'Approved' ? 'rgba(34, 197, 94, 0.15)' : (b.status === 'Blocked' ? 'rgba(245, 158, 11, 0.15)' : (b.status === 'Pending' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)')),
                                color: b.status === 'Approved' ? '#22c55e' : (b.status === 'Blocked' ? '#fbbf24' : (b.status === 'Pending' ? '#facc15' : '#ef4444'))
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
                                {b.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'Approved')}
                                      className="btn-primary"
                                      style={{ padding: '4px 10px', fontSize: '0.74rem', background: '#16a34a', borderColor: '#22c55e' }}
                                      title="Approve Booking"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => updateBookingStatus(b.id, 'Declined')}
                                      className="btn-secondary"
                                      style={{ padding: '4px 10px', fontSize: '0.74rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                                      title="Decline Booking"
                                    >
                                      Decline
                                    </button>
                                  </>
                                )}
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
                <PaginationControls
                  currentPage={bookingPage}
                  totalPages={totalBookingPages}
                  totalItems={filteredBookings.length}
                  pageSize={BOOKINGS_PAGE_SIZE}
                  onPageChange={setBookingPage}
                />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                    ALL BANDS
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                    Ordered latest to earliest • Total: {filteredBands.length}
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px', maxWidth: '420px', position: 'relative' }}>
                  <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="Search by band name or leader..."
                    value={bandSearch}
                    onChange={(e) => {
                      setBandSearch(e.target.value);
                      setBandPage(1);
                    }}
                    className="input-field"
                    style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%' }}
                  />
                  {bandSearch && (
                    <button
                      onClick={() => { setBandSearch(''); setBandPage(1); }}
                      style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {['All', 'Approved', 'Pending'].map((st) => {
                    const isActive = bandStatusFilter === st;
                    return (
                      <button
                        key={st}
                        onClick={() => { setBandStatusFilter(st); setBandPage(1); }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: isActive ? 'var(--blue-sky)' : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#0b1120' : '#CBD5E1',
                          border: isActive ? '1px solid var(--blue-sky)' : '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 18px' }}>S.No.</th>
                        <th style={{ padding: '12px 18px' }}>Band Name</th>
                        <th style={{ padding: '12px 18px' }}>Made by</th>
                        <th style={{ padding: '12px 18px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBands.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                            No bands match your criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedBands.map((band, idx) => (
                          <tr key={band.id} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                            <td style={{ padding: '12px 18px', color: '#64748B' }}>{(bandPage - 1) * BANDS_PAGE_SIZE + idx + 1}</td>
                            <td style={{ padding: '12px 18px', color: '#F1F5F9', fontWeight: 600 }}>{band.name}</td>
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={bandPage}
                  totalPages={totalBandPages}
                  totalItems={filteredBands.length}
                  pageSize={BANDS_PAGE_SIZE}
                  onPageChange={setBandPage}
                />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                    ALL MEMBERS
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                    Ordered latest to earliest • Total: {filteredUsers.length}
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px', maxWidth: '420px', position: 'relative' }}>
                  <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px' }} />
                  <input
                    type="text"
                    placeholder="Search by name, VIT email, reg no, role..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                    className="input-field"
                    style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%' }}
                  />
                  {userSearch && (
                    <button
                      onClick={() => { setUserSearch(''); setUserPage(1); }}
                      style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'All', label: 'All', count: allUsers.length },
                    { id: 'Pending', label: 'Pending Approval', count: allUsers.filter(u => u.verified !== 'Verified' && u.type !== 'Admin').length },
                    { id: 'Verified', label: 'Verified', count: allUsers.filter(u => u.verified === 'Verified').length },
                    { id: 'Admin', label: 'Admins', count: allUsers.filter(u => u.type === 'Admin').length }
                  ].map((filterItem) => {
                    const isActive = userStatusFilter === filterItem.id;
                    return (
                      <button
                        key={filterItem.id}
                        onClick={() => { setUserStatusFilter(filterItem.id); setUserPage(1); }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: isActive ? 'var(--blue-sky)' : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#0b1120' : '#CBD5E1',
                          border: isActive ? '1px solid var(--blue-sky)' : '1px solid rgba(255,255,255,0.08)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>{filterItem.label}</span>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          background: isActive ? 'rgba(11,17,32,0.2)' : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#0b1120' : '#94A3B8',
                          fontWeight: 700
                        }}>
                          {filterItem.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                  <table style={{ width: '100%', minWidth: '840px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
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
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                            No members match your criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((u, idx) => (
                          <tr key={u.id} style={{ borderBottom: '1px solid var(--blue-border)', background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                            <td style={{ padding: '12px 14px', color: '#64748B' }}>{(userPage - 1) * USERS_PAGE_SIZE + idx + 1}</td>
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={userPage}
                  totalPages={totalUserPages}
                  totalItems={filteredUsers.length}
                  pageSize={USERS_PAGE_SIZE}
                  onPageChange={setUserPage}
                />
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h2 className="font-display font-bold text-2xl" style={{ color: '#F8FAFC' }}>
                        GEAR REQUISITION REQUESTS
                      </h2>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                        Ordered earliest to latest • Total: {filteredInstRequests.length}
                      </div>
                    </div>

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

                  {/* Search & Filter Toolbar */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px', maxWidth: '420px', position: 'relative' }}>
                      <Search className="w-4 h-4 text-slate-400" style={{ position: 'absolute', left: '12px' }} />
                      <input
                        type="text"
                        placeholder="Search by instrument, code, requester, reg..."
                        value={instReqSearch}
                        onChange={(e) => {
                          setInstReqSearch(e.target.value);
                          setInstReqPage(1);
                        }}
                        className="input-field"
                        style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%' }}
                      />
                      {instReqSearch && (
                        <button
                          onClick={() => { setInstReqSearch(''); setInstReqPage(1); }}
                          style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {['All', 'Pending', 'Approved', 'Returned', 'Rejected'].map((st) => {
                        const isActive = instReqStatusFilter === st;
                        return (
                          <button
                            key={st}
                            onClick={() => { setInstReqStatusFilter(st); setInstReqPage(1); }}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              background: isActive ? 'var(--blue-sky)' : 'rgba(255,255,255,0.04)',
                              color: isActive ? '#0b1120' : '#CBD5E1',
                              border: isActive ? '1px solid var(--blue-sky)' : '1px solid rgba(255,255,255,0.08)'
                            }}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                      <table style={{ width: '100%', minWidth: '820px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid var(--blue-border)', color: 'var(--blue-sky)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 14px', width: '40px' }}>
                              <input
                                type="checkbox"
                                checked={selectedInstIds.length > 0 && selectedInstIds.length === paginatedInstRequests.length}
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
                          {paginatedInstRequests.length === 0 ? (
                            <tr>
                              <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                                No gear requisition requests match your criteria.
                              </td>
                            </tr>
                          ) : paginatedInstRequests.map((req, idx) => {
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
                    <PaginationControls
                      currentPage={instReqPage}
                      totalPages={totalInstReqPages}
                      totalItems={filteredInstRequests.length}
                      pageSize={INST_REQ_PAGE_SIZE}
                      onPageChange={setInstReqPage}
                    />
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
          approverName={printBooking?.approvedBy || user?.name || 'V.Mithra'}
          approverRole={printBooking?.approverRole || user?.role || 'Creative Head'}
          approverDate={printBooking?.approvedAt || printBooking?.createdAt}
        />
      )}

    </div>
  );
};
