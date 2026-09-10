import React from 'react';

export const PriorityBadge = ({ priority = "HIGH" }) => {
  const normalized = priority ? priority.toUpperCase() : "MEDIUM";
  
  if (normalized === "VERY HIGH") {
    return (
      <span className="badge badge-veryhigh">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}></span>
        VERY HIGH
      </span>
    );
  }
  if (normalized === "HIGH") {
    return (
      <span className="badge badge-high">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }}></span>
        HIGH
      </span>
    );
  }
  if (normalized === "MEDIUM") {
    return (
      <span className="badge badge-medium">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }}></span>
        MEDIUM
      </span>
    );
  }
  if (normalized === "QUALIFIED" || normalized === "CONVERTED") {
    return (
      <span className="badge badge-success">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
        {normalized}
      </span>
    );
  }
  return (
    <span className="badge badge-low">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }}></span>
      {normalized}
    </span>
  );
};
