import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Plus, Minus } from 'lucide-react';

// Fixed time slots (55-min intervals) matching original site
const TIME_SLOTS = [
  '08:00 AM - 08:55 AM',
  '08:55 AM - 09:50 AM',
  '09:50 AM - 10:45 AM',
  '10:45 AM - 11:40 AM',
  '11:40 AM - 12:35 PM',
  '12:35 PM - 01:30 PM',
  '01:30 PM - 02:25 PM',
  '02:25 PM - 03:20 PM',
  '03:20 PM - 04:15 PM',
  '04:15 PM - 05:10 PM',
  '05:10 PM - 06:05 PM',
  '06:05 PM - 07:00 PM',
  '07:00 PM - 07:55 PM',
  '07:55 PM - 08:50 PM',
];

// Converts "08:00 AM" or "01:30 PM" to minutes from midnight
function parseTimeToMinutes(t) {
  if (!t) return 0;
  const match = t.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Checks if an interval [slotA] overlaps with [slotB]
function slotsOverlap(slotA, slotB) {
  if (!slotA || !slotB) return false;
  if (slotA.trim().toLowerCase() === slotB.trim().toLowerCase()) return true;

  const [aStartStr, aEndStr] = slotA.split(' - ');
  const [bStartStr, bEndStr] = slotB.split(' - ');
  if (!aStartStr || !aEndStr || !bStartStr || !bEndStr) return false;

  const aStart = parseTimeToMinutes(aStartStr);
  const aEnd = parseTimeToMinutes(aEndStr);
  const bStart = parseTimeToMinutes(bStartStr);
  const bEnd = parseTimeToMinutes(bEndStr);

  return aStart < bEnd && aEnd > bStart;
}

function normalizeDate(d) {
  if (!d) return '';
  return d.split('T')[0];
}

// Check real bookings for a given slot on a given date
function getSlotInfo(slot, dateStr, bookings) {
  const targetDate = normalizeDate(dateStr);
  const dateBookings = (bookings || []).filter(b => {
    if (!b || b.status === 'Declined' || b.status === 'Cancelled' || b.status === 'Rejected') return false;
    return normalizeDate(b.date) === targetDate;
  });

  // Blocked by admin
  const blocked = dateBookings.find(
    b => (b.bookingMode === 'Block' || b.status === 'Blocked') && slotsOverlap(slot, b.timeSlot)
  );
  if (blocked) return {
    status: 'Blocked',
    booker: blocked.bookerName || 'Admin',
    reason: blocked.blockReason || 'Maintenance / Reserved'
  };

  // Booked by someone (Self, Bands, Manual)
  const booked = dateBookings.find(
    b => b.bookingMode !== 'Block' && b.status !== 'Blocked' && slotsOverlap(slot, b.timeSlot)
  );
  if (booked) return {
    status: 'Not Available',
    booker: booked.bandName ? `${booked.bandName} (${booked.bookerName})` : booked.bookerName,
    reason: ''
  };

  return { status: 'Available', booker: null, reason: '' };
}

const STATUS_STYLES = {
  'Available':     { bg: '#16a34a', color: '#ffffff' },
  'Blocked':       { bg: '#ca8a04', color: '#ffffff' },
  'Not Available': { bg: '#dc2626', color: '#ffffff' },
};

const BOOKING_MODES = [
  { id: 'Self',   label: 'Self',   desc: 'Book for yourself' },
  { id: 'Manual', label: 'Manual', desc: 'Enter each member\'s name & reg number' },
  { id: 'Bands',  label: 'Bands',  desc: 'Book via a registered band' },
];

const ADMIN_MODES = [
  ...BOOKING_MODES,
  { id: 'Block', label: 'Block', desc: 'Block slot (admin only)', adminOnly: true },
];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export const MemberSlot = () => {
  const { isAdmin, addBooking, bookings, bands, user, showToast } = useAuth();

  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [startSlot, setStartSlot] = useState('');
  const [endSlot,   setEndSlot]   = useState('');
  const [bookingMode, setBookingMode] = useState('Self');
  const [selectedBand, setSelectedBand] = useState(bands.length > 0 ? bands[0].id : '');
  const [blockReason, setBlockReason] = useState('');
  // Manual mode: array of { name, reg }
  const [manualMembers, setManualMembers] = useState([{ name: '', reg: '' }]);
  const [submitting, setSubmitting] = useState(false);

  const modes = isAdmin ? ADMIN_MODES : BOOKING_MODES;

  useEffect(() => {
    if (!isAdmin && bookingMode === 'Block') setBookingMode('Self');
  }, [isAdmin]);

  // Compute statuses for all slots on selected date
  const slotStatuses = TIME_SLOTS.map(slot => ({
    slot,
    ...getSlotInfo(slot, selectedDate, bookings),
  }));

  // Manual member helpers
  const addMember = () => setManualMembers(prev => [...prev, { name: '', reg: '' }]);
  const removeMember = (i) => setManualMembers(prev => prev.filter((_, idx) => idx !== i));
  const updateMember = (i, field, value) =>
    setManualMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startSlot || !endSlot) {
      showToast('Please select a start and end time.', 'error');
      return;
    }
    const si = TIME_SLOTS.indexOf(startSlot);
    const ei = TIME_SLOTS.indexOf(endSlot);
    if (ei < si) {
      showToast('End time must be after start time.', 'error');
      return;
    }
    if (bookingMode === 'Block' && !blockReason.trim()) {
      showToast('Please enter a reason for blocking this slot.', 'error');
      return;
    }

    const startTime = startSlot.split(' - ')[0];
    const endTime   = endSlot.split(' - ')[1];
    const timeRange = `${startTime} - ${endTime}`;

    const isConflict = bookings.some(b => {
      if (!b || b.status === 'Declined' || b.status === 'Cancelled' || b.status === 'Rejected') return false;
      return normalizeDate(b.date) === normalizeDate(selectedDate) && slotsOverlap(timeRange, b.timeSlot);
    });

    if (isConflict && bookingMode !== 'Block') {
      showToast('Selected time interval conflicts with an existing booking. Please choose another slot.', 'error');
      return;
    }

    let resolvedMembers = [];
    if (bookingMode === 'Self') {
      resolvedMembers = [{
        name: user?.name || 'Club Member',
        reg: user?.regNumber || '—'
      }];
    } else if (bookingMode === 'Bands') {
      const selectedBandObj = bands.find(b => b.id === selectedBand);
      if (selectedBandObj?.members && selectedBandObj.members.length > 0) {
        resolvedMembers = selectedBandObj.members.map(m => ({
          name: m.name || m.memberName,
          reg: m.reg || m.registerNumber || m.regNumber || '—'
        }));
      } else if (selectedBandObj?.memberNames && selectedBandObj.memberNames.length > 0) {
        resolvedMembers = selectedBandObj.memberNames.map((n, idx) => ({
          name: n,
          reg: selectedBandObj.registerNumbers?.[idx] || '—'
        }));
      } else {
        resolvedMembers = [{
          name: user?.name || 'Band Leader',
          reg: user?.regNumber || '—'
        }];
      }
    } else if (bookingMode === 'Manual') {
      const validManual = manualMembers.filter(m => m.name.trim());
      resolvedMembers = validManual.length > 0
        ? validManual.map(m => ({ name: m.name.trim(), reg: m.reg.trim() || '—' }))
        : [{ name: user?.name || 'Member', reg: user?.regNumber || '—' }];
    }

    addBooking({
      date: selectedDate,
      day: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
      timeSlot: timeRange,
      bookingMode,
      bookerName: user?.name || 'Member',
      bookerReg:  user?.regNumber || '',
      blockReason: bookingMode === 'Block' ? blockReason.trim() : null,
      bandId:   bookingMode === 'Bands' ? selectedBand : null,
      bandName: bookingMode === 'Bands' ? (bands.find(b => b.id === selectedBand)?.name || '') : null,
      membersInfo: resolvedMembers,
    });

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStartSlot('');
      setEndSlot('');
      setBlockReason('');
      setManualMembers([{ name: '', reg: '' }]);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#93c5fd', letterSpacing: '1px' }}>
          SLOT DETAILS
        </h2>
      </div>

      {/* Date picker */}
      <div className="glass-panel" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
            <Calendar className="w-4 h-4" />
            Choose Date :
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="input-field"
            style={{ maxWidth: '220px', padding: '7px 12px', fontSize: '0.9rem' }}
          />
          {selectedDate && (
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              ({new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })})
            </span>
          )}
        </div>
      </div>

      {/* Availability Grid */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid var(--blue-border)' }}>
          <div style={{ padding: '11px 20px', fontWeight: 700, color: 'var(--blue-sky)', fontSize: '0.82rem', letterSpacing: '0.5px', textTransform: 'uppercase', borderRight: '1px solid var(--blue-border)' }}>
            TIME
          </div>
          <div style={{ padding: '11px 20px', fontWeight: 700, color: 'var(--blue-sky)', fontSize: '0.82rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STATUS
          </div>
        </div>

        {/* Rows */}
        {slotStatuses.map(({ slot, status, booker, reason }, idx) => {
          const s = STATUS_STYLES[status];
          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: idx < slotStatuses.length - 1 ? '1px solid var(--blue-border)' : 'none',
                background: idx % 2 === 0 ? 'rgba(15,23,42,0.6)' : 'rgba(15,23,42,0.4)'
              }}
            >
              <div style={{ padding: '10px 20px', color: 'var(--blue-sky)', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace', borderRight: '1px solid var(--blue-border)', alignSelf: 'center' }}>
                {slot}
              </div>
              <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-block',
                  background: s.bg,
                  color: s.color,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  padding: '3px 14px',
                  borderRadius: '4px',
                  minWidth: '104px',
                  textAlign: 'center',
                  flexShrink: 0
                }}>
                  {status}
                </span>
                {/* Show booker name when slot is taken */}
                {booker && status !== 'Available' && (
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', minWidth: 0 }}>
                    <span style={{ color: '#CBD5E1', fontWeight: 500 }}>{booker}</span>
                    {reason && (
                      <span style={{ color: '#ca8a04', marginLeft: '6px' }}>— {reason}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_STYLES).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.82rem', color: '#CBD5E1' }}>
            <span style={{ width: '13px', height: '13px', background: val.bg, borderRadius: '3px', display: 'inline-block', flexShrink: 0 }} />
            {key}
          </div>
        ))}
      </div>

      {/* Book Your Slot */}
      <div className="glass-panel" style={{ padding: '28px 24px' }}>
        <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC', marginBottom: '20px', textAlign: 'center' }}>
          BOOK YOUR SLOT
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Start / End time */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Start Time
              </label>
              <select value={startSlot} onChange={e => setStartSlot(e.target.value)} className="input-field" required>
                <option value="">Select the starting time</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot.split(' - ')[0]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                End Time
              </label>
              <select value={endSlot} onChange={e => setEndSlot(e.target.value)} className="input-field" required>
                <option value="">Select the ending time</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot} value={slot}>{slot.split(' - ')[1]}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Choose Date
              </label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field" required />
            </div>
          </div>

          {/* Booking Mode */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '8px' }}>
              Booking Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {modes.map(mode => {
                const isSel = bookingMode === mode.id;
                const isBlock = mode.id === 'Block';
                return (
                  <label
                    key={mode.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: isSel
                        ? (isBlock ? '1px solid #f59e0b' : '1px solid var(--blue-sky)')
                        : '1px solid var(--blue-border)',
                      background: isSel
                        ? (isBlock ? 'rgba(245,158,11,0.1)' : 'rgba(56,189,248,0.08)')
                        : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isSel ? (isBlock ? '#fbbf24' : 'var(--blue-sky)') : '#94A3B8',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="bookingMode"
                      value={mode.id}
                      checked={isSel}
                      onChange={() => setBookingMode(mode.id)}
                      style={{ accentColor: isBlock ? '#f59e0b' : 'var(--blue-sky)' }}
                    />
                    {mode.label}
                    {mode.adminOnly && (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '1px 5px', borderRadius: '3px', marginLeft: 'auto', flexShrink: 0 }}>
                        Admin
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Conditional: Band selector */}
          {bookingMode === 'Bands' && bands.length > 0 && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '4px' }}>
                Select Band
              </label>
              <select value={selectedBand} onChange={e => setSelectedBand(e.target.value)} className="input-field">
                {bands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional: Manual member rows */}
          {bookingMode === 'Manual' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E1' }}>
                  Members
                </label>
                <button
                  type="button"
                  onClick={addMember}
                  className="btn-ghost"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {manualMembers.map((member, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder={`Member ${i + 1} Name`}
                      value={member.name}
                      onChange={e => updateMember(i, 'name', e.target.value)}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Register Number"
                      value={member.reg}
                      onChange={e => updateMember(i, 'reg', e.target.value)}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                    />
                    {manualMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(i)}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          color: '#f87171',
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional: Block reason */}
          {bookingMode === 'Block' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24', marginBottom: '4px' }}>
                Reason for Blocking *
              </label>
              <input
                type="text"
                placeholder="e.g. Maintenance, Event setup, Faculty use..."
                value={blockReason}
                onChange={e => setBlockReason(e.target.value)}
                className="input-field"
                required
                style={{ borderColor: 'rgba(245,158,11,0.4)' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#ca8a04', marginTop: '4px' }}>
                ⚠️ The reason will be shown to all members on the availability grid.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              ...(bookingMode === 'Block' ? { background: 'linear-gradient(90deg, #92400e, #b45309)' } : {})
            }}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>

        </form>
      </div>

    </div>
  );
};
