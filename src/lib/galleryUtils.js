/**
 * Utility to normalize photo and image URLs across the website.
 * Automatically converts Google Drive share/view/file links into high-speed CDN image URLs.
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim().replace(/^['"]|['"]$/g, '');

  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    // Pattern 1: https://drive.google.com/file/d/FILE_ID/view or /u/0/d/FILE_ID
    const driveFileMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveFileMatch && driveFileMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
    }

    // Pattern 2: https://drive.google.com/open?id=FILE_ID or /uc?id=FILE_ID or thumbnail?id=FILE_ID
    const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveIdMatch && driveIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
  }

  return trimmed;
}

/**
 * Returns higher-resolution URL for lightboxes and full-screen modals.
 */
export function getHighResImageUrl(url) {
  const formatted = formatImageUrl(url);
  if (formatted.includes('lh3.googleusercontent.com/d/')) {
    return formatted.includes('=') ? formatted : `${formatted}=w2048`;
  }
  return formatted;
}
