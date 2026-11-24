import React, { useState, useEffect } from 'react';
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
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { formatImageUrl } from '../../lib/galleryUtils';
import { sortTenuresDesc, getOrderedTenures } from '../../lib/teamUtils';
import { getNextLinearId } from '../../lib/idUtils';
import { ConfirmModal } from '../../components/ConfirmModal';
import { DEFAULT_INSTRUCTIONS, INSTRUCTION_ICON_OPTIONS, getInstructionIcon } from '../../data/instructionData';

export const ContentManager = () => {
  const { content, updateContent, resetToDefault, exportContentJson, importContentJson } = useContent();
  const { showToast } = useAuth();

  const [activeSection, setActiveSection] = useState('site');
  const [localData, setLocalData] = useState(() => {
    const data = JSON.parse(JSON.stringify(content || {}));
    if (!data.instructions) {
      data.instructions = DEFAULT_INSTRUCTIONS;
    }
    return data;
  });
  const [importStatus, setImportStatus] = useState('');
  const [confirmState, setConfirmState] = useState(null);

  const requestConfirm = ({ title, message, confirmText = 'Delete', variant = 'danger', onConfirm }) => {
    setConfirmState({ title, message, confirmText, variant, onConfirm });
  };

  // Team session states
  const teamSessions = localData.team || { "2024-25": [] };
  const sessionKeys = getOrderedTenures(teamSessions, localData.teamOrder);
  const [selectedSession, setSelectedSession] = useState(sessionKeys[0] || "2026-27");
  const [newSessionInput, setNewSessionInput] = useState('');

  // Keep selectedSession synced if sessionKeys change
  useEffect(() => {
    if (sessionKeys.length > 0 && !sessionKeys.includes(selectedSession)) {
      setSelectedSession(sessionKeys[0]);
    }
  }, [sessionKeys, selectedSession]);

  // Instructions states
  const instructionsData = localData.instructions || DEFAULT_INSTRUCTIONS;
  const instructionTabs = Array.isArray(instructionsData.tabs) && instructionsData.tabs.length > 0
    ? instructionsData.tabs
    : DEFAULT_INSTRUCTIONS.tabs;
  const [selectedInstructionTabId, setSelectedInstructionTabId] = useState(instructionTabs[0]?.id || 'account');

  // Keep selectedInstructionTabId synced
  useEffect(() => {
    if (instructionTabs.length > 0 && !instructionTabs.some(t => t.id === selectedInstructionTabId)) {
      setSelectedInstructionTabId(instructionTabs[0].id);
    }
  }, [instructionTabs, selectedInstructionTabId]);

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
  const handleSortTenuresLatestFirst = () => {
    const sorted = [...sessionKeys].sort(sortTenuresDesc);
    setLocalData({ ...localData, teamOrder: sorted });
    setSelectedSession(sorted[0]);
    showToast("Tenures sorted newest first!");
  };

  const handleMoveTenure = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sessionKeys.length) return;
    const newOrder = [...sessionKeys];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    setLocalData({ ...localData, teamOrder: newOrder });
  };

  const handleAddSession = () => {
    const name = newSessionInput.trim();
    if (!name) {
      showToast("Please enter an academic tenure name (e.g. 2027-28)", "error");
      return;
    }
    if (teamSessions[name]) {
      showToast("Tenure already exists", "error");
      return;
    }
    const nextTeam = { ...teamSessions, [name]: [] };
    const nextOrder = [name, ...sessionKeys.filter(k => k !== name)];
    setLocalData({ ...localData, team: nextTeam, teamOrder: nextOrder });
    setSelectedSession(name);
    setNewSessionInput('');
    showToast(`Created board tenure ${name}!`);
  };

  const handleDeleteSession = (sessName) => {
    if (sessionKeys.length <= 1) {
      showToast("At least one board tenure must remain", "error");
      return;
    }
    requestConfirm({
      title: `Delete Tenure ${sessName}?`,
      message: `Are you sure you want to delete tenure session ${sessName} and all its members?`,
      confirmText: 'Delete Tenure',
      onConfirm: () => {
        const nextTeam = { ...teamSessions };
        delete nextTeam[sessName];
        const nextOrder = sessionKeys.filter(k => k !== sessName);
        const remainingKeys = getOrderedTenures(nextTeam, nextOrder);
        setLocalData({ ...localData, team: nextTeam, teamOrder: nextOrder });
        if (selectedSession === sessName) {
          setSelectedSession(remainingKeys[0] || "2026-27");
        }
        showToast(`Deleted board tenure ${sessName}`);
      }
    });
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

  // ----------------- INSTRUCTIONS CMS MANAGEMENT -----------------
  const currentInstructionTab = instructionTabs.find(t => t.id === selectedInstructionTabId) || instructionTabs[0] || {};
  const currentInstructionTabIndex = instructionTabs.findIndex(t => t.id === currentInstructionTab.id);

  const updateInstructionsData = (updatedFields) => {
    setLocalData({
      ...localData,
      instructions: {
        ...instructionsData,
        ...updatedFields
      }
    });
  };

  const updateActiveInstructionTab = (updatedTabFields) => {
    const updatedTabs = instructionTabs.map(t => 
      t.id === currentInstructionTab.id ? { ...t, ...updatedTabFields } : t
    );
    updateInstructionsData({ tabs: updatedTabs });
  };

  const handleAddInstructionTab = () => {
    const tabNum = instructionTabs.length + 1;
    const newId = `section_${Date.now()}`;
    const newTab = {
      id: newId,
      label: `${tabNum}. New Guideline`,
      icon: "BookOpen",
      title: "New Club Guideline Section",
      subtitle: "Guideline instructions and operating rules for club musicians",
      actionText: "Open Portal",
      actionTarget: "member-dashboard",
      notice: "Official guidelines notice for this section.",
      items: [
        {
          num: "01",
          title: "Initial Guideline Rule",
          desc: "Detail the specific rule or procedure that members must follow."
        }
      ]
    };
    const nextTabs = [...instructionTabs, newTab];
    updateInstructionsData({ tabs: nextTabs });
    setSelectedInstructionTabId(newId);
    showToast("Added new instructions tab!");
  };

  const handleDeleteInstructionTab = (tabId) => {
    if (instructionTabs.length <= 1) {
      showToast("At least one instruction tab must remain", "error");
      return;
    }
    requestConfirm({
      title: 'Delete Instruction Tab?',
      message: 'Are you sure you want to delete this instruction tab and all its rules?',
      confirmText: 'Delete Tab',
      onConfirm: () => {
        const nextTabs = instructionTabs.filter(t => t.id !== tabId);
        updateInstructionsData({ tabs: nextTabs });
        setSelectedInstructionTabId(nextTabs[0]?.id || "");
        showToast("Instruction tab deleted");
      }
    });
  };

  const handleMoveInstructionTab = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= instructionTabs.length) return;
    const nextTabs = [...instructionTabs];
    const [moved] = nextTabs.splice(index, 1);
    nextTabs.splice(targetIndex, 0, moved);
    updateInstructionsData({ tabs: nextTabs });
  };

  const handleAddRuleToTab = () => {
    const currentRules = Array.isArray(currentInstructionTab.items) ? currentInstructionTab.items : [];
    const ruleNum = currentRules.length + 1;
    const formattedNum = ruleNum < 10 ? `0${ruleNum}` : `${ruleNum}`;
    const newRule = {
      num: formattedNum,
      title: "New Rule Title",
      desc: "Describe this guideline rule clearly so students understand expectations."
    };
    updateActiveInstructionTab({ items: [...currentRules, newRule] });
  };

  const handleUpdateRuleInTab = (ruleIndex, updatedRule) => {
    const currentRules = [...(currentInstructionTab.items || [])];
    currentRules[ruleIndex] = { ...currentRules[ruleIndex], ...updatedRule };
    updateActiveInstructionTab({ items: currentRules });
  };

  const handleDeleteRuleFromTab = (ruleIndex) => {
    const currentRules = (currentInstructionTab.items || []).filter((_, i) => i !== ruleIndex);
    updateActiveInstructionTab({ items: currentRules });
  };

  const handleMoveRuleInTab = (ruleIndex, direction) => {
    const currentRules = [...(currentInstructionTab.items || [])];
    const targetIndex = ruleIndex + direction;
    if (targetIndex < 0 || targetIndex >= currentRules.length) return;
    const [moved] = currentRules.splice(ruleIndex, 1);
    currentRules.splice(targetIndex, 0, moved);
    updateActiveInstructionTab({ items: currentRules });
  };

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
              requestConfirm({
                title: 'Reset All Content?',
                message: 'Are you sure you want to reset all website CMS content back to factory defaults? Unsaved changes will be lost.',
                confirmText: 'Reset Content',
                variant: 'warning',
                onConfirm: () => {
                  resetToDefault();
                  setLocalData(JSON.parse(JSON.stringify(content)));
                  showToast("Content reset to defaults", "info");
                }
              });
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
          { id: 'instructions', label: 'Instructions & Rules' },
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
                  description: "",
                  image: ""
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
                    requestConfirm({
                      title: 'Delete Event?',
                      message: `Are you sure you want to remove "${ev.name || `Event ${idx + 1}`}"?`,
                      confirmText: 'Delete Event',
                      onConfirm: () => {
                        const next = localData.events.filter((_, i) => i !== idx);
                        setLocalData({ ...localData, events: next });
                      }
                    });
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
                      placeholder="Paste image URL or Google Drive share link"
                      value={ev.image || ''}
                      onChange={(e) => {
                        const next = [...localData.events];
                        next[idx].image = formatImageUrl(e.target.value);
                        setLocalData({ ...localData, events: next });
                      }}
                      className="input-field"
                    />
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
                  id: getNextLinearId(localData.bands, 'band', 1),
                  name: "New Official Band",
                  genre: "Rock / Fusion",
                  description: "",
                  image: "",
                  instagram: "",
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
            <div key={b.id || idx} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge-sky">Band {idx + 1}</span>
                  <span style={{ fontSize: '0.85rem', color: '#F1F5F9', fontWeight: 600 }}>{b.name || 'Unnamed Band'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => {
                      if (idx === 0) return;
                      const next = [...localData.bands];
                      const [moved] = next.splice(idx, 1);
                      next.splice(idx - 1, 0, moved);
                      setLocalData({ ...localData, bands: next });
                    }}
                    disabled={idx === 0}
                    title="Move band up in carousel order"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: idx === 0 ? '#475569' : '#94A3B8',
                      cursor: idx === 0 ? 'default' : 'pointer',
                      padding: '2px 4px'
                    }}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (idx === (localData.bands || []).length - 1) return;
                      const next = [...localData.bands];
                      const [moved] = next.splice(idx, 1);
                      next.splice(idx + 1, 0, moved);
                      setLocalData({ ...localData, bands: next });
                    }}
                    disabled={idx === (localData.bands || []).length - 1}
                    title="Move band down in carousel order"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: idx === (localData.bands || []).length - 1 ? '#475569' : '#94A3B8',
                      cursor: idx === (localData.bands || []).length - 1 ? 'default' : 'pointer',
                      padding: '2px 4px'
                    }}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      requestConfirm({
                        title: 'Delete Band?',
                        message: `Are you sure you want to remove "${b.name || `Band ${idx + 1}`}" from the showcase?`,
                        confirmText: 'Delete Band',
                        onConfirm: () => {
                          const next = localData.bands.filter((_, i) => i !== idx);
                          setLocalData({ ...localData, bands: next });
                        }
                      });
                    }}
                    title="Delete band"
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Band Name</label>
                  <input
                    type="text"
                    value={b.name || ''}
                    placeholder="e.g. Six Delusions"
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
                    value={b.genre || ''}
                    placeholder="e.g. Hard Rock & Funk"
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

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                  Band Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the band's musical style, influences, history, and stage highlights..."
                  value={b.description || ''}
                  onChange={(e) => {
                    const next = [...localData.bands];
                    next[idx].description = e.target.value;
                    setLocalData({ ...localData, bands: next });
                  }}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>
                  Follow Link / Social URL <span style={{ color: '#94a3b8' }}>(Instagram, Spotify, YouTube, or Linktree URL)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/bandname"
                  value={b.instagram || b.followUrl || b.link || ''}
                  onChange={(e) => {
                    const next = [...localData.bands];
                    next[idx].instagram = e.target.value;
                    setLocalData({ ...localData, bands: next });
                  }}
                  className="input-field"
                />
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

              {/* Add New Tenure Form & Sort */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSortTenuresLatestFirst}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Sort all academic tenures descending (newest first)"
                >
                  <ArrowDown className="w-3.5 h-3.5" /> Sort Latest First
                </button>
                <input
                  type="text"
                  placeholder="e.g. 2027-28"
                  value={newSessionInput}
                  onChange={(e) => setNewSessionInput(e.target.value)}
                  className="input-field"
                  style={{ width: '120px', padding: '6px 12px', fontSize: '0.82rem' }}
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

            {/* Tenure Selector Pills with Reordering */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {sessionKeys.map((sess, idx) => (
                <div 
                  key={sess} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: selectedSession === sess ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: selectedSession === sess ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                    borderRadius: '8px',
                    padding: '3px 6px',
                    gap: '2px'
                  }}
                >
                  {/* Move Left */}
                  <button
                    onClick={() => handleMoveTenure(idx, -1)}
                    disabled={idx === 0}
                    title="Move tenure earlier"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: idx === 0 ? '#475569' : '#94A3B8',
                      cursor: idx === 0 ? 'default' : 'pointer',
                      padding: '3px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedSession(sess)}
                    style={{
                      background: selectedSession === sess ? 'var(--blue-primary)' : 'transparent',
                      color: selectedSession === sess ? '#fff' : '#CBD5E1',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Tenure {sess} ({((teamSessions[sess]) || []).length})
                  </button>

                  {/* Move Right */}
                  <button
                    onClick={() => handleMoveTenure(idx, 1)}
                    disabled={idx === sessionKeys.length - 1}
                    title="Move tenure later"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: idx === sessionKeys.length - 1 ? '#475569' : '#94A3B8',
                      cursor: idx === sessionKeys.length - 1 ? 'default' : 'pointer',
                      padding: '3px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
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
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '2px'
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

      {/* ===================== SECTION: INSTRUCTIONS & RULES ===================== */}
      {activeSection === 'instructions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header & Meta Panel */}
          <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
              Instructions Page Headers & Meta
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Badge Text</label>
                <input
                  type="text"
                  value={instructionsData.badge || ''}
                  onChange={(e) => updateInstructionsData({ badge: e.target.value })}
                  placeholder="e.g. CLUB GUIDELINES"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Page Title</label>
                <input
                  type="text"
                  value={instructionsData.title || ''}
                  onChange={(e) => updateInstructionsData({ title: e.target.value })}
                  placeholder="e.g. Instructions & Rules"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Page Subtitle</label>
              <textarea
                rows={2}
                value={instructionsData.subtitle || ''}
                onChange={(e) => updateInstructionsData({ subtitle: e.target.value })}
                placeholder="Description text appearing under the page header..."
                className="input-field"
              />
            </div>
          </div>

          {/* Instruction Tabs Manager Bar */}
          <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                  Instruction Tabs ({instructionTabs.length})
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '2px 0 0 0' }}>
                  Select a guideline tab to edit its details and rules, or reorder them using the arrows.
                </p>
              </div>

              <button
                onClick={handleAddInstructionTab}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                <Plus className="w-3.5 h-3.5" /> Add New Tab
              </button>
            </div>

            {/* Tab Pills with Reordering */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {instructionTabs.map((tab, idx) => {
                const TabIconComponent = getInstructionIcon(tab.icon);
                const isSelected = currentInstructionTab.id === tab.id;
                return (
                  <div 
                    key={tab.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      background: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                      borderRadius: '8px',
                      padding: '3px 6px',
                      gap: '2px'
                    }}
                  >
                    {/* Move Left */}
                    <button
                      onClick={() => handleMoveInstructionTab(idx, -1)}
                      disabled={idx === 0}
                      title="Move tab left"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: idx === 0 ? '#475569' : '#94A3B8',
                        cursor: idx === 0 ? 'default' : 'pointer',
                        padding: '3px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedInstructionTabId(tab.id)}
                      style={{
                        background: isSelected ? 'var(--blue-primary)' : 'transparent',
                        color: isSelected ? '#fff' : '#CBD5E1',
                        border: 'none',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <TabIconComponent className="w-3.5 h-3.5" />
                      {tab.label || `Tab ${idx + 1}`} ({(tab.items || []).length})
                    </button>

                    {/* Move Right */}
                    <button
                      onClick={() => handleMoveInstructionTab(idx, 1)}
                      disabled={idx === instructionTabs.length - 1}
                      title="Move tab right"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: idx === instructionTabs.length - 1 ? '#475569' : '#94A3B8',
                        cursor: idx === instructionTabs.length - 1 ? 'default' : 'pointer',
                        padding: '3px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {instructionTabs.length > 1 && (
                      <button
                        onClick={() => handleDeleteInstructionTab(tab.id)}
                        title={`Delete tab ${tab.label}`}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#f87171',
                          borderRadius: '6px',
                          padding: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '2px'
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Tab Configuration Panel */}
          {currentInstructionTab && (
            <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-sky" style={{ fontSize: '0.8rem' }}>
                  Editing Tab: {currentInstructionTab.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  ID: {currentInstructionTab.id}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Tab Button Label</label>
                  <input
                    type="text"
                    value={currentInstructionTab.label || ''}
                    onChange={(e) => updateActiveInstructionTab({ label: e.target.value })}
                    placeholder="e.g. 1. Account Setup"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Tab Icon</label>
                  <select
                    value={currentInstructionTab.icon || 'BookOpen'}
                    onChange={(e) => updateActiveInstructionTab({ icon: e.target.value })}
                    className="input-field"
                    style={{ background: '#0f172a' }}
                  >
                    {INSTRUCTION_ICON_OPTIONS.map((iconOpt) => (
                      <option key={iconOpt} value={iconOpt}>
                        {iconOpt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Header Title</label>
                  <input
                    type="text"
                    value={currentInstructionTab.title || ''}
                    onChange={(e) => updateActiveInstructionTab({ title: e.target.value })}
                    placeholder="e.g. Member Registration & Verification"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Header Subtitle</label>
                  <input
                    type="text"
                    value={currentInstructionTab.subtitle || ''}
                    onChange={(e) => updateActiveInstructionTab({ subtitle: e.target.value })}
                    placeholder="Brief description for this guideline section"
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Action Button Text (Optional)</label>
                  <input
                    type="text"
                    value={currentInstructionTab.actionText || ''}
                    onChange={(e) => updateActiveInstructionTab({ actionText: e.target.value })}
                    placeholder="e.g. Open Member Portal (leave empty to hide)"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Action Button Target Page</label>
                  <select
                    value={currentInstructionTab.actionTarget || ''}
                    onChange={(e) => updateActiveInstructionTab({ actionTarget: e.target.value })}
                    className="input-field"
                    style={{ background: '#0f172a' }}
                  >
                    <option value="">None (No link)</option>
                    <option value="member-dashboard">Member Portal / Dashboard</option>
                    <option value="member-slot">Music Room Booking (member-slot)</option>
                    <option value="member-instruments">Instrument Requisition (member-instruments)</option>
                    <option value="member-bands">Band Registration (member-bands)</option>
                    <option value="events">Events Showcase (events)</option>
                    <option value="gallery">Photo Gallery (gallery)</option>
                    <option value="team">Team Page (team)</option>
                    <option value="contact">Contact Us (contact)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#CBD5E1', marginBottom: '4px' }}>Official Notice Callout (Optional)</label>
                <textarea
                  rows={2}
                  value={currentInstructionTab.notice || ''}
                  onChange={(e) => updateActiveInstructionTab({ notice: e.target.value })}
                  placeholder="Official notice or advice banner appearing at the bottom of this tab..."
                  className="input-field"
                />
              </div>

              {/* Rules List for this tab */}
              <div style={{ borderTop: '1px solid var(--blue-border)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
                    Guideline Rules & Procedures ({(currentInstructionTab.items || []).length})
                  </h5>
                  <button
                    onClick={handleAddRuleToTab}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Rule Card
                  </button>
                </div>

                {((currentInstructionTab.items) || []).length === 0 ? (
                  <div style={{ color: '#94A3B8', fontSize: '0.85rem', padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    No rules added for this tab yet. Click "Add Rule Card" above to add instructions.
                  </div>
                ) : (
                  (currentInstructionTab.items || []).map((rule, rIdx) => (
                    <div 
                      key={rIdx} 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        border: '1px solid var(--blue-border)', 
                        borderRadius: '10px', 
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge-sky" style={{ fontSize: '0.75rem' }}>
                            RULE #{rule.num || (rIdx + 1 < 10 ? `0${rIdx + 1}` : rIdx + 1)}
                          </span>
                          <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Item {rIdx + 1}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleMoveRuleInTab(rIdx, -1)}
                            disabled={rIdx === 0}
                            title="Move rule up"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: rIdx === 0 ? '#475569' : '#94A3B8',
                              cursor: rIdx === 0 ? 'default' : 'pointer',
                              padding: '2px 4px'
                            }}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveRuleInTab(rIdx, 1)}
                            disabled={rIdx === (currentInstructionTab.items || []).length - 1}
                            title="Move rule down"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: rIdx === (currentInstructionTab.items || []).length - 1 ? '#475569' : '#94A3B8',
                              cursor: rIdx === (currentInstructionTab.items || []).length - 1 ? 'default' : 'pointer',
                              padding: '2px 4px'
                            }}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRuleFromTab(rIdx)}
                            title="Delete this rule"
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#f87171',
                              borderRadius: '4px',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', color: '#CBD5E1', marginBottom: '2px' }}>Number</label>
                          <input
                            type="text"
                            value={rule.num || ''}
                            onChange={(e) => handleUpdateRuleInTab(rIdx, { num: e.target.value })}
                            placeholder="01"
                            className="input-field"
                            style={{ textAlign: 'center' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', color: '#CBD5E1', marginBottom: '2px' }}>Rule Title</label>
                          <input
                            type="text"
                            value={rule.title || ''}
                            onChange={(e) => handleUpdateRuleInTab(rIdx, { title: e.target.value })}
                            placeholder="e.g. Access the Member Portal"
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#CBD5E1', marginBottom: '2px' }}>Rule Description</label>
                        <textarea
                          rows={2}
                          value={rule.desc || ''}
                          onChange={(e) => handleUpdateRuleInTab(rIdx, { desc: e.target.value })}
                          placeholder="Describe the rule requirement or procedure..."
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button onClick={handleSave} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
            <Save className="w-4 h-4" /> Save Instructions & Rules
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
            url: "",
            date: new Date().getFullYear().toString(),
            caption: ""
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
          const targetPhoto = photos[idx];
          requestConfirm({
            title: 'Delete Gallery Item?',
            message: `Are you sure you want to remove "${targetPhoto?.title || `Photo ${idx + 1}`}" from the gallery?`,
            confirmText: 'Delete Item',
            onConfirm: () => {
              const nextPhotos = photos.filter((_, i) => i !== idx);
              setLocalData({
                ...localData,
                gallery: {
                  ...(localData.gallery || {}),
                  photos: nextPhotos
                }
              });
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

      <ConfirmModal
        isOpen={Boolean(confirmState)}
        title={confirmState?.title}
        message={confirmState?.message}
        confirmText={confirmState?.confirmText}
        variant={confirmState?.variant}
        onConfirm={() => {
          confirmState?.onConfirm?.();
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />

    </div>
  );
};
