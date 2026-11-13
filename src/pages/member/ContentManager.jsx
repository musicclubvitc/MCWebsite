import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  FileEdit, 
  Download, 
  Upload, 
  RotateCcw, 
  Save, 
  Plus, 
  Trash2, 
  Calendar, 
  Users, 
  Disc, 
  Mail, 
  Info,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  HelpCircle,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { formatImageUrl } from '../../lib/galleryUtils';

const PRESET_EVENT_IMAGES = [
  { label: 'Concert Stage', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rock Band', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
  { label: 'Acoustic Guitar', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Festival Crowd', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80' },
];

export const ContentManager = () => {
  const { content, updateContent, resetToDefault, exportContentJson, importContentJson } = useContent();
  const { showToast } = useAuth();

  const [activeSection, setActiveSection] = useState('site');
  const [localData, setLocalData] = useState(() => JSON.parse(JSON.stringify(content || {})));
  const [importStatus, setImportStatus] = useState('');

  // Team session states
  const teamSessions = localData.team || { "2024-25": [] };
  const sessionKeys = Object.keys(teamSessions);
  const [selectedSession, setSelectedSession] = useState(sessionKeys[0] || "2024-25");
  const [newSessionInput, setNewSessionInput] = useState('');

  if (!content) {
    return <div style={{ color: '#94A3B8', padding: '40px', textAlign: 'center' }}>Loading content configuration...</div>;
  }

  const handleSave = () => {
    updateContent(localData);
    showToast("Website content and database updated successfully!");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importContentJson(event.target.result);
      if (res.success) {
        setLocalData(JSON.parse(event.target.result));
        showToast("content.json imported and applied successfully!");
      } else {
        setImportStatus(`Import error: ${res.error}`);
      }
    };
    reader.readAsText(file);
  };

  // Helper updater
  const updateField = (path, value) => {
    setLocalData(prev => {
      const updated = { ...prev };
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // ----------------- BOARD TENURES MANAGEMENT -----------------
  const handleAddSession = () => {
    const name = newSessionInput.trim();
    if (!name) {
      showToast("Please enter an academic tenure name (e.g. 2025-26)", "error");
      return;
    }
    if (teamSessions[name]) {
      showToast("Tenure already exists", "error");
      return;
    }
    const nextTeam = { ...teamSessions, [name]: [] };
    setLocalData({ ...localData, team: nextTeam });
    setSelectedSession(name);
    setNewSessionInput('');
    showToast(`Created board tenure ${name}!`);
  };

  const handleDeleteSession = (sessName) => {
    if (sessionKeys.length <= 1) {
      showToast("At least one board tenure must remain", "error");
      return;
    }
    const nextTeam = { ...teamSessions };
    delete nextTeam[sessName];
    const remainingKeys = Object.keys(nextTeam);
    setLocalData({ ...localData, team: nextTeam });
    setSelectedSession(remainingKeys[0] || "2024-25");
    showToast(`Deleted board tenure ${sessName}`);
  };

  const handleAddMemberToSession = (sessName) => {
    const newMember = {
      role: "Core Member",
      name: "New Musician",
      instrument: "Vocals / Guitar",
      image: "",
      instagram: "https://www.instagram.com/vitcmusicclub",
      linkedin: ""
    };
    const currentList = teamSessions[sessName] || [];
    const nextTeam = { ...teamSessions, [sessName]: [...currentList, newMember] };
    setLocalData({ ...localData, team: nextTeam });
  };

  const handleRemoveMemberFromSession = (sessName, mIdx) => {
    const currentList = teamSessions[sessName] || [];
    const nextList = currentList.filter((_, idx) => idx !== mIdx);
    setLocalData({ ...localData, team: { ...teamSessions, [sessName]: nextList } });
  };

  const handleUpdateMember = (sessName, mIdx, field, val) => {
    const currentList = [...(teamSessions[sessName] || [])];
    currentList[mIdx] = { ...currentList[mIdx], [field]: val };
    setLocalData({ ...localData, team: { ...teamSessions, [sessName]: currentList } });
  };

  const activeMembers = teamSessions[selectedSession] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & File Management Actions */}
      <div 
        className="glass-panel"
        style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FileEdit className="w-5 h-5 text-sky-400" />
            <h3 className="font-display font-bold text-xl" style={{ color: '#F8FAFC' }}>
              Content Manager & Live CMS
            </h3>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Edit events with posters, about page paragraphs, tenures, showcased bands, and stats. Changes save instantly to Supabase.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Export JSON button */}
          <button
            onClick={exportContentJson}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            title="Download the updated content.json file"
          >
            <Download className="w-4 h-4" /> Export content.json
          </button>

          {/* Import JSON button */}
          <label 
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '8px 14px', cursor: 'pointer' }}
            title="Upload a content.json file from your computer"
          >
            <Upload className="w-4 h-4 text-sky-400" /> Import JSON
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm("Reset all content back to factory default?")) {
                resetToDefault();
                setLocalData(JSON.parse(JSON.stringify(content)));
                showToast("Content reset to defaults", "info");
              }
            }}
            className="btn-ghost"
            style={{ fontSize: '0.82rem', padding: '8px 14px', color: '#f87171' }}
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {importStatus && (
        <div style={{ padding: '10px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', fontSize: '0.85rem' }}>
          {importStatus}
        </div>
      )}

      {/* Editor Section Switcher */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--blue-border)',
          scrollbarWidth: 'none'
        }}
      >
        {[
          { id: 'site', label: 'General & Hero' },
          { id: 'about', label: 'About & Stats' },
          { id: 'events', label: 'Events & Posters' },
          { id: 'bands', label: 'Bands Showcase' },
          { id: 'gallery', label: 'Drive Gallery' },
          { id: 'team', label: 'Tenures & Team' },
          { id: 'faqs', label: 'FAQs' },
          { id: 'contact', label: 'Contact & Socials' }
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              background: activeSection === sec.id ? 'var(--blue-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeSection === sec.id ? '#ffffff' : '#94A3B8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ===================== SECTION 1: SITE & HERO ===================== */}
      {activeSection === 'site' && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1rem' }}>General Club Information</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>Club Name</label>
              <input
                type="text"
                value={localData.site?.name || ''}
                onChange={(e) => updateField('site.name', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>Campus</label>
              <input
                type="text"
                value={localData.site?.campus || ''}
                onChange={(e) => updateField('site.campus', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>Tagline</label>
              <input
                type="text"
                value={localData.site?.tagline || ''}
                onChange={(e) => updateField('site.tagline', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>Hero Description</label>
            <textarea
              rows={3}
              value={localData.site?.description || ''}
              onChange={(e) => updateField('site.description', e.target.value)}
              className="input-field"
            />
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <Save className="w-4 h-4" /> Save Site Changes
          </button>
        </div>
      )}

      {/* ===================== SECTION 2: ABOUT & STATS ===================== */}
      {activeSection === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* About Section Settings */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
                About Section Content
              </h4>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>About Section Title</label>
              <input
                type="text"
                value={localData.about?.title || ''}
                onChange={(e) => updateField('about.title', e.target.value)}
                className="input-field"
              />
            </div>

            {/* About Hero Image */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>
                  About Hero Image URL <span style={{ color: '#38bdf8' }}>(Direct link or Google Drive link)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://... or Google Drive share link"
                  value={localData.about?.image || ''}
                  onChange={(e) => updateField('about.image', formatImageUrl(e.target.value))}
                  className="input-field"
                />
              </div>

              {localData.about?.image && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={formatImageUrl(localData.about.image)}
                    alt="About Preview"
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--blue-border)' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Live image preview</span>
                </div>
              )}
            </div>

            {/* Paragraphs */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.85rem', color: '#F8FAFC', fontWeight: 600 }}>About Paragraphs</label>
                <button
                  onClick={() => {
                    const paras = [...(localData.about?.paragraphs || []), "New club overview paragraph..."];
                    updateField('about.paragraphs', paras);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Paragraph
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(localData.about?.paragraphs || []).map((para, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#64748B', fontWeight: 700, fontSize: '0.85rem', paddingTop: '8px' }}>
                      P{pIdx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => {
                        const paras = [...localData.about.paragraphs];
                        paras[pIdx] = e.target.value;
                        updateField('about.paragraphs', paras);
                      }}
                      className="input-field"
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={() => {
                        const paras = localData.about.paragraphs.filter((_, i) => i !== pIdx);
                        updateField('about.paragraphs', paras);
                      }}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer', marginTop: '4px' }}
                      title="Remove paragraph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
              <Save className="w-4 h-4" /> Save About Section
            </button>
          </div>

          {/* Club Statistics Editor */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
                Club Statistics Counter
              </h4>
              <button
                onClick={() => {
                  const nextStats = [...(localData.stats || []), { label: "New Stat", value: "100+", detail: "Description" }];
                  setLocalData({ ...localData, stats: nextStats });
                }}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Counter
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {(localData.stats || []).map((stat, idx) => (
                <div key={idx} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--blue-border)', position: 'relative' }}>
                  <button
                    onClick={() => {
                      const nextStats = localData.stats.filter((_, i) => i !== idx);
                      setLocalData({ ...localData, stats: nextStats });
                    }}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    title="Remove stat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Stat Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const next = [...localData.stats];
                      next[idx].value = e.target.value;
                      setLocalData({ ...localData, stats: next });
                    }}
                    className="input-field"
                    style={{ marginBottom: '8px', fontWeight: 700, color: 'var(--blue-sky)' }}
                  />

                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const next = [...localData.stats];
                      next[idx].label = e.target.value;
                      setLocalData({ ...localData, stats: next });
                    }}
                    className="input-field"
                    style={{ marginBottom: '8px' }}
                  />

                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Subtext Detail</label>
                  <input
                    type="text"
                    value={stat.detail || ''}
                    onChange={(e) => {
                      const next = [...localData.stats];
                      next[idx].detail = e.target.value;
                      setLocalData({ ...localData, stats: next });
                    }}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
              <Save className="w-4 h-4" /> Save Statistics
            </button>
          </div>

        </div>
      )}

      {/* ===================== SECTION 3: EVENTS & POSTERS ===================== */}
      {activeSection === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                Events, Concerts & Poster Images
              </h4>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                Add live concert dates, poster images, venues, rules, and prize pools.
              </p>
            </div>

            <button
              onClick={() => {
                const newEv = {
                  id: `event-${Date.now()}`,
                  name: "New Music Event",
                  type: "Performance",
                  dateDisplay: "TBA 2026",
                  venue: "Campus Stage",
                  prizePool: "Exhibition",
                  status: "Upcoming",
                  description: "Full details of the upcoming music concert...",
                  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                };
                setLocalData({ ...localData, events: [newEv, ...(localData.events || [])] });
              }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          {(localData.events || []).map((ev, idx) => (
            <div key={ev.id || idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge-sky">Event {idx + 1}</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1.05rem' }}>{ev.name}</span>
                </div>
                <button
                  onClick={() => {
                    const next = localData.events.filter((_, i) => i !== idx);
                    setLocalData({ ...localData, events: next });
                  }}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Trash2 className="w-4 h-4" /> Delete Event
                </button>
              </div>

              {/* Two Column Layout: Event Details & Poster Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                
                {/* Left: Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Event Name</label>
                    <input
                      type="text"
                      value={ev.name}
                      onChange={(e) => {
                        const next = [...localData.events];
                        next[idx].name = e.target.value;
                        setLocalData({ ...localData, events: next });
                      }}
                      className="input-field"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Date Display</label>
                      <input
                        type="text"
                        placeholder="e.g. Nov 15, 2026"
                        value={ev.dateDisplay}
                        onChange={(e) => {
                          const next = [...localData.events];
                          next[idx].dateDisplay = e.target.value;
                          setLocalData({ ...localData, events: next });
                        }}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Status</label>
                      <select
                        value={ev.status}
                        onChange={(e) => {
                          const next = [...localData.events];
                          next[idx].status = e.target.value;
                          setLocalData({ ...localData, events: next });
                        }}
                        className="input-field"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Venue</label>
                      <input
                        type="text"
                        placeholder="e.g. Amphitheatre"
                        value={ev.venue || ''}
                        onChange={(e) => {
                          const next = [...localData.events];
                          next[idx].venue = e.target.value;
                          setLocalData({ ...localData, events: next });
                        }}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Event Category / Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Battle of Bands"
                        value={ev.type || ''}
                        onChange={(e) => {
                          const next = [...localData.events];
                          next[idx].type = e.target.value;
                          setLocalData({ ...localData, events: next });
                        }}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Prize Pool / Recognition</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹25,000 or Exhibition"
                      value={ev.prizePool || ''}
                      onChange={(e) => {
                        const next = [...localData.events];
                        next[idx].prizePool = e.target.value;
                        setLocalData({ ...localData, events: next });
                      }}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Right: Poster Image URL & Live Preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                      Poster Image URL <span style={{ color: '#38bdf8' }}>(Direct link or Google Drive link)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or Google Drive share link"
                      value={ev.image || ''}
                      onChange={(e) => {
                        const next = [...localData.events];
                        next[idx].image = formatImageUrl(e.target.value);
                        setLocalData({ ...localData, events: next });
                      }}
                      className="input-field"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Quick image suggestions: </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {PRESET_EVENT_IMAGES.map((preset, pI) => (
                        <button
                          key={pI}
                          type="button"
                          onClick={() => {
                            const next = [...localData.events];
                            next[idx].image = preset.url;
                            setLocalData({ ...localData, events: next });
                          }}
                          className="btn-ghost"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Image Preview */}
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid var(--blue-border)',
                    background: 'rgba(0,0,0,0.4)',
                    position: 'relative'
                  }}>
                    {ev.image ? (
                      <img
                        src={formatImageUrl(ev.image)}
                        alt="Event poster"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', fontSize: '0.82rem' }}>
                        No poster URL specified
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Full Description Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Event Description</label>
                <textarea
                  rows={2}
                  value={ev.description || ''}
                  onChange={(e) => {
                    const next = [...localData.events];
                    next[idx].description = e.target.value;
                    setLocalData({ ...localData, events: next });
                  }}
                  className="input-field"
                />
              </div>

            </div>
          ))}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save className="w-4 h-4" /> Save Events Changes
          </button>
        </div>
      )}

      {/* ===================== SECTION 4: BANDS SHOWCASE ===================== */}
      {activeSection === 'bands' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Configure official showcased bands on the homepage</span>
            <button
              onClick={() => {
                const newBand = {
                  id: `band-${Date.now()}`,
                  name: "New Official Band",
                  genre: "Rock / Fusion",
                  description: "Band description...",
                  image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
                  instagram: "https://www.instagram.com/vitcmusicclub",
                  members: []
                };
                setLocalData({ ...localData, bands: [...(localData.bands || []), newBand] });
              }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <Plus className="w-4 h-4" /> Add Showcase Band
            </button>
          </div>

          {(localData.bands || []).map((b, idx) => (
            <div key={b.id || idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-sky">Band {idx + 1}</span>
                <button
                  onClick={() => {
                    const next = localData.bands.filter((_, i) => i !== idx);
                    setLocalData({ ...localData, bands: next });
                  }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Band Name</label>
                  <input
                    type="text"
                    value={b.name}
                    onChange={(e) => {
                      const next = [...localData.bands];
                      next[idx].name = e.target.value;
                      setLocalData({ ...localData, bands: next });
                    }}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Genre</label>
                  <input
                    type="text"
                    value={b.genre}
                    onChange={(e) => {
                      const next = [...localData.bands];
                      next[idx].genre = e.target.value;
                      setLocalData({ ...localData, bands: next });
                    }}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                    Band Photo URL <span style={{ color: '#38bdf8' }}>(Direct link or Google Drive link)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or Google Drive share link"
                    value={b.image || ''}
                    onChange={(e) => {
                      const next = [...localData.bands];
                      next[idx].image = formatImageUrl(e.target.value);
                      setLocalData({ ...localData, bands: next });
                    }}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save className="w-4 h-4" /> Save Bands Changes
          </button>
        </div>
      )}

      {/* ===================== SECTION 5: TENURES & BOARD MEMBERS ===================== */}
      {activeSection === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Academic Tenures Manager Bar */}
          <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                  Academic Tenure Rosters
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                  Select an academic tenure to edit, or add blank tenures (e.g. 2025-26, 2026-27).
                </p>
              </div>

              {/* Add New Tenure Form */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="e.g. 2027-28"
                  value={newSessionInput}
                  onChange={(e) => setNewSessionInput(e.target.value)}
                  className="input-field"
                  style={{ width: '130px', padding: '6px 12px', fontSize: '0.82rem' }}
                />
                <button
                  onClick={handleAddSession}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tenure
                </button>
              </div>
            </div>

            {/* Tenure Selector Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {sessionKeys.map((sess) => (
                <div key={sess} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => setSelectedSession(sess)}
                    style={{
                      background: selectedSession === sess ? 'var(--blue-primary)' : 'rgba(255,255,255,0.03)',
                      color: selectedSession === sess ? '#fff' : '#CBD5E1',
                      border: selectedSession === sess ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Tenure {sess} ({((teamSessions[sess]) || []).length})
                  </button>
                  {sessionKeys.length > 1 && (
                    <button
                      onClick={() => handleDeleteSession(sess)}
                      title={`Delete entire tenure ${sess}`}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#f87171',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Members of selectedSession */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
              Board Members for <strong>Tenure {selectedSession}</strong> ({activeMembers.length} members)
            </span>
            <button
              onClick={() => handleAddMemberToSession(selectedSession)}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              <Plus className="w-4 h-4" /> Add Board Member
            </button>
          </div>

          {activeMembers.length === 0 ? (
            <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
              Tenure {selectedSession} is currently empty. Click "Add Board Member" above when ready to list core members.
            </div>
          ) : (
            activeMembers.map((m, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge-sky" style={{ fontSize: '0.78rem' }}>#{idx + 1} {m.role || 'Member'}</span>
                  <button
                    onClick={() => handleRemoveMemberFromSession(selectedSession, idx)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    title="Remove this board member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Role / Designation</label>
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'role', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Name</label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'name', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Instrument / Focus</label>
                    <input
                      type="text"
                      value={m.instrument}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'instrument', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                      Photo URL <span style={{ color: '#38bdf8' }}>(Direct link or Google Drive link)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank or paste image / Google Drive share link"
                      value={m.image || ''}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'image', formatImageUrl(e.target.value))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Instagram URL</label>
                    <input
                      type="text"
                      value={m.instagram || ''}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'instagram', e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>LinkedIn URL</label>
                    <input
                      type="text"
                      value={m.linkedin || ''}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'linkedin', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
            <Save className="w-4 h-4" /> Save Board Changes
          </button>
        </div>
      )}

      {/* ===================== SECTION 6: FAQS ===================== */}
      {activeSection === 'faqs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Manage frequently asked questions on the homepage</span>
            <button
              onClick={() => {
                const nextFaqs = [...(localData.faqs || []), { q: "New Question?", a: "Answer text here..." }];
                setLocalData({ ...localData, faqs: nextFaqs });
              }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          {(localData.faqs || []).map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-sky">FAQ {idx + 1}</span>
                <button
                  onClick={() => {
                    const next = localData.faqs.filter((_, i) => i !== idx);
                    setLocalData({ ...localData, faqs: next });
                  }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Question</label>
                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => {
                    const next = [...localData.faqs];
                    next[idx].q = e.target.value;
                    setLocalData({ ...localData, faqs: next });
                  }}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Answer</label>
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={(e) => {
                    const next = [...localData.faqs];
                    next[idx].a = e.target.value;
                    setLocalData({ ...localData, faqs: next });
                  }}
                  className="input-field"
                />
              </div>
            </div>
          ))}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save className="w-4 h-4" /> Save FAQs
          </button>
        </div>
      )}

      {/* ===================== SECTION 7: CONTACT & SOCIALS ===================== */}
      {activeSection === 'contact' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1rem' }}>Official Contact & Social Links</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Official Email</label>
              <input
                type="text"
                value={localData.contact?.email || ''}
                onChange={(e) => updateField('contact.email', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Instagram Page URL</label>
              <input
                type="text"
                value={localData.contact?.instagram || ''}
                onChange={(e) => updateField('contact.instagram', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>YouTube Channel URL</label>
              <input
                type="text"
                value={localData.contact?.youtube || ''}
                onChange={(e) => updateField('contact.youtube', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <Save className="w-4 h-4" /> Save Contact Changes
          </button>
        </div>
      )}

      {/* ===================== SECTION 8: PHOTO GALLERY CMS ===================== */}
      {activeSection === 'gallery' && (() => {
        const photos = localData.gallery?.photos || [];
        const existingAlbums = Array.from(new Set(photos.map(p => p.album).filter(Boolean)));

        const handleAddPhoto = () => {
          const newPhoto = {
            id: `photo-${Date.now()}`,
            title: "New Club Moment",
            album: existingAlbums[0] || "Concerts",
            url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80",
            date: "2026",
            caption: "Live stage performance at VIT Chennai."
          };
          const nextPhotos = [newPhoto, ...photos];
          setLocalData({
            ...localData,
            gallery: {
              ...(localData.gallery || {}),
              photos: nextPhotos
            }
          });
        };

        const handleDeletePhoto = (idx) => {
          const nextPhotos = photos.filter((_, i) => i !== idx);
          setLocalData({
            ...localData,
            gallery: {
              ...(localData.gallery || {}),
              photos: nextPhotos
            }
          });
        };

        const handleUpdatePhoto = (idx, field, value) => {
          const nextPhotos = [...photos];
          nextPhotos[idx] = { ...nextPhotos[idx], [field]: value };
          setLocalData({
            ...localData,
            gallery: {
              ...(localData.gallery || {}),
              photos: nextPhotos
            }
          });
        };

        const handleMovePhoto = (idx, direction) => {
          const targetIdx = idx + direction;
          if (targetIdx < 0 || targetIdx >= photos.length) return;
          const nextPhotos = [...photos];
          const temp = nextPhotos[idx];
          nextPhotos[idx] = nextPhotos[targetIdx];
          nextPhotos[targetIdx] = temp;
          setLocalData({
            ...localData,
            gallery: {
              ...(localData.gallery || {}),
              photos: nextPhotos
            }
          });
        };

        return (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>
                  Photo & Video Gallery Management
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '3px 0 0 0' }}>
                  Add direct image links or Google Drive share links. Google Drive file links are automatically converted to fast CDN photos.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleAddPhoto}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus className="w-4 h-4" /> Add Photo
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save className="w-4 h-4" /> Save Gallery
                </button>
              </div>
            </div>

            {/* General Gallery Settings */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--blue-border)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontWeight: 600, color: 'var(--blue-sky)', fontSize: '0.88rem' }}>Page Headers & Drive Folder</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '6px' }}>Gallery Page Title</label>
                  <input
                    type="text"
                    value={localData.gallery?.title || ''}
                    onChange={(e) => updateField('gallery.title', e.target.value)}
                    placeholder="Club Photo & Video Gallery"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '6px' }}>Subtitle</label>
                  <input
                    type="text"
                    value={localData.gallery?.subtitle || ''}
                    onChange={(e) => updateField('gallery.subtitle', e.target.value)}
                    placeholder="Concerts, acoustic jams, auditions, and behind-the-scenes moments"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '6px' }}>
                    Google Drive Folder Link (Optional shortcut button on page)
                  </label>
                  <input
                    type="url"
                    value={localData.gallery?.driveFolderUrl || ''}
                    onChange={(e) => updateField('gallery.driveFolderUrl', e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Photos List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
                Photos List ({photos.length} total)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Tip: Paste any Google Drive share link (e.g. drive.google.com/file/d/...) and it will display instantly.
              </div>
            </div>

            {photos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--blue-border)' }}>
                <ImageIcon className="w-10 h-10 text-slate-500" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ color: '#F1F5F9', fontWeight: 600 }}>No photos added to the gallery yet</div>
                <button onClick={handleAddPhoto} className="btn-secondary" style={{ marginTop: '12px', fontSize: '0.82rem' }}>
                  <Plus className="w-4 h-4" /> Add Your First Photo
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {photos.map((photo, idx) => {
                  const previewSrc = formatImageUrl(photo.url);

                  return (
                    <div 
                      key={photo.id || idx} 
                      className="glass-panel" 
                      style={{ 
                        padding: '18px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '14px', 
                        border: '1px solid var(--blue-border)', 
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.75)'
                      }}
                    >
                      {/* Top Row: Badge, Reorder, Delete */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="badge-sky">#{idx + 1}</span>
                          <span style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.95rem' }}>
                            {photo.title || 'Untitled Photo'}
                          </span>
                          {photo.album && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--blue-sky)', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '2px 8px', borderRadius: '10px' }}>
                              {photo.album}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleMovePhoto(idx, -1)}
                            disabled={idx === 0}
                            className="btn-ghost"
                            style={{ padding: '5px 8px', fontSize: '0.75rem', opacity: idx === 0 ? 0.3 : 1 }}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMovePhoto(idx, 1)}
                            disabled={idx === photos.length - 1}
                            className="btn-ghost"
                            style={{ padding: '5px 8px', fontSize: '0.75rem', opacity: idx === photos.length - 1 ? 0.3 : 1 }}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePhoto(idx)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem'
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Content Form & Live Preview */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 180px) 1fr', gap: '18px', alignItems: 'start' }}>
                        {/* Live Image Preview */}
                        <div 
                          style={{ 
                            width: '100%', 
                            height: '140px', 
                            borderRadius: '10px', 
                            overflow: 'hidden', 
                            background: 'rgba(2, 6, 23, 0.6)', 
                            border: '1px solid var(--blue-border)',
                            position: 'relative'
                          }}
                        >
                          {previewSrc ? (
                            <img 
                              src={previewSrc} 
                              alt="Preview" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', fontSize: '0.75rem' }}>
                              No URL
                            </div>
                          )}
                        </div>

                        {/* Input Fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Photo Title</label>
                            <input
                              type="text"
                              value={photo.title || ''}
                              onChange={(e) => handleUpdatePhoto(idx, 'title', e.target.value)}
                              placeholder="e.g. Battle of the Bands Finale"
                              className="input-field"
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                              Album / Event Category
                            </label>
                            <input
                              type="text"
                              list={`albums-list-${idx}`}
                              value={photo.album || ''}
                              onChange={(e) => handleUpdatePhoto(idx, 'album', e.target.value)}
                              placeholder="e.g. Riviera Concerts, Acoustic Jams"
                              className="input-field"
                            />
                            <datalist id={`albums-list-${idx}`}>
                              {existingAlbums.map(a => <option key={a} value={a} />)}
                            </datalist>
                          </div>

                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                              Image URL <span style={{ color: '#38bdf8' }}>(Direct image link OR Google Drive file link)</span>
                            </label>
                            <input
                              type="text"
                              value={photo.url || ''}
                              onChange={(e) => handleUpdatePhoto(idx, 'url', formatImageUrl(e.target.value))}
                              placeholder="https://drive.google.com/file/d/.../view or https://..."
                              className="input-field"
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Date / Year</label>
                            <input
                              type="text"
                              value={photo.date || ''}
                              onChange={(e) => handleUpdatePhoto(idx, 'date', e.target.value)}
                              placeholder="e.g. March 2026, Riviera 2k26"
                              className="input-field"
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Caption / Brief Note</label>
                            <input
                              type="text"
                              value={photo.caption || ''}
                              onChange={(e) => handleUpdatePhoto(idx, 'caption', e.target.value)}
                              placeholder="Brief description of the moment..."
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button 
              onClick={handleSave} 
              className="btn-primary" 
              style={{ alignSelf: 'flex-start', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save className="w-4 h-4" /> Save Gallery Changes
            </button>
          </div>
        );
      })()}

    </div>
  );
};
