import React from 'react';

export const ScoreRing = ({ percentage = 91, priority = "VERY HIGH", confidence = "High", size = 160 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine ring color gradient based on percentage
  const getGradientId = () => {
    if (percentage >= 85) return "score-gradient-veryhigh";
    if (percentage >= 70) return "score-gradient-high";
    if (percentage >= 50) return "score-gradient-medium";
    return "score-gradient-low";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id="score-gradient-veryhigh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#69f0ee" />
              <stop offset="100%" stopColor="#34a6cb" />
            </linearGradient>
            <linearGradient id="score-gradient-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34a6cb" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="score-gradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" border="0" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="score-gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border-medium)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Animated Progress Ring with Cyan Illumination */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              filter: percentage >= 70 ? 'drop-shadow(0 0 8px rgba(2, 132, 199, 0.4))' : 'none'
            }}
          />
        </svg>

        {/* Center Dominant Percentage Text */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <span className="tabular-nums" style={{
            fontSize: size > 140 ? '2.5rem' : '1.75rem',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            lineHeight: 1
          }}>
            {percentage}%
          </span>
          <span style={{
            fontSize: '0.675rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginTop: '4px',
            letterSpacing: '0.05em'
          }}>
            Probability
          </span>
        </div>
      </div>

      <div style={{
        marginTop: '0.75rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem'
      }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: percentage >= 85 ? '#dc2626' : percentage >= 70 ? '#ea580c' : 'var(--text-muted)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>
          {priority} PRIORITY
        </div>
        <div style={{
          fontSize: '0.725rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <span>AI Confidence:</span>
          <span style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{confidence}</span>
        </div>
      </div>
    </div>
  );
};
