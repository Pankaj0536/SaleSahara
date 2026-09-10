import React from 'react';
import { BarChart3, TrendingUp, Zap, Sparkles, Award, ArrowUpRight } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

export const AnalyticsScreen = () => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  const bySourceData = {
    labels: ['Partner Referral', 'Inbound Demo', 'Organic Google', 'Webinar', 'Outbound Cold'],
    datasets: [{ label: 'Conv Rate %', data: [78, 74, 62, 54, 32], backgroundColor: '#4f46e5', borderRadius: 6 }]
  };

  const byIndustryData = {
    labels: ['Enterprise SaaS', 'Fintech', 'Cybersecurity', 'Cloud Infra', 'Healthcare'],
    datasets: [{ label: 'Conv Rate %', data: [82, 76, 71, 68, 48], backgroundColor: '#0284c7', borderRadius: 6 }]
  };

  const byBudgetData = {
    labels: ['<$25k', '$25k-$50k', '$50k-$100k', '>$100k'],
    datasets: [{ label: 'Closed Leads', data: [42, 110, 128, 32], backgroundColor: '#059669', borderRadius: 6 }]
  };

  const weeklyTrendData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    datasets: [
      { label: 'AI Predicted Conversions', data: [45, 52, 60, 68, 75, 84], borderColor: '#0284c7', tension: 0.4 },
      { label: 'Actual Conversions', data: [42, 50, 58, 65, 74, 82], borderColor: '#4f46e5', tension: 0.4 }
    ]
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
          Sales Intelligence
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Deep-dive predictive analytics and empirical conversion trends.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid-4">
        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Conversion Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.3rem 0' }}>25.0%</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> +4.2% vs industry avg
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lead Velocity Index</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '0.3rem 0' }}>+18.4%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Acceleration score</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Lead Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-primary)', margin: '0.3rem 0' }}>72 / 100</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>High quality pipeline</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Best Lead Source</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.3rem 0' }}>Partner Referral</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>78% Win Rate</div>
        </div>
      </div>

      {/* AI Insight Cards */}
      <div className="grid-2">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(79, 70, 229, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>AI Insight • Channel Velocity</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            "Referral leads currently show the highest conversion rate (78%), closing 2.3x faster than outbound sequences."
          </p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(2, 132, 199, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Zap size={20} color="#d97706" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>AI Insight • Speed to Lead</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            "Leads contacted within 24 hours show 3.4x stronger conversion performance compared to leads contacted after 48 hours."
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2">
        <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Conversion by Lead Source</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={bySourceData} options={chartOptions} />
          </div>
        </div>

        <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Conversion by Industry</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={byIndustryData} options={chartOptions} />
          </div>
        </div>

        <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Conversion by Budget Tier</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={byBudgetData} options={chartOptions} />
          </div>
        </div>

        <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Weekly Predictive vs Actual Conversion</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <Line data={weeklyTrendData} options={{ ...chartOptions, plugins: { legend: { display: true, labels: { color: '#64748b' } } } }} />
          </div>
        </div>
      </div>

    </div>
  );
};
