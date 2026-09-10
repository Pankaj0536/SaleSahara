import React from 'react';
import { Phone, MessageSquare, Mail, Calendar, Sparkles } from 'lucide-react';

export const NextActionCard = ({
  action = "Contact this lead within 2 hours",
  reason = "Lead requested enterprise demo and showed high pricing page activity.",
  channel = "Email & Phone",
  recommendedAction = "Schedule product demo",
  confidence = "91.4%",
  leadName = "Rahul Sharma",
  onTriggerAction
}) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(105, 240, 238, 0.25)',
      borderRadius: '20px',
      padding: '1.4rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 25px rgba(105, 240, 238, 0.12)'
    }}>
      <div style={{
        position: 'absolute',
        top: '-30px',
        right: '-30px',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(105, 240, 238, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sparkles size={18} color="#69f0ee" />
        <h4 style={{
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--accent-primary)',
          fontWeight: '800'
        }}>
          AI Recommendation
        </h4>
      </div>

      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>⚡</span>
        <span>{action}</span>
      </div>

      {/* Structured AI Recommendation signals */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        marginBottom: '1.25rem',
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        background: 'var(--bg-surface-hover)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.825rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Recommended channel</span>
          <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>→ {channel}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Recommended action</span>
          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>→ {recommendedAction}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
          <span className="tabular-nums" style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>
            → {confidence}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        <button
          className="btn btn-cyan btn-sm"
          onClick={() => onTriggerAction && onTriggerAction('Call', `Initiating call to ${leadName}...`)}
        >
          <Phone size={14} />
          Call
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onTriggerAction && onTriggerAction('WhatsApp', `Opening WhatsApp chat with ${leadName}...`)}
        >
          <MessageSquare size={14} />
          WhatsApp
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onTriggerAction && onTriggerAction('Email', `Opening email composer for ${leadName}...`)}
        >
          <Mail size={14} />
          Email
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onTriggerAction && onTriggerAction('Schedule Demo', `Scheduling calendar demo with ${leadName}...`)}
        >
          <Calendar size={14} />
          Schedule Demo
        </button>
      </div>
    </div>
  );
};
