/**
 * Formats a 24h ("17:00") or 12h ("5:00 PM") time string into clean 12-hour format (e.g. "5:00 PM").
 */
export const formatTime12h = (timeStr) => {
  if (!timeStr) return '';
  const trimmed = String(timeStr).trim();

  // Already in 12h format (contains AM/PM)
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    const h = parseInt(ampmMatch[1], 10);
    const m = ampmMatch[2];
    const period = ampmMatch[3].toUpperCase();
    return `${h}:${m} ${period}`;
  }

  // 24h format ("HH:MM")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    let h = parseInt(match24[1], 10);
    const m = match24[2];
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m} ${period}`;
  }

  return trimmed;
};

/**
 * Parses a 12h or 24h time string into { hour12, minute, period }.
 */
export const parseTime12hParts = (timeStr, fallback = { hour12: '5', minute: '00', period: 'PM' }) => {
  const formatted = formatTime12h(timeStr);
  const match = formatted.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return fallback;
  return {
    hour12: String(parseInt(match[1], 10)),
    minute: match[2],
    period: match[3].toUpperCase()
  };
};
