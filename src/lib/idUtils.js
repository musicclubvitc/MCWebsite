/**
 * Generates the next linear sequential ID for a given prefix and existing item collection.
 * Example: getNextLinearId(requests, 'REQ', 4) -> 'REQ-0001', 'REQ-0002', ...
 */
export const getNextLinearId = (items = [], prefix = 'ID', padLength = 4, field = 'id') => {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escaped}-?(\\d+)$`, 'i');
  let maxNum = 0;

  if (Array.isArray(items)) {
    for (const item of items) {
      const val = item?.[field];
      if (!val) continue;
      const match = String(val).trim().match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!Number.isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  const nextNum = String(maxNum + 1).padStart(padLength, '0');
  return `${prefix}-${nextNum}`;
};
