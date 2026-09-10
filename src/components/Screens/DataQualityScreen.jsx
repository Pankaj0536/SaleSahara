import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Users, Mail, FileText, Wrench, GitMerge, Eye } from 'lucide-react';
import { DATA_QUALITY_STATS } from '../../data/mockData';

export const DataQualityScreen = ({ onTriggerAction }) => {
  const [issues, setIssues] = useState(DATA_QUALITY_STATS.issues);

  const handleResolveIssue = (id, actionType, leadName) => {
    setIssues(issues.filter(i => i.id !== id));
    onTriggerAction(actionType, `${actionType} completed for ${leadName}`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Data Quality & Governance
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Ensure clean, deduplicated data for optimal machine learning prediction accuracy.
        </p>
      </div>

      {/* Score Hero + Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }} className="grid-responsive-2-1">
        
        {/* Main Score Gauge Card */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-surface) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            border: '10px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(5, 150, 105, 0.15)',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
              87%
            </span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Data Quality Score
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            High reliability • Ready for ML model training
          </p>
        </div>

        {/* 4 Category Cards */}
        <div className="grid-2">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Missing Fields</span>
              <FileText size={18} color="#d97706" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>12%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires enrichment</div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Duplicates</span>
              <GitMerge size={18} color="#dc2626" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>8</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Potential duplicate accounts</div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Invalid Emails</span>
              <Mail size={18} color="#dc2626" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>4</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bounced/syntax errors</div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Incomplete Profiles</span>
              <Users size={18} color="#4f46e5" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>31</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Missing firmographics</div>
          </div>
        </div>

      </div>

      {/* Data Quality Issues Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Actionable Data Quality Issues
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Resolve flags to improve AI prediction fidelity.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
            {issues.length} Issues Remaining
          </span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Lead / Account</th>
                <th>Issue Description</th>
                <th>Severity</th>
                <th>Recommended Action</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#059669', fontWeight: '700' }}>
                    ✓ All data quality issues resolved!
                  </td>
                </tr>
              ) : (
                issues.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                      {item.lead}
                    </td>
                    <td style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      {item.issue}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: '700',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: item.severity === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.15)',
                        color: item.severity === 'High' ? '#dc2626' : '#a16207'
                      }}>
                        {item.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {item.action === 'Fix' ? 'Enrich contact info' : item.action === 'Merge' ? 'Merge duplicate profiles' : 'Manual verification'}
                    </td>
                    <td>
                      <button
                        className={`btn ${item.action === 'Merge' ? 'btn-cyan' : 'btn-primary'} btn-sm`}
                        onClick={() => handleResolveIssue(item.id, item.action, item.lead)}
                      >
                        {item.action === 'Fix' && <Wrench size={14} />}
                        {item.action === 'Merge' && <GitMerge size={14} />}
                        {item.action === 'Review' && <Eye size={14} />}
                        <span>{item.action} Now</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
