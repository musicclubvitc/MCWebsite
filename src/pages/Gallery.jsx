import React, { useState, useEffect, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { 
  Image as ImageIcon, 
  Search, 
  ExternalLink, 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Folder, 
  Calendar, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { formatImageUrl, getHighResImageUrl } from '../lib/galleryUtils';

export const Gallery = ({ setActiveTab }) => {
  const { content } = useContent();

  const galleryConfig = content?.gallery || {};
  const photos = useMemo(() => galleryConfig.photos || [], [galleryConfig.photos]);

  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  // Dynamically extract distinct albums from photos
  const albums = useMemo(() => {
    const list = Array.from(new Set(photos.map(p => p.album).filter(Boolean)));
    return list;
  }, [photos]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return photos.filter(photo => {
      const matchAlbum = selectedAlbum === 'All' || photo.album === selectedAlbum;
      const matchSearch = !q || 
        (photo.title && photo.title.toLowerCase().includes(q)) || 
        (photo.album && photo.album.toLowerCase().includes(q)) ||
        (photo.caption && photo.caption.toLowerCase().includes(q)) ||
        (photo.date && photo.date.toLowerCase().includes(q));
      return matchAlbum && matchSearch;
    });
  }, [photos, selectedAlbum, searchQuery]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (activePhotoIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePhotoIdx(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIdx(prev => (prev + 1) % filteredPhotos.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(prev => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, filteredPhotos.length]);

  const activePhoto = activePhotoIdx !== null ? filteredPhotos[activePhotoIdx] : null;

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '70px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles className="w-3.5 h-3.5" />
          MOMENTS & ARCHIVES
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          {galleryConfig.title || "Club Photo & Video Gallery"}
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '620px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {galleryConfig.subtitle || "Concerts, acoustic jams, auditions, and behind-the-scenes moments from the VIT Chennai Music Club."}
        </p>
      </div>

      {/* Info & Drive Link Bar */}
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
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid var(--blue-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#38bdf8',
            boxShadow: '0 0 10px #38bdf8'
          }} />
          <span style={{ fontSize: '0.85rem', color: '#bae6fd', fontWeight: 600 }}>
            Curated Club Moments
          </span>
          <span style={{ color: '#64748B', fontSize: '0.82rem' }}>
            • {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        {galleryConfig.driveFolderUrl && (
          <a 
            href={galleryConfig.driveFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Folder className="w-3.5 h-3.5 text-sky-400" />
            Open Drive Folder
          </a>
        )}
      </div>

      {/* Search & Album Filters */}
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
              placeholder="Search photos by title, album, date..."
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
              All Photos ({photos.length})
            </button>

            {albums.map((alb) => {
              const count = photos.filter(p => p.album === alb).length;
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

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
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
      {filteredPhotos.length > 0 && (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredPhotos.map((photo, idx) => {
            const displayUrl = formatImageUrl(photo.url);

            return (
              <div
                key={photo.id || idx}
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
                    src={displayUrl}
                    alt={photo.title || 'Music Club Moment'}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />

                  {/* Album Badge */}
                  {photo.album && (
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
                      {photo.album}
                    </span>
                  )}

                  {/* Expand Icon */}
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
                    title="Click to view full photo"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                </div>

                {/* Photo Caption */}
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div 
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#F1F5F9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={photo.title}
                  >
                    {photo.title}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#64748B' }}>
                    {photo.date ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar className="w-3 h-3" />
                        {photo.date}
                      </span>
                    ) : <span />}

                    {photo.caption && (
                      <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {photo.caption}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
                {activePhotoIdx + 1} of {filteredPhotos.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href={getHighResImageUrl(activePhoto.url)}
                target="_blank"
                rel="noreferrer"
                download
                className="btn-ghost"
                style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Open original high-res photo"
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Original</span>
              </a>

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
            {filteredPhotos.length > 1 && (
              <button
                onClick={() => setActivePhotoIdx(prev => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)}
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
              src={getHighResImageUrl(activePhoto.url)}
              alt={activePhoto.title}
              style={{
                maxHeight: 'calc(100vh - 160px)',
                maxWidth: '92vw',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
              }}
            />

            {/* Next Arrow */}
            {filteredPhotos.length > 1 && (
              <button
                onClick={() => setActivePhotoIdx(prev => (prev + 1) % filteredPhotos.length)}
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
              {activePhoto.title}
            </h3>
            {activePhoto.caption && (
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                {activePhoto.caption}
              </p>
            )}
            {activePhoto.date && (
              <p style={{ color: '#64748B', fontSize: '0.78rem', margin: '2px 0 0 0' }}>
                {activePhoto.date}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
