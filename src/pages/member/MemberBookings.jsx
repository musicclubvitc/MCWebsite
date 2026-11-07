import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, Info, X } from 'lucide-react';

export const MemberBookings = () => {
  const { bookings, user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#93c5fd', letterSpacing: '1px' }}>
          YOUR BOOKINGS
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px 20px', textAlign: 'center' }}>
          <Clock className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '1.1rem' }}>No bookings yet</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
            Head over to <strong style={{ color: 'var(--blue-sky)' }}>Book a Slot</strong> to reserve practice time.
          </p>
        </div>
      ) : (
        /* Table layout matching the original site */
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1.2fr 1fr 1.5fr 1fr 100px',
            background: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid var(--blue-border)',
            padding: '14px 20px',
            gap: '12px',
            alignItems: 'center'
          }}>
            {['S.No.', 'Date', 'Day', 'Time', 'Status', 'Action'].map(h => (
              <div key={h} style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--blue-sky)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: h === 'Action' ? 'right' : 'left' }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {bookings.map((booking, idx) => {
            const statusColors = {
              Approved: '#22c55e',
              Pending:  '#f59e0b',
              Blocked:  '#F8FAFC',
              Declined: '#ef4444',
            };
            const col = statusColors[booking.status] || '#94A3B8';
            const dateLabel = booking.date
              ? booking.date.split('-').reverse().join('-')
              : '—';

            return (
              <div
                key={booking.id || idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1.2fr 1fr 1.5fr 1fr 100px',
                  padding: '14px 20px',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: idx < bookings.length - 1 ? '1px solid var(--blue-border)' : 'none',
                  background: idx % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent',
                  fontSize: '0.88rem'
                }}
              >
                <div style={{ color: '#64748B', fontWeight: 600 }}>{idx + 1}</div>
                <div style={{ color: '#F1F5F9', fontWeight: 500 }}>{dateLabel}</div>
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
                <div style={{ textAlign: 'right' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--blue-border)', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Date:</span>
                <strong style={{ color: '#F1F5F9' }}>{selectedBooking.date?.split('-').reverse().join('-')}</strong>
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
                <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{selectedBooking.bookerName || user?.name || 'Michael Dias'}</span>
              </div>
              {selectedBooking.status === 'Blocked' && selectedBooking.blockReason && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fbbf24' }}>Reason:</span>
                  <span style={{ color: '#fbbf24', fontWeight: 600 }}>{selectedBooking.blockReason}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
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

    </div>
  );
};
