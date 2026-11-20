import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { DEFAULT_INSTRUCTIONS, getInstructionIcon } from '../data/instructionData';
import { 
  CheckCircle2,
  BookOpen,
  Info,
  ArrowRight
} from 'lucide-react';

export const Instructions = ({ setActiveTab }) => {
  const { content } = useContent();
  const instructionsData = content?.instructions || DEFAULT_INSTRUCTIONS;
  const tabs = Array.isArray(instructionsData.tabs) && instructionsData.tabs.length > 0
    ? instructionsData.tabs 
    : DEFAULT_INSTRUCTIONS.tabs;

  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || 'account');

  // Sync active tab if tabs change or get reordered
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeTabId)) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0] || {};
  const TabIcon = getInstructionIcon(currentTab.icon);
  const items = Array.isArray(currentTab.items) ? currentTab.items : [];

  return (
    <div className="container-custom" style={{ paddingTop: '36px', paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge-sky" style={{ marginBottom: '8px' }}>
          <BookOpen className="w-3.5 h-3.5" />
          {instructionsData.badge || 'CLUB GUIDELINES'}
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl" style={{ color: '#F8FAFC', marginBottom: '10px' }}>
          {instructionsData.title || 'Instructions & Rules'}
        </h1>
        <p style={{ color: '#94A3B8', maxWidth: '800px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {instructionsData.subtitle || 'Standard operating rules for verified musicians regarding registration, music room slots, and equipment custody.'}
        </p>
      </div>

      {/* Tab Selectors */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}
      >
        {tabs.map((t) => {
          const Icon = getInstructionIcon(t.icon);
          const isSelected = activeTabId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTabId(t.id)}
              style={{
                background: isSelected ? 'var(--blue-royal)' : 'rgba(15, 23, 42, 0.7)',
                color: isSelected ? '#ffffff' : '#CBD5E1',
                border: isSelected ? '1px solid var(--blue-sky)' : '1px solid var(--blue-border)',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Unified Instruction Content Panel */}
      <div 
        className="glass-panel"
        style={{
          padding: 'clamp(24px, 4vw, 36px)',
          borderRadius: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Tab Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--blue-border)', paddingBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--blue-sky)' }}>
              <TabIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl md:text-2xl" style={{ color: '#F8FAFC', margin: 0 }}>
                {currentTab.title}
              </h3>
              {currentTab.subtitle && (
                <p style={{ color: '#94A3B8', fontSize: '0.86rem', margin: '4px 0 0 0' }}>
                  {currentTab.subtitle}
                </p>
              )}
            </div>
          </div>

          {currentTab.actionTarget && currentTab.actionText && (
            <button
              onClick={() => setActiveTab(currentTab.actionTarget)}
              className="btn-primary"
              style={{ fontSize: '0.84rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {currentTab.actionText} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Unified Cards Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel-hover"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--blue-border)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--blue-sky)',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  RULE #{item.num || (idx + 1 < 10 ? `0${idx + 1}` : idx + 1)}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <h4 style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.98rem', margin: '4px 0 0 0' }}>
                {item.title}
              </h4>

              <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
