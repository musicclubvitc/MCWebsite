/**
 * Utility functions for sorting and ordering academic tenure sessions
 */

/**
 * Comparator to sort academic tenure strings in descending order (newest first).
 * Handles formats like "2026-27", "2025-26", "2024-25", "2024", etc.
 */
export const sortTenuresDesc = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  const matchA = a.match(/\d{4}/);
  const matchB = b.match(/\d{4}/);
  if (matchA && matchB) {
    const yearA = parseInt(matchA[0], 10);
    const yearB = parseInt(matchB[0], 10);
    if (yearA !== yearB) {
      return yearB - yearA; // Descending (latest year first)
    }
  }

  // Fallback to localeCompare with numeric collation (descending)
  return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
};

/**
 * Returns tenure session keys respecting custom order if provided,
 * otherwise defaults to descending (newest first).
 */
export const getOrderedTenures = (teamObj, customOrder) => {
  const allKeys = Object.keys(teamObj || {});
  if (!allKeys.length) return [];

  if (Array.isArray(customOrder) && customOrder.length > 0) {
    const validCustom = customOrder.filter((k) => allKeys.includes(k));
    const remaining = allKeys
      .filter((k) => !validCustom.includes(k))
      .sort(sortTenuresDesc);
    return [...validCustom, ...remaining];
  }

  return [...allKeys].sort(sortTenuresDesc);
};
