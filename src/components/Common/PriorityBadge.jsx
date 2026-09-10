import React from 'react';

export const PriorityBadge = ({ priority = "HIGH" }) => {
  const normalized = priority ? priority.toUpperCase() : "MEDIUM";
  
  if (normalized === "HOT" || normalized === "VERY HIGH") {
    return (
      <span className="badge badge-hot" style={{
        background: 'rgba(105, 240, 238, 0.12)',
        color: '#69f0ee',
        border: '1px solid rgba(105, 240, 238, 0.4)',
        boxShadow: '0 0 12px rgba(105, 240, 238, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontWeight: '800',
        fontSize: '0.7rem'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#69f0ee', boxShadow: '0 0 6px #69f0ee' }}></span>
        {normalized}
      </span>
    );
  }

  if (normalized === "HIGH") {
    return (
      <span className="badge badge-high" style={{
        background: 'rgba(52, 166, 203, 0.12)',
        color: '#34a6cb',
        border: '1px solid rgba(52, 166, 203, 0.35)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontWeight: '700',
        fontSize: '0.7rem'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34a6cb' }}></span>
        HIGH
      </span>
    );
  }

  if (normalized === "MEDIUM") {
    return (
      <span className="badge badge-medium" style={{
        background: 'rgba(148, 163, 184, 0.10)',
        color: '#94a3b8',
        border: '1px solid rgba(148, 163, 184, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontWeight: '600',
        fontSize: '0.7rem'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }}></span>
        MEDIUM
      </span>
    );
  }

  if (normalized === "QUALIFIED" || normalized === "CONVERTED") {
    return (
      <span className="badge badge-success" style={{
        background: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontWeight: '700',
        fontSize: '0.7rem'
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
        {normalized}
      </span>
    );
  }

  return (
    <span className="badge badge-low" style={{
      background: 'rgba(100, 116, 139, 0.10)',
      color: '#64748b',
      border: '1px solid rgba(100, 116, 139, 0.2)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.2rem 0.65rem',
      borderRadius: '9999px',
      fontWeight: '600',
      fontSize: '0.7rem'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }}></span>
      {normalized}
    </span>
  );
};
