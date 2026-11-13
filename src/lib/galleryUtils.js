/**
 * Utility to normalize photo URLs.
 * Automatically converts Google Drive share/view links into high-speed CDN image URLs.
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or /uc?id=FILE_ID or thumbnail?id=FILE_ID
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  return trimmed;
}

/**
 * Returns higher-resolution URL for the lightbox modal.
 */
export function getHighResImageUrl(url) {
  const formatted = formatImageUrl(url);
  if (formatted.includes('lh3.googleusercontent.com/d/')) {
    return formatted.includes('=') ? formatted : `${formatted}=w2048`;
  }
  return formatted;
}
