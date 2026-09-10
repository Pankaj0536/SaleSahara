import React, { useState } from 'react';
import { Users, Award, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, BarChart2, ShieldCheck, Zap } from 'lucide-react';
import { SALESPERSON_DATA } from '../../data/mockData';
import { Bar, Line } from 'react-chartjs-2';

export const SalespersonComparisonScreen = ({ onTriggerAction }) => {
  const [selectedReps, setSelectedReps] = useState(['rep-1', 'rep-2', 'rep-3']);

  const toggleRepSelection = (repId) => {
    if (selectedReps.includes(repId)) {
      if (selectedReps.length > 1) {
        setSelectedReps(selectedReps.filter(id => id !== repId));
      }
    } else {
      setSelectedReps([...selectedReps, repId]);
    }
  };

  const activeRepData = SALESPERSON_DATA.filter(r => selectedReps.includes(r.id));

  // Chart 1: Win Rate & Conversion Velocity Comparison
  const winRateChartData = {
    labels: activeRepData.map(r => r.name),
    datasets: [
      {
        label: 'Win Rate (%)',
        data: activeRepData.map(r => r.winRate),
        backgroundColor: '#4f46e5',
        borderRadius: 6
      },
      {
        label: 'AI Compliance (%)',
        data: activeRepData.map(r => r.aiCompliance),
        backgroundColor: '#0284c7',
        borderRadius: 6
      }
    ]
  };

  // Chart 2: Revenue Generated Comparison
  const revenueChartData = {
    labels: activeRepData.map(r => r.name),
    datasets: [
      {
        label: 'Closed Deals Count',
        data: activeRepData.map(r => r.convertedDeals),
        backgroundColor: '#059669',
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
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Salesperson Performance & Comparison
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Compare sales rep conversion efficiency, revenue velocity, deal cycles, and AI action compliance.
        </p>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Top Performing Rep</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.3rem 0' }}>Harsh Vardhan</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={14} /> 79.2% Win Rate ($680k ARR)
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Team Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-primary)', margin: '0.3rem 0' }}>$2,410,000</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>+22% vs last quarter</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Deal Cycle</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '0.3rem 0' }}>15.4 Days</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>3.2 days faster with AI</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Recommendation Compliance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669', margin: '0.3rem 0' }}>89.4%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High team adoption</div>
        </div>
      </div>

      {/* Rep Selection Chips for Side-by-Side Comparison */}
      <div className="card">
        <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Select Reps to Compare Side-by-Side:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {SALESPERSON_DATA.map(rep => {
            const isSelected = selectedReps.includes(rep.id);
            return (
              <button
                key={rep.id}
                onClick={() => toggleRepSelection(rep.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  background: isSelected ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-surface)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)',
                  color: '#ffffff',
                  fontSize: '0.675rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {rep.avatar}
                </span>
                <span>{rep.name}</span>
                {isSelected && <CheckCircle2 size={14} color="var(--accent-primary)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid-2">
        <div className="card" style={{ height: '310px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Win Rate vs AI Compliance Score (%)
          </h3>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={winRateChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card" style={{ height: '310px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Closed Deals Volume Comparison
          </h3>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Salesperson Leaderboard & Comparison Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Sales Team Performance Leaderboard
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Detailed breakdown of conversions, revenue ARR, deal velocity, and AI compliance.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onTriggerAction('Export Leaderboard', 'Exported Sales Team Performance Report to CSV')}
          >
            Export Report
          </button>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sales Rep</th>
                <th>Role</th>
                <th>Assigned Leads</th>
                <th>Converted</th>
                <th>Win Rate</th>
                <th>Revenue Closed</th>
                <th>Avg Deal Cycle</th>
                <th>AI Compliance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SALESPERSON_DATA.map((rep) => (
                <tr key={rep.id} style={{ background: selectedReps.includes(rep.id) ? 'rgba(79, 70, 229, 0.04)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                        color: '#ffffff',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {rep.avatar}
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{rep.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {rep.role}
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                    {rep.assignedLeads}
                  </td>
                  <td style={{ fontWeight: '700', color: '#059669' }}>
                    {rep.convertedDeals}
                  </td>
                  <td>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: rep.winRate >= 70 ? '#059669' : rep.winRate >= 60 ? 'var(--text-main)' : '#dc2626' }}>
                      {rep.winRate}%
                    </div>
                  </td>
                  <td style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>
                    {rep.revenue}
                  </td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {rep.avgDealCycle}
                  </td>
                  <td>
                    <span style={{ fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      {rep.aiCompliance}%
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      background: rep.status === 'Top Performer' ? 'rgba(5, 150, 105, 0.12)' : rep.status === 'On Track' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(239, 68, 68, 0.12)',
                      color: rep.status === 'Top Performer' ? '#059669' : rep.status === 'On Track' ? 'var(--accent-primary)' : '#dc2626'
                    }}>
                      {rep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Coaching & Performance Insights Callouts */}
      <div className="grid-2">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(79, 70, 229, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>AI Coaching • Best Practice Insight</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            "Harsh Vardhan maintains a 79.2% win rate by initiating call follow-up within 1.5 hours of receiving high-priority AI signals."
          </p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(2, 132, 199, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Zap size={20} color="#d97706" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>AI Coaching • Efficiency Uplift</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            "Vikram Malhotra's deal cycle is 21 days due to delayed initial outreach. Adhering to AI recommended action timing could boost conversion rate by +18%."
          </p>
        </div>
      </div>

    </div>
  );
};
