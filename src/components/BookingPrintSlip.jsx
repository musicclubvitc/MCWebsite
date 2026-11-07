import React from 'react';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';

/**
 * BookingPrintSlip Component
 * Renders the printable official Music Room pass matching the college club format:
 * - Header: Logo + "MUSIC CLUB VIT CHENNAI"
 * - Title: BOOKING DETAILS (Approved)
 * - Three-column metadata: Date, Day, Time
 * - Subtitle: "Only following people are allowed to enter the room."
 * - Table: S.No., Member Name, Register Number
 * - Footer: Rules notice + Approver signature block
 */
export const BookingPrintSlip = ({
  booking,
  onClose,
  approverName = 'V.Mithra',
  approverRole = 'Creative Head',
  approverDate
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format date as DD-MM-YYYY
  const formatDateDMY = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };

  // Format approval date (e.g. August 26, 2026)
  const displayApproverDate = approverDate || (booking.date ? new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }));

  // Resolve members strictly from booking info without any random placeholders
  const members = (booking.membersInfo && booking.membersInfo.length > 0)
    ? booking.membersInfo
    : (booking.bookerName ? [{ name: booking.bookerName, reg: booking.bookerReg || '—' }] : []);

  const isApproved = booking.status === 'Approved';

  return (
    <>
      {/* Screen Modal Overlay (hidden during window.print via CSS) */}
      <div className="no-print" style={{
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
        <div style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f172a',
          border: '1px solid var(--blue-border)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}>
          {/* Top modal bar */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15,23,42,0.95)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer className="w-5 h-5 text-sky-400" />
              <h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
                Official Music Room Booking Pass
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handlePrint}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  fontSize: '0.85rem'
                }}
              >
                <Download className="w-4 h-4" /> Save as PDF / Print
              </button>
              <button
                onClick={onClose}
                className="btn-ghost"
                style={{ padding: '6px', borderRadius: '8px' }}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Preview Body: Renders printable sheet preview */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '30px 20px',
            background: '#0b1329',
            display: 'flex',
            justifyContent: 'center'
          }}>
            {/* Sheet wrapper for screen display */}
            <div style={{
              width: '100%',
              maxWidth: '620px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderRadius: '6px',
              padding: '40px 45px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}>
              {/* Slip Content inside Modal */}
              <SlipInnerContent
                booking={booking}
                formatDateDMY={formatDateDMY}
                displayApproverDate={displayApproverDate}
                members={members}
                isApproved={isApproved}
                approverName={approverName}
                approverRole={approverRole}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actual Print Element (styled strictly for @media print) */}
      <div id="printable-booking-slip" className="print-only">
        <SlipInnerContent
          booking={booking}
          formatDateDMY={formatDateDMY}
          displayApproverDate={displayApproverDate}
          members={members}
          isApproved={isApproved}
          approverName={approverName}
          approverRole={approverRole}
        />
      </div>
    </>
  );
};

/**
 * Shared Slip Content Layout matching the user screenshot
 */
const SlipInnerContent = ({
  booking,
  formatDateDMY,
  displayApproverDate,
  members,
  isApproved,
  approverName,
  approverRole
}) => (
  <div style={{ width: '100%', color: '#0f172a', background: '#ffffff', lineHeight: 1.4 }}>
    {/* 1. Header with Logo & Title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
      <img
        src="/logo.png"
        alt="VITC Music Club Logo"
        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
      />
      <div>
        <div style={{
          fontFamily: 'Cinzel, Georgia, serif',
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '1px',
          color: '#0f172a'
        }}>
          MUSIC CLUB
        </div>
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#0284c7',
          letterSpacing: '1.5px',
          textTransform: 'uppercase'
        }}>
          VIT CHENNAI
        </div>
      </div>
    </div>

    {/* 2. Main Title with Status */}
    <div style={{
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '1.18rem',
      fontWeight: 700,
      marginBottom: '16px',
      color: '#0f172a'
    }}>
      BOOKING DETAILS (
      <span style={{ color: isApproved ? '#16a34a' : '#d97706', fontWeight: 800 }}>
        {booking.status || 'Approved'}
      </span>
      )
    </div>

    {/* Thin divider */}
    <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', marginBottom: '18px' }} />

    {/* 3. Three-Column Meta: Date, Day, Time */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1.2fr',
      gap: '16px',
      marginBottom: '18px'
    }}>
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          BOOKING DATE
        </div>
        <div style={{ fontSize: '0.86rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>
          {formatDateDMY(booking.date)}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          BOOKING DAY
        </div>
        <div style={{ fontSize: '0.86rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>
          {booking.day || 'Weekday'}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          BOOKING TIME
        </div>
        <div style={{ fontSize: '0.86rem', color: '#0f172a', fontWeight: 600, marginTop: '4px' }}>
          {booking.timeSlot}
        </div>
      </div>
    </div>

    {/* Subtitle notice */}
    <div style={{
      fontSize: '0.78rem',
      fontStyle: 'italic',
      color: '#475569',
      marginBottom: '10px'
    }}>
      Only following people are allowed to enter the room.
    </div>

    {/* 4. Members Table */}
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      fontSize: '0.82rem',
      marginBottom: '26px'
    }}>
      <thead>
        <tr style={{
          borderBottom: '2px solid #0f172a',
          color: '#0f172a',
          fontWeight: 700,
          fontSize: '0.75rem'
        }}>
          <th style={{ padding: '8px 6px', width: '50px' }}>S.No.</th>
          <th style={{ padding: '8px 12px' }}>Member Name</th>
          <th style={{ padding: '8px 12px', width: '180px' }}>Regsiter Number</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m, idx) => (
          <tr key={idx} style={{
            borderBottom: '1px solid #cbd5e1'
          }}>
            <td style={{ padding: '8px 6px', fontWeight: 600, color: '#0f172a' }}>
              {idx + 1}
            </td>
            <td style={{ padding: '8px 12px', fontWeight: 500, color: '#0f172a' }}>
              {m.name || m.memberName}
            </td>
            <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
              {m.reg || m.registerNumber || m.regNumber || '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* 5. Instruction warning note */}
    <div style={{
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#0f172a',
      marginBottom: '36px'
    }}>
      Kindly reach the music room on time and leave the room by the end of your slot.
    </div>

    {/* 6. Permission Signature Block */}
    <div style={{
      fontSize: '0.78rem',
      color: '#0f172a',
      lineHeight: 1.5
    }}>
      <div style={{ color: '#475569', marginBottom: '2px' }}>Permission granted by</div>
      <div style={{ fontWeight: 700 }}>{approverName}</div>
      <div style={{ color: '#334155' }}>{approverRole}</div>
      <div style={{ color: '#64748B', marginTop: '2px' }}>{displayApproverDate}</div>
    </div>
  </div>
);
