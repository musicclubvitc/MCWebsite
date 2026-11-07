import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 shadow-emerald-950/50',
    error: 'border-rose-500/40 shadow-rose-950/50',
    info: 'border-cyan-500/40 shadow-cyan-950/50'
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 99999,
        maxWidth: '380px'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 20px',
          backgroundColor: 'rgba(17, 26, 44, 0.95)',
          border: '1.5px solid rgba(102, 217, 251, 0.4)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(102, 217, 251, 0.25)',
          borderRadius: '14px',
          animation: 'fadeInUp 0.3s ease-out'
        }}
      >
        {icons[toast.type] || icons.success}
        <div style={{ fontSize: '0.92rem', color: '#F8FAFC', fontWeight: 500, flex: 1 }}>
          {toast.message}
        </div>
      </div>
    </div>
  );
};
