import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const getIcon = () => {
    if (toast.type === 'error') return <AlertCircle color="#ef4444" size={18} />;
    if (toast.type === 'info') return <Info color="#06b6d4" size={18} />;
    return <CheckCircle2 color="#10b981" size={18} />;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: 'var(--bg-surface-elevated)',
      border: '1px solid var(--border-medium)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#ffffff',
      fontSize: '0.875rem',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {getIcon()}
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
