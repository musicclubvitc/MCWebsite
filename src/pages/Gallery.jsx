import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Image as ImageIcon, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Folder, 
  Calendar, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

// Preset sample photos shown when Google Apps Script URL has not been connected yet
const PRESET_GALLERY_IMAGES = [
  {
    id: 'demo-1',
    name: 'Battle of the Bands - Grand Finale',
    album: 'Riviera Concerts',
    created: '2026-03-14',
    thumbUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a'
  },
  {
    id: 'demo-2',
    name: 'Acoustic Jam Night Under the Stars',
    album: 'Acoustic Jams',
    created: '2026-02-20',
    thumbUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4'
  },
  {
    id: 'demo-3',
    name: 'Main Stage Headliner Performance',
    album: 'Riviera Concerts',
    created: '2026-03-15',
    thumbUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'
  },
  {
    id: 'demo-4',
    name: 'Sound Check & Guitar Tuning',
    album: 'Behind The Scenes',
    created: '2026-01-18',
    thumbUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
  },
  {
    id: 'demo-5',
    name: 'Electrifying Synth & Keys Solo',
    album: 'Acoustic Jams',
    created: '2026-02-22',
    thumbUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e617?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e617?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1520523839898-50712825e617'
  },
  {
    id: 'demo-6',
    name: 'Crowd Cheering at Outdoor Amphitheatre',
    album: 'Behind The Scenes',
    created: '2026-03-12',
    thumbUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea'
  },
  {
    id: 'demo-7',
    name: 'Drum Kit Rhythm Section Practice',
    album: 'Behind The Scenes',
    created: '2026-01-10',
    thumbUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7'
  },
  {
    id: 'demo-8',
    name: 'Vocal Harmony Rehearsals',
    album: 'Acoustic Jams',
    created: '2026-02-14',
    thumbUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    fullUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=2000&q=90',
    viewUrl: 'https://drive.google.com',
    downloadUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7'
  }
];

