import React from 'react';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  AlertCircle,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { KPI_DATA } from '../../data/mockData';
import { ScoreRing } from '../Common/ScoreRing';
import { PriorityBadge } from '../Common/PriorityBadge';
import { NextActionCard } from '../Common/NextActionCard';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardScreen = ({ leads, onSelectLead, onTriggerAction, onNavigate }) => {
  // Filter top priority queue leads
  const priorityQueue = leads.filter(l => l.priority === "VERY HIGH" || l.priority === "HIGH").slice(0, 5);

  // Top lead for Hero card (Rahul Sharma)
  const heroLead = leads.find(l => l.id === "lead-101") || leads[0];

  // Chart 1: Conversion Trend
  const trendChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep (YTD)'],
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: [18, 21, 24, 28, 32],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart 2: Conversion by Lead Source
  const sourceChartData = {
    labels: ['Inbound Demo', 'Partner Ref.', 'Organic', 'Webinar', 'Outbound'],
    datasets: [
      {
        label: 'Conv %',
        data: [78, 72, 64, 58, 38],
        backgroundColor: ['#4f46e5', '#0284c7', '#059669', '#d97706', '#64748b'],
        borderRadius: 6
      }
    ]
  };

  // Chart 3: Lead Priority Distribution
  const priorityDoughnutData = {
    labels: ['Very High', 'High', 'Medium', 'Low'],
    datasets: [
      {
        data: [186, 420, 390, 252],
        backgroundColor: ['#dc2626', '#ea580c', '#d97706', '#64748b'],
        borderWidth: 0
      }
    ]
  };

  // Chart 4: Conversion Probability Distribution
  const probabilityDistributionData = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [
      {
        label: 'Number of Leads',
        data: [95, 140, 310, 480, 223],
        backgroundColor: '#0284c7',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1'
      }
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#64748b', boxWidth: 12, font: { size: 11 } } }
    }
  };

  const getKpiIcon = (id) => {
    switch (id) {
      case 'total-leads': return <Users size={20} color="#4f46e5" />;
      case 'high-priority': return <AlertTriangle size={20} color="#dc2626" />;
      case 'avg-probability': return <TrendingUp size={20} color="#0284c7" />;
      case 'converted': return <CheckCircle2 size={20} color="#059669" />;
      case 'followups-due': return <Clock size={20} color="#d97706" />;
      case 'at-risk': return <ShieldAlert size={20} color="#e11d48" />;
      default: return <Users size={20} color="#4f46e5" />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Good morning, Harsh
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Here's what your sales pipeline looks like today.
        </p>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid-6">
        {KPI_DATA.map((kpi) => (
          <div key={kpi.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                {kpi.title}
              </span>
              <div style={{
                padding: '0.4rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)'
              }}>
                {getKpiIcon(kpi.id)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1, marginBottom: '0.4rem' }}>
                {kpi.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                <span style={{
                  fontWeight: '700',
                  color: kpi.trendType === 'up' ? '#059669' : kpi.trendType === 'warning' ? '#d97706' : 'var(--text-muted)'
                }}>
                  {kpi.trend}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>{kpi.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Priority Queue & Hero Score Spotlight */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }} className="grid-responsive-2-1">
        
        {/* Left: AI PRIORITY QUEUE Table */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  AI Recommended Follow-ups
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Focus your team's time on leads most likely to convert.
              </p>
            </div>
            
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('leads')}
            >
              <span>View All Leads</span>
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Premium Lead Table */}
          <div className="table-container" style={{ flex: 1 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Company</th>
                  <th>Probability</th>
                  <th>Priority</th>
                  <th>Why?</th>
                  <th>Next Action</th>
                </tr>
              </thead>
              <tbody>
                {priorityQueue.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectLead(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.role}</div>
                    </td>
                    <td style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                      {item.company}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: '800', fontSize: '0.9rem', color: item.probability >= 85 ? '#dc2626' : 'var(--accent-cyan)' }}>
                          {item.probability}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '180px' }}>
                      "{item.why}"
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerAction(item.nextAction, `Action initiated for ${item.name}`);
                        }}
                        style={{ fontSize: '0.725rem', padding: '0.25rem 0.65rem' }}
                      >
                        {item.nextAction}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: CONVERSION SCORE & EXPLANATION SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* CONVERSION SCORE CARD */}
          <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Spotlight Score • {heroLead.name}
            </div>

            <ScoreRing
              percentage={heroLead.probability}
              priority={heroLead.priority}
              confidence={heroLead.confidence}
              size={160}
            />
          </div>

          {/* AI EXPLANATION CARD */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              Why this lead?
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {heroLead.positiveFactors.map((factor, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  <Check size={14} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{factor}</span>
                </div>
              ))}
            </div>

            {heroLead.negativeFactors.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {heroLead.negativeFactors.map((factor, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#dc2626' }}>
                    <AlertCircle size={14} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NEXT BEST ACTION CARD */}
          <NextActionCard
            action={heroLead.nextAction}
            reason={heroLead.nextActionReason}
            leadName={heroLead.name}
            onTriggerAction={onTriggerAction}
          />

        </div>

      </div>

      {/* DASHBOARD ANALYTICS CHARTS */}
      <div>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>
          Sales Intelligence Analytics
        </h2>

        <div className="grid-4">
          <div className="card" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>1. Conversion Trend</h4>
            <div style={{ flex: 1, position: 'relative' }}>
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>

          <div className="card" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>2. Conversion by Lead Source</h4>
            <div style={{ flex: 1, position: 'relative' }}>
              <Bar data={sourceChartData} options={chartOptions} />
            </div>
          </div>

          <div className="card" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>3. Lead Priority Distribution</h4>
            <div style={{ flex: 1, position: 'relative' }}>
              <Doughnut data={priorityDoughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="card" style={{ height: '260px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>4. Probability Distribution</h4>
            <div style={{ flex: 1, position: 'relative' }}>
              <Bar data={probabilityDistributionData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
