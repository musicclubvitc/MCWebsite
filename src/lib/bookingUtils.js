/**
 * Utility helpers for calculating booking date deltas and formatting
 */

/**
 * Calculates the delta in days between the slot date and the date the booking was made.
 *
 * @param {string} slotDateStr - The slot date (format: YYYY-MM-DD or DD-MM-YYYY)
 * @param {string} createdAtStr - The date or timestamp when booking was created
 * @returns {object} {
 *   formattedSlotDate: string,
 *   formattedBookingDate: string,
 *   daysDelta: number | null,
 *   isOverLimit: boolean,
 *   tooltip: string
 * }
 */
export const getBookingDeltaInfo = (slotDateStr, createdAtStr) => {
  const parseDateOnly = (str) => {
    if (!str) return null;
    const clean = String(str).includes('T') ? String(str).split('T')[0] : String(str).split(' ')[0];
    const parts = clean.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    if (parts[0] > 1000) {
      return { year: parts[0], month: parts[1], day: parts[2] };
    } else {
      return { year: parts[2], month: parts[1], day: parts[0] };
    }
  };

  const slotParts = parseDateOnly(slotDateStr);
  const createdParts = parseDateOnly(createdAtStr);

  const formatDMY = (p) => {
    if (!p) return '—';
    const dd = String(p.day).padStart(2, '0');
    const mm = String(p.month).padStart(2, '0');
    return `${dd}-${mm}-${p.year}`;
  };

  const formattedSlotDate = formatDMY(slotParts);
  const formattedBookingDate = formatDMY(createdParts);

  if (!slotParts || !createdParts) {
    return {
      formattedSlotDate,
      formattedBookingDate: formattedBookingDate !== '—' ? formattedBookingDate : (createdAtStr || '—'),
      daysDelta: null,
      isOverLimit: false,
      tooltip: formattedBookingDate !== '—'
        ? `Booked on: ${formattedBookingDate}`
        : 'Booking date not recorded'
    };
  }

  // Use UTC midnight comparison to eliminate timezone offset issues
  const slotUtc = Date.UTC(slotParts.year, slotParts.month - 1, slotParts.day);
  const createdUtc = Date.UTC(createdParts.year, createdParts.month - 1, createdParts.day);
  const msDiff = slotUtc - createdUtc;
  const daysDelta = Math.round(msDiff / (1000 * 60 * 60 * 24));

  const isOverLimit = daysDelta > 3;

  let tooltip = '';
  if (daysDelta === 0) {
    tooltip = `Booked on same day as slot (${formattedSlotDate})`;
  } else if (daysDelta === 1) {
    tooltip = `Booked 1 day in advance (Slot: ${formattedSlotDate}, Booked: ${formattedBookingDate})`;
  } else if (daysDelta > 1) {
    tooltip = `Booked ${daysDelta} days in advance (Slot: ${formattedSlotDate}, Booked: ${formattedBookingDate})${
      isOverLimit ? ' — ⚠️ Warning: Booked more than 3 days in advance' : ''
    }`;
  } else {
    const abs = Math.abs(daysDelta);
    tooltip = `Booked ${abs} day${abs === 1 ? '' : 's'} after slot date (Slot: ${formattedSlotDate}, Booked: ${formattedBookingDate})`;
  }

  return {
    formattedSlotDate,
    formattedBookingDate,
    daysDelta,
    isOverLimit,
    tooltip
  };
};