export const Gallery = ({ setActiveTab }) => {
  const { content } = useContent();
  const { isAdmin, showToast } = useAuth();

  // Resolve Google Apps Script endpoint URL
  const scriptUrl = useMemo(() => {
    return (
      content?.gallery?.appsScriptUrl ||
      import.meta.env.VITE_GOOGLE_DRIVE_GALLERY_URL ||
      localStorage.getItem('vitc_music_gallery_url') ||
      ''
    );
  }, [content]);

  const [images, setImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Lightbox Modal State
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  // Fetch images from Google Apps Script Web App
  const fetchGallery = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    // If no Google Apps Script Web App is connected yet, fall back gracefully to demo preset photos
    if (!scriptUrl) {
      setTimeout(() => {
        setImages(PRESET_GALLERY_IMAGES);
        const distinctAlbums = Array.from(new Set(PRESET_GALLERY_IMAGES.map(i => i.album).filter(Boolean)));
        setAlbums(distinctAlbums);
        setIsLiveConnected(false);
        setLoading(false);
        if (isManualRefresh) {
          setRefreshing(false);
          showToast("Sample gallery refreshed.");
        }
      }, 400);
      return;
    }

    try {
      const fetchTarget = isManualRefresh 
        ? `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}refresh=true&t=${Date.now()}`
        : scriptUrl;

      const res = await fetch(fetchTarget);
      if (!res.ok) {
        throw new Error(`Google Drive endpoint returned status ${res.status}`);
      }

      const data = await res.json();

      let list = [];
      let foundAlbums = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (data && data.images && Array.isArray(data.images)) {
        list = data.images;
        foundAlbums = data.albums || [];
      } else if (data && data.status === 'error') {
        throw new Error(data.message || 'Google Apps Script reported an error');
      }

      if (list.length > 0) {
        setImages(list);
        if (foundAlbums.length === 0) {
          foundAlbums = Array.from(new Set(list.map(i => i.album).filter(Boolean)));
        }
        setAlbums(foundAlbums);
        setIsLiveConnected(true);
        // Cache to sessionStorage for fast return
        try {
          sessionStorage.setItem('vitc_music_gallery_cache', JSON.stringify({ list, albums: foundAlbums, time: Date.now() }));
        } catch (_) {}
      } else {
        setImages([]);
      }

      if (isManualRefresh) {
        showToast("Live gallery photos synced from Google Drive!");
      }
    } catch (err) {
      console.error('[Gallery] Fetch failed:', err);
      setError(err.message || 'Failed to connect to Google Drive folder');
      // If live fetch fails, load cache or presets
      try {
        const cached = sessionStorage.getItem('vitc_music_gallery_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          setImages(parsed.list || []);
          setAlbums(parsed.albums || []);
          setIsLiveConnected(true);
          return;
        }
      } catch (_) {}
      setImages(PRESET_GALLERY_IMAGES);
      setIsLiveConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [scriptUrl, showToast]);

  // Initial load
  useEffect(() => {
    fetchGallery(false);
  }, [fetchGallery]);

  // Filtered images by album and search
  const filteredImages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return images.filter(img => {
      const matchAlbum = selectedAlbum === 'All' || img.album === selectedAlbum;
      const matchSearch = !q || (img.name && img.name.toLowerCase().includes(q)) || (img.album && img.album.toLowerCase().includes(q));
      return matchAlbum && matchSearch;
    });
  }, [images, selectedAlbum, searchQuery]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activePhotoIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePhotoIdx(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIdx(prev => (prev + 1) % filteredImages.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, filteredImages.length]);

  const activePhoto = activePhotoIdx !== null ? filteredImages[activePhotoIdx] : null;

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '70px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles className="w-3.5 h-3.5" />
          MOMENTS & ARCHIVES
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          {content?.gallery?.title || "Music Club Gallery"}
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '620px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {content?.gallery?.subtitle || "Concerts, acoustic jams, auditions, and behind-the-scenes moments from the VIT Chennai Music Club."}
        </p>
      </div>

      {/* Sync Status Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '12px 18px',
          marginBottom: '24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: isLiveConnected ? 'rgba(34, 197, 94, 0.06)' : 'rgba(56, 189, 248, 0.06)',
          border: isLiveConnected ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid var(--blue-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isLiveConnected ? '#22c55e' : '#38bdf8',
            boxShadow: isLiveConnected ? '0 0 10px #22c55e' : '0 0 10px #38bdf8'
          }} />
          <span style={{ fontSize: '0.85rem', color: isLiveConnected ? '#86efac' : '#bae6fd', fontWeight: 600 }}>
            {isLiveConnected 
              ? 'Connected to Live Google Drive Folder' 
              : 'Google Drive Live Gallery (Preview Mode)'}
          </span>
          <span style={{ color: '#64748B', fontSize: '0.82rem' }}>
            • {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {content?.gallery?.driveFolderUrl && (
            <a 
              href={content.gallery.driveFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Folder className="w-3.5 h-3.5 text-sky-400" />
              Open Drive Folder
            </a>
          )}

          <button
            onClick={() => fetchGallery(true)}
            disabled={refreshing || loading}
            className="btn-ghost"
            style={{
              fontSize: '0.8rem',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid var(--blue-border)',
              color: 'var(--blue-sky)'
            }}
            title="Fetch latest photos from Google Drive"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Syncing...' : 'Sync Drive'}
          </button>
        </div>
      </div>

      {/* Toolbar: Search and Album Filters */}
      <div 
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
            <Search 
              className="w-4 h-4 text-slate-400" 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder="Search photos by title, event, or album..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px', fontSize: '0.88rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Album Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedAlbum('All')}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedAlbum === 'All' ? 'var(--blue-royal)' : 'rgba(255,255,255,0.03)',
                color: selectedAlbum === 'All' ? '#ffffff' : '#94A3B8',
                border: selectedAlbum === 'All' ? '1px solid var(--blue-sky)' : '1px solid rgba(255,255,255,0.08)'
              }}
            >
              All Albums ({images.length})
            </button>

            {albums.map((alb) => {
              const count = images.filter(i => i.album === alb).length;
              const isActive = selectedAlbum === alb;
              return (
                <button
                  key={alb}
                  onClick={() => setSelectedAlbum(alb)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: isActive ? 'var(--blue-royal)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#ffffff' : '#94A3B8',
                    border: isActive ? '1px solid var(--blue-sky)' : '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {alb} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px'
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ 
                height: '240px', 
                borderRadius: '14px', 
                animation: 'pulse 1.5s infinite ease-in-out',
                background: 'rgba(255,255,255,0.03)' 
              }} 
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredImages.length === 0 && (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: '16px' }}>
          <ImageIcon className="w-12 h-12 text-slate-500" style={{ margin: '0 auto 14px auto' }} />
          <h3 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.2rem', marginBottom: '6px' }}>
            No photos found
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 18px auto' }}>
            {searchQuery 
              ? `No images matched "${searchQuery}". Try a different keyword.` 
              : `There are currently no photos in the "${selectedAlbum}" album.`}
          </p>
          {(searchQuery || selectedAlbum !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedAlbum('All'); }}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && filteredImages.length > 0 && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setActivePhotoIdx(idx)}
              className="glass-panel glass-panel-hover"
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--blue-border)',
                background: 'rgba(15, 23, 42, 0.7)',
                transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
              }}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden', backgroundColor: 'rgba(2,6,23,0.5)' }}>
                <img
                  src={img.thumbUrl || img.fullUrl}
                  alt={img.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onError={(e) => {
                    // Fallback to Google user content direct link or placeholder
                    if (img.id && !e.currentTarget.src.includes('lh3.googleusercontent.com/d/')) {
                      e.currentTarget.src = `https://lh3.googleusercontent.com/d/${img.id}=w800`;
                    }
                  }}
                />

                {/* Album Badge */}
                {img.album && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: 'var(--blue-sky)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
                    }}
                  >
                    {img.album}
                  </span>
                )}

                {/* Hover overlay hint */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}
                  title="Click to expand"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                </div>
              </div>

              {/* Photo Caption */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <div 
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#F1F5F9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={img.name}
                  >
                    {img.name.replace(/\.[^/.]+$/, "")}
                  </div>
                  {img.created && (
                    <div style={{ fontSize: '0.74rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar className="w-3 h-3" />
                      {new Date(img.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(2, 6, 23, 0.94)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePhotoIdx(null);
          }}
        >
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1400px', margin: '0 auto', zIndex: 10 }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--blue-sky)', fontWeight: 700 }}>
                {activePhoto.album || 'Gallery Photo'}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.8rem', marginLeft: '10px' }}>
                {activePhotoIdx + 1} of {filteredImages.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activePhoto.downloadUrl && (
                <a
                  href={activePhoto.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Download image"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              )}

              {activePhoto.viewUrl && (
                <a
                  href={activePhoto.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="View on Google Drive"
                >
                  <ExternalLink className="w-4 h-4 text-sky-400" />
                  <span className="hidden sm:inline">Drive</span>
                </a>
              )}

              <button
                onClick={() => setActivePhotoIdx(null)}
                className="btn-ghost"
                style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)' }}
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>

          {/* Center: Image & Navigation Arrows */}
          <div 
            style={{ 
              position: 'relative', 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto',
              overflow: 'hidden',
              padding: '12px 0'
            }}
          >
            {/* Prev Arrow */}
            {filteredImages.length > 1 && (
              <button
                onClick={() => setActivePhotoIdx(prev => (prev - 1 + filteredImages.length) % filteredImages.length)}
                className="btn-ghost"
                style={{
                  position: 'absolute',
                  left: '10px',
                  zIndex: 20,
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--blue-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                title="Previous photo (Left arrow)"
              >
                <ChevronLeft className="w-6 h-6 text-sky-400" />
              </button>
            )}

            {/* High-Res Image */}
            <img
              src={activePhoto.fullUrl || activePhoto.thumbUrl}
              alt={activePhoto.name}
              style={{
                maxHeight: 'calc(100vh - 160px)',
                maxWidth: '92vw',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
              }}
            />

            {/* Next Arrow */}
            {filteredImages.length > 1 && (
              <button
                onClick={() => setActivePhotoIdx(prev => (prev + 1) % filteredImages.length)}
                className="btn-ghost"
                style={{
                  position: 'absolute',
                  right: '10px',
                  zIndex: 20,
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--blue-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                title="Next photo (Right arrow)"
              >
                <ChevronRight className="w-6 h-6 text-sky-400" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Title & Caption */}
          <div style={{ textAlign: 'center', padding: '8px', zIndex: 10 }}>
            <h3 style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
              {activePhoto.name.replace(/\.[^/.]+$/, "")}
            </h3>
            {activePhoto.created && (
              <p style={{ color: '#94A3B8', fontSize: '0.78rem', margin: '4px 0 0 0' }}>
                Captured on {new Date(activePhoto.created).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
