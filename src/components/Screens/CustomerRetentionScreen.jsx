import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  ArrowUpRight, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Zap, 
  Building2, 
  Users, 
  DollarSign 
} from 'lucide-react';
import { RETENTION_DATA } from '../../data/mockData';
import { Bar, Doughnut } from 'react-chartjs-2';

export const CustomerRetentionScreen = ({ onTriggerAction }) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAccountId, setExpandedAccountId] = useState('acc-5'); // Expand Apex Logistics by default

  const accounts = RETENTION_DATA.accounts;

  // Filter accounts
  const filteredAccounts = accounts.filter(acc => {
    const matchesStatus = selectedStatus === 'All' || acc.status === selectedStatus;
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          acc.industry.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Chart: Health Score vs Churn Risk
  const healthVsChurnChart = {
    labels: accounts.map(a => a.name.split(' ')[0]),
    datasets: [
      {
        label: 'Health Score (0-100)',
        data: accounts.map(a => a.healthScore),
        backgroundColor: accounts.map(a => a.healthScore > 80 ? '#059669' : a.healthScore > 60 ? '#0284c7' : '#dc2626'),
        borderRadius: 6
      },
      {
        label: 'Churn Risk (%)',
        data: accounts.map(a => a.churnRisk),
        backgroundColor: accounts.map(a => a.churnRisk > 40 ? '#ef4444' : a.churnRisk > 20 ? '#f59e0b' : '#10b981'),
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#64748b', font: { size: 11 } } }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' }, min: 0, max: 100 }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Healthy': return 'badge-success';
      case 'At Risk': return 'badge-danger';
      case 'Renewal Pending': return 'badge-warning';
      case 'Expansion Opportunity': return 'badge-purple';
      default: return 'badge-info';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#0284c7';
    if (score >= 45) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={24} style={{ color: 'var(--accent-primary)' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Old Customer Retention & Churn Intelligence
          </h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Monitor existing account health, predict churn signals, track Net Retention Rate (NRR), and automate retention & expansion workflows.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gross Retention Rate</span>
            <ShieldCheck size={18} style={{ color: '#059669' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.3rem 0' }}>
            {RETENTION_DATA.overallRetentionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> +3.1% YoY (Top Decile SaaS)
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Net Retention Rate (NRR)</span>
            <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-primary)', margin: '0.3rem 0' }}>
            {RETENTION_DATA.nrr}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Expansion Revenue offsetting churn
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>At-Risk Accounts</span>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ef4444', margin: '0.3rem 0' }}>
            {RETENTION_DATA.atRiskAccountsCount} Accounts
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '700' }}>
            {RETENTION_DATA.atRiskArrValue} ARR at risk of churn
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>90-Day Renewals Pipeline</span>
            <RefreshCw size={18} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.3rem 0' }}>
            {RETENTION_DATA.renewalsDueArrValue}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
            86% Predicted renewal probability
          </div>
        </div>
      </div>

      {/* AI Retention Strategy Alert Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <div style={{ 
          background: 'var(--accent-primary)', 
          color: '#ffffff', 
          borderRadius: '50%', 
          width: '36px', 
          height: '36px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            AI Churn Prevention Signal: Apex Logistics requires immediate Customer Success intervention
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            AI detected a <strong>45% drop in weekly active user logins</strong> alongside 1 unresolved P1 ticket. Executive check-in response rate has dropped to 0%. Recommended action: Deploy CS Task Force & offer technical onboarding refresh.
          </p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => onTriggerAction && onTriggerAction('Deploy CS Task Force to Apex Logistics')}
            >
              <Zap size={14} /> Execute CS Task Force Workflow
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setExpandedAccountId('acc-5')}
            >
              View Risk Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Account Health vs Churn Risk Chart */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>Account Health Score vs Churn Risk Index</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time telemetry measuring product usage, support tickets, and renewal timelines</p>
          </div>
        </div>
        <div style={{ height: '260px' }}>
          <Bar data={healthVsChurnChart} options={chartOptions} />
        </div>
      </div>

      {/* Accounts List Section */}
      <div className="card" style={{ padding: '1.25rem' }}>
        
        {/* Controls: Search & Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['All', 'Healthy', 'Renewal Pending', 'At Risk', 'Expansion Opportunity'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: '1px solid var(--border-color)',
                  background: selectedStatus === status ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: selectedStatus === status ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Search accounts or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        {/* Accounts Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Account & Industry</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Health Score</th>
                <th style={{ padding: '0.75rem' }}>Churn Risk</th>
                <th style={{ padding: '0.75rem' }}>ARR / Seats</th>
                <th style={{ padding: '0.75rem' }}>Renewal Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => {
                const isExpanded = expandedAccountId === acc.id;
                return (
                  <React.Fragment key={acc.id}>
                    <tr 
                      style={{ 
                        borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)',
                        background: isExpanded ? 'rgba(79, 70, 229, 0.03)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onClick={() => setExpandedAccountId(isExpanded ? null : acc.id)}
                    >
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Building2 size={16} style={{ color: 'var(--accent-primary)' }} />
                          <div>
                            <div>{acc.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>{acc.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span className={`badge ${getStatusBadgeClass(acc.status)}`}>
                          {acc.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '50px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${acc.healthScore}%`, height: '100%', background: getHealthColor(acc.healthScore) }} />
                          </div>
                          <span style={{ fontWeight: '700', color: getHealthColor(acc.healthScore) }}>{acc.healthScore}/100</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        <span style={{ 
                          fontWeight: '700', 
                          color: acc.churnRisk > 40 ? '#ef4444' : acc.churnRisk > 20 ? '#d97706' : '#059669',
                          background: acc.churnRisk > 40 ? 'rgba(239, 68, 68, 0.1)' : acc.churnRisk > 20 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px'
                        }}>
                          {acc.churnRisk}%
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: '600' }}>
                        <div>{acc.arr}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>{acc.seats} Seats</div>
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-muted)' }}>
                        {acc.renewalDate}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedAccountId(isExpanded ? null : acc.id);
                          }}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} AI Analysis
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <tr style={{ background: 'rgba(79, 70, 229, 0.03)', borderBottom: '1px solid var(--border-color)' }}>
                        <td colSpan="7" style={{ padding: '0 1rem 1.25rem 1rem' }}>
                          <div style={{ 
                            background: 'var(--bg-card)', 
                            borderRadius: '10px', 
                            border: '1px solid var(--border-color)', 
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                          }}>
                            {/* AI Recommendation Box */}
                            <div style={{ 
                              background: 'rgba(79, 70, 229, 0.06)', 
                              borderLeft: '4px solid var(--accent-primary)',
                              borderRadius: '6px', 
                              padding: '0.85rem 1rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '0.75rem'
                            }}>
                              <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '0.5px' }}>
                                  AI Recommended Retention Strategy
                                </div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                                  {acc.aiRecommendedAction}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                  <strong>Why:</strong> {acc.aiReason}
                                </div>
                              </div>
                              <button 
                                className="btn btn-primary"
                                style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                                onClick={() => onTriggerAction && onTriggerAction(`${acc.aiRecommendedAction} for ${acc.name}`)}
                              >
                                <Zap size={14} /> Trigger AI Action
                              </button>
                            </div>

                            {/* Positive Drivers & Risk Factors */}
                            <div className="grid-2" style={{ gap: '1rem' }}>
                              <div style={{ background: 'rgba(5, 150, 105, 0.05)', borderRadius: '8px', padding: '0.85rem', border: '1px solid rgba(5, 150, 105, 0.15)' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                                  <CheckCircle2 size={16} /> Positive Retention Signals ({acc.positiveDrivers.length})
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                                  {acc.positiveDrivers.map((driver, idx) => (
                                    <li key={idx} style={{ marginBottom: '4px' }}>{driver}</li>
                                  ))}
                                </ul>
                              </div>

                              <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', padding: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                                  <AlertTriangle size={16} /> Churn Risk Drivers ({acc.riskFactors.length})
                                </h4>
                                {acc.riskFactors.length === 0 ? (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', italic: 'true' }}>No critical risk factors detected.</div>
                                ) : (
                                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                                    {acc.riskFactors.map((risk, idx) => (
                                      <li key={idx} style={{ marginBottom: '4px' }}>{risk}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
