import React from 'react';
import { Phone, MessageSquare, Mail, Calendar, Sparkles } from 'lucide-react';

export const NextActionCard = ({
  action = "Call within 2 hours",
  reason = "This lead recently requested a demo and shows strong buying intent.",
  leadName = "Rahul Sharma",
  onTriggerAction
}) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%)',
      border: '1px solid rgba(79, 70, 229, 0.25)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <Sparkles size={18} color="var(--accent-cyan)" />
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)', fontWeight: '700' }}>
          AI Recommended Action
        </h4>
      </div>

      <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🔥</span>
        <span>{action}</span>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        <strong>Reason:</strong> "{reason}"
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onTriggerAction && onTriggerAction('Call', `Initiating call to ${leadName}...`)}
        >
          <Phone size={14} />
          Call
        </button>
        <button
          className="btn btn-cyan btn-sm"
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
