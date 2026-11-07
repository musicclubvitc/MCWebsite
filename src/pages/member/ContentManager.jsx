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
  AlertCircle
} from 'lucide-react';

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
    showToast("Website content updated successfully!");
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
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // ----------------- BOARD SESSIONS MANAGEMENT -----------------
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
    setSelectedSession(remainingKeys[0]);
    showToast(`Removed board tenure ${sessName}`);
  };

  const handleAddMemberToSession = (sessName) => {
    const nextTeam = { ...teamSessions };
    const currentList = nextTeam[sessName] || [];
    nextTeam[sessName] = [
      ...currentList,
      {
        role: "Board Member",
        name: "",
        image: "",
        instrument: "",
        instagram: "https://www.instagram.com/vitcmusicclub",
        linkedin: "https://linkedin.com"
      }
    ];
    setLocalData({ ...localData, team: nextTeam });
  };

  const handleRemoveMemberFromSession = (sessName, mIdx) => {
    const nextTeam = { ...teamSessions };
    nextTeam[sessName] = nextTeam[sessName].filter((_, idx) => idx !== mIdx);
    setLocalData({ ...localData, team: nextTeam });
  };

  const handleUpdateMember = (sessName, mIdx, field, value) => {
    const nextTeam = { ...teamSessions };
    const updatedMember = { ...nextTeam[sessName][mIdx], [field]: value };
    nextTeam[sessName][mIdx] = updatedMember;
    setLocalData({ ...localData, team: nextTeam });
  };

  const activeMembers = (teamSessions[selectedSession]) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner with Export / Import buttons */}
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
              No-Code Content Manager
            </h3>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Update events, bands, multi-year core board rosters, and contact links without touching source code.
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
          { id: 'events', label: 'Events Editor' },
          { id: 'bands', label: 'Bands Editor' },
          { id: 'team', label: 'Board Members (Multi-Year)' },
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
              cursor: 'pointer'
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: SITE & HERO */}
      {activeSection === 'site' && (
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1rem' }}>General Club Information</h4>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '6px' }}>Hero Description</label>
            <textarea
              rows={3}
              value={localData.site?.description || ''}
              onChange={(e) => updateField('site.description', e.target.value)}
              className="input-field"
            />
          </div>

          <h4 style={{ color: '#38BDF8', fontWeight: 700, fontSize: '1rem', marginTop: '10px' }}>Live Club Statistics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {(localData.stats || []).map((stat, idx) => (
              <div key={idx} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid var(--blue-border)' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Counter Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...localData.stats];
                    next[idx].value = e.target.value;
                    setLocalData({ ...localData, stats: next });
                  }}
                  className="input-field"
                  style={{ marginBottom: '8px' }}
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
                />
              </div>
            ))}
          </div>

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
            <Save className="w-4 h-4" /> Save Site Changes
          </button>
        </div>
      )}

      {/* SECTION 2: EVENTS */}
      {activeSection === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>Manage upcoming and past concerts & competitions</span>
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
                  description: "Event details...",
                  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
                };
                setLocalData({ ...localData, events: [newEv, ...(localData.events || [])] });
              }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </div>

          {(localData.events || []).map((ev, idx) => (
            <div key={ev.id || idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-sky">Event {idx + 1}</span>
                <button
                  onClick={() => {
                    const next = localData.events.filter((_, i) => i !== idx);
                    setLocalData({ ...localData, events: next });
                  }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Date Display</label>
                  <input
                    type="text"
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
            </div>
          ))}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save className="w-4 h-4" /> Save Events Changes
          </button>
        </div>
      )}

      {/* SECTION 3: BANDS */}
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
              </div>
            </div>
          ))}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            <Save className="w-4 h-4" /> Save Bands Changes
          </button>
        </div>
      )}

      {/* SECTION 4: TEAM (MULTI-YEAR & DYNAMIC SESSIONS) */}
      {activeSection === 'team' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Academic Sessions Manager Bar */}
          <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                  Academic Session Rosters
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                  Select an academic session to edit, or create / delete entire boards.
                </p>
              </div>

              {/* Add New Session Form */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="e.g. 2025-26"
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
                  <Plus className="w-3.5 h-3.5" /> Add Board Year
                </button>
              </div>
            </div>

            {/* Session Selector Pills */}
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
              No members in Tenure {selectedSession} yet. Click "Add Board Member" above to create one.
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
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Photo URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="Leave blank or paste image link"
                      value={m.image || ''}
                      onChange={(e) => handleUpdateMember(selectedSession, idx, 'image', e.target.value)}
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

      {/* SECTION 5: CONTACT & SOCIALS */}
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

    </div>
  );
};
