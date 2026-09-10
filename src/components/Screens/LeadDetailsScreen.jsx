import React from 'react';
import { ArrowLeft, Building2, Mail, Phone, Calendar, Sparkles, Check, AlertCircle, Clock, ShieldCheck, Download, Share2 } from 'lucide-react';
import { ScoreRing } from '../Common/ScoreRing';
import { PriorityBadge } from '../Common/PriorityBadge';
import { NextActionCard } from '../Common/NextActionCard';

export const LeadDetailsScreen = ({ lead, onBack, onTriggerAction }) => {
  if (!lead) return null;

  const breakdown = lead.scoreBreakdown || {
    engagement: { score: 23, max: 25 },
    budgetMatch: { score: 22, max: 25 },
    companyFit: { score: 18, max: 20 },
    leadSource: { score: 14, max: 15 },
    recency: { score: 9, max: 15 }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Navigation & Actions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Back to Directory</span>
        </button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onTriggerAction('Export Profile', `Exported AI dossier for ${lead.name}`)}>
            <Download size={14} />
            <span>Export Dossier</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onTriggerAction('Share Lead', `Shared ${lead.name} profile with sales team`)}>
            <Share2 size={14} />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      {/* Header AI Profile Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-hover) 100%)',
        border: '1px solid var(--border-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#ffffff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {lead.name.charAt(0)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {lead.name}
              </h1>
              <span style={{
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: '600'
              }}>
                {lead.status}
              </span>
              <PriorityBadge priority={lead.priority} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', fontWeight: '600' }}>
                <Building2 size={16} color="var(--accent-cyan)" />
                {lead.company}
              </span>
              <span>•</span>
              <span>{lead.role}</span>
              <span>•</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>Budget: {lead.budget}</span>
            </div>
          </div>
        </div>

        {/* Hero Score Badge Spotlight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <ScoreRing
            percentage={lead.probability}
            priority={lead.priority}
            confidence={lead.confidence}
            size={130}
          />
        </div>
      </div>

      {/* Grid Layout: Left Details + Right Action & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }} className="grid-responsive-2-1">
        
        {/* Left Column: SCORE BREAKDOWN & EXPLAINABLE AI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* SCORE BREAKDOWN Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--accent-primary)" />
                Score Breakdown
              </h3>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>{lead.totalScore}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / 100 Total</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Engagement Score</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{breakdown.engagement.score} / {breakdown.engagement.max}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(breakdown.engagement.score / breakdown.engagement.max) * 100}%`, height: '100%', background: '#4f46e5' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Budget Match</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{breakdown.budgetMatch.score} / {breakdown.budgetMatch.max}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(breakdown.budgetMatch.score / breakdown.budgetMatch.max) * 100}%`, height: '100%', background: '#0284c7' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Company & ICP Fit</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{breakdown.companyFit.score} / {breakdown.companyFit.max}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(breakdown.companyFit.score / breakdown.companyFit.max) * 100}%`, height: '100%', background: '#059669' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Lead Source Value</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{breakdown.leadSource.score} / {breakdown.leadSource.max}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(breakdown.leadSource.score / breakdown.leadSource.max) * 100}%`, height: '100%', background: '#7c3aed' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>Recency & Velocity</span>
                  <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{breakdown.recency.score} / {breakdown.recency.max}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-medium)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(breakdown.recency.score / breakdown.recency.max) * 100}%`, height: '100%', background: '#d97706' }} />
                </div>
              </div>
            </div>
          </div>

          {/* EXPLAINABLE AI CARD */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              Why did SaleSahara give this score?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Positive Drivers (High Impact)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {lead.positiveFactors.map((factor, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-main)'
                    }}>
                      <Check size={16} color="#059669" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {lead.negativeFactors.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Negative Risk Factors
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {lead.negativeFactors.map((factor, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)'
                      }}>
                        <AlertCircle size={16} color="#dc2626" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: NEXT BEST ACTION & ACTIVITY TIMELINE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* NEXT BEST ACTION CARD */}
          <NextActionCard
            action={lead.nextAction}
            reason={lead.nextActionReason}
            leadName={lead.name}
            onTriggerAction={onTriggerAction}
          />

          {/* ACTIVITY TIMELINE Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--accent-primary)" />
              Activity Timeline
            </h3>

            <div style={{ position: 'relative', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Vertical Connecting Line */}
              <div style={{
                position: 'absolute',
                top: '6px',
                bottom: '6px',
                left: '7px',
                width: '2px',
                background: 'var(--border-medium)'
              }} />

              {lead.timelineEvents.map((evt, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  {/* Circle Node */}
                  <div style={{
                    position: 'absolute',
                    left: '-1.5rem',
                    top: '2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: idx === 0 ? 'var(--accent-cyan)' : 'var(--accent-primary)',
                    boxShadow: idx === 0 ? '0 0 8px rgba(2, 132, 199, 0.4)' : 'none'
                  }} />

                  <div style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    {evt.date}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                    {evt.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {evt.desc}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
