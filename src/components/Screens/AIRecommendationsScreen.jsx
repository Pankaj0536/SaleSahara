import React from 'react';
import { Flame, CheckCircle, Clock, AlertTriangle, Sparkles, Phone, Mail, MessageSquare, Calendar, ChevronRight } from 'lucide-react';
import { PriorityBadge } from '../Common/PriorityBadge';

export const AIRecommendationsScreen = ({ leads, onSelectLead, onTriggerAction }) => {
  const callNow = leads.filter(l => l.probability >= 85);
  const followUpToday = leads.filter(l => l.probability >= 70 && l.probability < 85);
  const nurture = leads.filter(l => l.probability >= 50 && l.probability < 70);
  const lowPriority = leads.filter(l => l.probability < 50);

  const renderSection = (title, subtitle, icon, badgeColor, items) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {icon}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {title}
            </h2>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          </div>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '0.2rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          background: badgeColor,
          color: '#ffffff'
        }}>
          {items.length} Leads
        </span>
      </div>

      <div className="grid-2">
        {items.map((lead) => (
          <div
            key={lead.id}
            className="card card-interactive"
            onClick={() => onSelectLead(lead)}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `4px solid ${lead.probability >= 85 ? '#dc2626' : lead.probability >= 70 ? '#ea580c' : '#d97706'}` }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {lead.company} • {lead.role}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: lead.probability >= 85 ? '#dc2626' : 'var(--accent-cyan)' }}>
                    {lead.probability}%
                  </div>
                  <PriorityBadge priority={lead.priority} />
                </div>
              </div>

              <div style={{
                background: 'var(--bg-dark)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.825rem'
              }}>
                <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> Reason:
                </div>
                <div style={{ color: 'var(--text-main)' }}>"{lead.why}"</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--text-main)' }}>
                🔥 {lead.nextAction}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerAction(lead.nextAction, `Calling ${lead.name}...`);
                  }}
                >
                  <Phone size={14} />
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerAction('Email', `Emailing ${lead.name}...`);
                  }}
                >
                  <Mail size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          AI Recommendations
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Your highest-value sales actions for today prioritized by AI conversion score.
        </p>
      </div>

      {/* Sections */}
      {renderSection("🔥 Call Now", "High urgency, demo requested & high buying intent (>85% probability)", <Flame size={24} color="#dc2626" />, "rgba(220, 38, 38, 0.9)", callNow)}
      {renderSection("🟢 Follow Up Today", "Solid engagement & budget match (70% - 84% probability)", <CheckCircle size={24} color="#059669" />, "rgba(5, 150, 105, 0.9)", followUpToday)}
      {renderSection("🟡 Nurture", "Warm leads requiring strategic ROI content (50% - 69% probability)", <Clock size={24} color="#d97706" />, "rgba(217, 119, 6, 0.9)", nurture)}
      {renderSection("🔴 Low Priority", "Cold prospects or high risk accounts (<50% probability)", <AlertTriangle size={24} color="#64748b" />, "rgba(100, 116, 139, 0.9)", lowPriority)}

    </div>
  );
};
