import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast, setToast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borderColors = {
    success: 'rgba(52, 211, 153, 0.4)',
    error: 'rgba(248, 113, 113, 0.4)',
    info: 'rgba(56, 189, 248, 0.4)'
  };

  const glowColors = {
    success: 'rgba(52, 211, 153, 0.25)',
    error: 'rgba(248, 113, 113, 0.25)',
    info: 'rgba(56, 189, 248, 0.25)'
  };

  return (
    <div 
      className="toast-container"
      style={{
        position: 'fixed',
        top: '84px',
        right: '24px',
        zIndex: 100000,
        maxWidth: '420px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          backgroundColor: 'rgba(15, 23, 42, 0.96)',
          border: `1.5px solid ${borderColors[toast.type] || borderColors.info}`,
          boxShadow: `0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColors[toast.type] || glowColors.info}`,
          borderRadius: '14px',
          backdropFilter: 'blur(12px)',
          animation: 'toastSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {icons[toast.type] || icons.success}
        <div style={{ fontSize: '0.9rem', color: '#F8FAFC', fontWeight: 500, flex: 1, lineHeight: '1.4' }}>
          {toast.message}
        </div>
        <button
          onClick={() => setToast && setToast(null)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F8FAFC'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          title="Dismiss notification"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
