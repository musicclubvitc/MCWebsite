import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Info, X, Printer, Download, AlertTriangle, RefreshCw } from 'lucide-react';
import { BookingPrintSlip } from '../../components/BookingPrintSlip';
import { getBookingDeltaInfo } from '../../lib/bookingUtils';

export const MemberBookings = () => {
  const { bookings, user, myBookings, refreshLiveBookings, showToast } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [printBooking, setPrintBooking] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (refreshLiveBookings) await refreshLiveBookings();
    setIsRefreshing(false);
    if (showToast) showToast("Bookings refreshed!");
  };

  // Filter bookings belonging to the logged-in user or where user is in membersInfo
  const userBookings = myBookings || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header with Manual Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
        <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#93c5fd', letterSpacing: '1px' }}>
          YOUR BOOKINGS
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn-ghost"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.82rem',
            padding: '7px 16px',
            borderRadius: '20px',
            border: '1px solid var(--blue-border)',
            color: 'var(--blue-sky)',
            cursor: 'pointer',
            background: 'rgba(56, 189, 248, 0.08)'
          }}
          title="Refresh bookings from server"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {userBookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <Clock className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1.1rem' }}>No bookings yet</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
            Head over to <strong style={{ color: 'var(--blue-sky)' }}>Book a Slot</strong> to reserve practice time.
          </p>
        </div>
      ) : (
        /* Responsive Table layout matching the original site */
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
            <div style={{ minWidth: '780px' }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '50px 1.1fr 1.3fr 0.9fr 1.3fr 1fr 90px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderBottom: '1px solid var(--blue-border)',
                padding: '14px 20px',
                gap: '12px',
                alignItems: 'center'
              }}>
                {['S.No.', 'Slot Date', 'Booked On', 'Day', 'Time', 'Status', 'Action'].map(h => (
                  <div key={h} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-sky)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: h === 'Action' ? 'right' : 'left' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {userBookings.map((booking, idx) => {
                const statusColors = {
                  Approved: '#22c55e',
                  Pending:  '#f59e0b',
                  Blocked:  '#F8FAFC',
                  Declined: '#ef4444',
                };
                const col = statusColors[booking.status] || '#94A3B8';
                const deltaInfo = getBookingDeltaInfo(booking.date, booking.createdAt);

                return (
                  <div
                    key={booking.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 1.1fr 1.3fr 0.9fr 1.3fr 1fr 90px',
                      padding: '14px 20px',
                      alignItems: 'center',
                      gap: '12px',
                      borderBottom: idx < userBookings.length - 1 ? '1px solid var(--blue-border)' : 'none',
                      background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent',
                      fontSize: '0.88rem'
                    }}
                  >
                    <div style={{ color: '#64748B', fontWeight: 600 }}>{idx + 1}</div>
                    <div style={{ color: '#F1F5F9', fontWeight: 500 }}>{deltaInfo.formattedSlotDate}</div>
                    <div>
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
                    </div>
                    <div style={{ color: '#CBD5E1' }}>{booking.day || '—'}</div>
                    <div style={{ color: '#CBD5E1', fontFamily: 'monospace', fontSize: '0.85rem' }}>{booking.timeSlot || '—'}</div>
                    <div>
                      <span style={{ fontWeight: 700, color: col }}>
                        {booking.status}
                      </span>
                      {booking.status === 'Blocked' && booking.blockReason && (
                        <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>
                          Reason: {booking.blockReason}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => setPrintBooking(booking)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Print Pass (PDF)"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        style={{
                          background: 'rgba(56, 189, 248, 0.2)',
                          border: '1px solid var(--blue-sky)',
                          color: 'var(--blue-sky)',
                          fontSize: '0.78rem',
                          padding: '5px 16px',
                          borderRadius: '20px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            backgroundColor: 'rgba(8, 12, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              border: '1.5px solid var(--blue-sky)',
              borderRadius: '16px',
              padding: '28px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBooking(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: '#94A3B8',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X className="w-4 h-4" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              <div>
                <h3 className="font-display font-bold text-lg" style={{ color: '#F8FAFC', margin: 0 }}>
                  Booking Details ({selectedBooking.status})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--blue-sky)', textTransform: 'uppercase' }}>
                  VITC Music Club
                </span>
              </div>
            </div>

            {(() => {
              const detailsDelta = getBookingDeltaInfo(selectedBooking.date, selectedBooking.createdAt);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--blue-border)', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Slot Date:</span>
                    <strong style={{ color: '#F1F5F9' }}>{detailsDelta.formattedSlotDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94A3B8' }}>Booked On:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={detailsDelta.tooltip}>
                      <strong style={{ color: detailsDelta.isOverLimit ? '#fbbf24' : '#F1F5F9' }}>
                        {detailsDelta.formattedBookingDate}
                      </strong>
                      {detailsDelta.isOverLimit && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          color: '#fbbf24',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          <AlertTriangle style={{ width: '12px', height: '12px' }} />
                          +{detailsDelta.daysDelta}d
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Day:</span>
                    <span style={{ color: '#F1F5F9' }}>{selectedBooking.day}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Time:</span>
                    <span style={{ color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{selectedBooking.timeSlot}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94A3B8' }}>Booked By:</span>
                    <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{selectedBooking.bookerName || user?.name || 'Member'}</span>
                  </div>
                  {selectedBooking.status === 'Blocked' && selectedBooking.blockReason && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#fbbf24' }}>Reason:</span>
                      <span style={{ color: '#fbbf24', fontWeight: 600 }}>{selectedBooking.blockReason}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Allowed Attendees */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
                Allowed Attendees:
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--blue-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748B', fontSize: '0.72rem' }}>
                      <th style={{ padding: '6px 10px' }}>#</th>
                      <th style={{ padding: '6px 10px' }}>Member Name</th>
                      <th style={{ padding: '6px 10px' }}>Register Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      (selectedBooking.membersInfo && selectedBooking.membersInfo.length > 0)
                        ? selectedBooking.membersInfo
                        : (selectedBooking.bookerName ? [{ name: selectedBooking.bookerName, reg: selectedBooking.bookerReg || '—' }] : [])
                    ).map((m, mIdx) => (
                      <tr key={mIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '8px 10px', color: '#64748B' }}>{mIdx + 1}</td>
                        <td style={{ padding: '8px 10px', color: '#F1F5F9', fontWeight: 600 }}>{m.name || m.memberName}</td>
                        <td style={{ padding: '8px 10px', color: 'var(--blue-sky)', fontFamily: 'monospace' }}>{m.reg || m.registerNumber || m.regNumber || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => setPrintBooking(selectedBooking)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <Printer className="w-4 h-4 text-sky-400" /> Save as PDF / Print Pass
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Booking Slip Printout / Modal */}
      {printBooking && (
        <BookingPrintSlip
          booking={printBooking}
          onClose={() => setPrintBooking(null)}
          approverName={printBooking?.approvedBy || (user?.isAdmin ? user?.name : 'V.Mithra')}
          approverRole={printBooking?.approverRole || (user?.isAdmin ? user?.role : 'Creative Head')}
          approverDate={printBooking?.approvedAt || printBooking?.createdAt}
        />
      )}

    </div>
  );
};
