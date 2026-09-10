import React, { useState } from 'react';
import { BrainCircuit, ShieldCheck, Zap, RefreshCw, BarChart2, CheckCircle2, Layers } from 'lucide-react';
import { MODEL_INTELLIGENCE_DATA } from '../../data/mockData';
import { Line, Bar } from 'react-chartjs-2';

export const ModelIntelligenceScreen = ({ onTriggerAction }) => {
  const [isRetraining, setIsRetraining] = useState(false);
  const data = MODEL_INTELLIGENCE_DATA;

  const handleRetrainModel = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      onTriggerAction('Model Retrained', 'Random Forest v4.3 successfully retrained on 1,248 leads. Accuracy improved to 85.2%.');
    }, 2500);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  const predictionVsActualData = {
    labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5'],
    datasets: [
      { label: 'Predicted Rate', data: [78, 80, 82, 84, 86], borderColor: '#0284c7', tension: 0.3 },
      { label: 'Actual Converted', data: [76, 79, 81, 84, 85], borderColor: '#059669', tension: 0.3 }
    ]
  };

  const modelPerfData = {
    labels: ['Precision', 'Recall', 'Accuracy', 'F1-Score', 'ROC-AUC'],
    datasets: [
      { label: 'Score %', data: [81, 79, 84, 80, 86], backgroundColor: '#4f46e5', borderRadius: 6 }
    ]
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Model Intelligence & Machine Learning
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Transparent AI performance metrics, confidence algorithms, and hybrid cold-start scoring.
          </p>
        </div>

        <button
          className="btn btn-cyan"
          onClick={handleRetrainModel}
          disabled={isRetraining}
        >
          <RefreshCw size={16} className={isRetraining ? "spinSlow" : ""} />
          <span>{isRetraining ? 'Retraining ML Model...' : 'Retrain Model Now'}</span>
        </button>
      </div>

      {/* MODEL HEALTH CARD */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
              Model Status: Healthy
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              "{data.healthMessage}"
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Last Drift Verification: 10 mins ago
        </div>
      </div>

      {/* MODEL METRICS GRID */}
      <div className="grid-6">
        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Model Algorithm</div>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>{data.modelName.split(' ')[0]} {data.modelName.split(' ')[1]}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)' }}>Supervised Ensemble</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.3rem' }}>{data.accuracy}%</div>
          <div style={{ fontSize: '0.725rem', color: '#059669' }}>High accuracy</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precision</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.3rem' }}>{data.precision}%</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Low false positives</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recall</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.3rem' }}>{data.recall}%</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Lead capture fidelity</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ROC-AUC</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '0.3rem' }}>{data.rocAuc}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)' }}>Excellent curve</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Training Leads</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.3rem' }}>{data.trainingLeads}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>Updated {data.lastTrained}</div>
        </div>
      </div>

      {/* COLD START INTELLIGENCE CARD (Distinct Styling) */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(217, 119, 6, 0.3)'
            }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Cold Start Intelligence
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {data.coldStart.text}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model Confidence:</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#d97706' }}>{data.coldStart.confidence}</span>
          </div>
        </div>

        {/* Cold Start Breakdown Bars */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Hybrid Scoring Weight Distribution
          </div>

          {/* Stacked Progress Bar */}
          <div style={{ height: '14px', borderRadius: '7px', display: 'flex', overflow: 'hidden', background: 'var(--border-medium)', marginBottom: '1.25rem' }}>
            {data.coldStart.weights.map((w, idx) => (
              <div
                key={idx}
                style={{
                  width: `${w.percentage}%`,
                  height: '100%',
                  background: w.color === '#6366f1' ? '#4f46e5' : w.color === '#06b6d4' ? '#0284c7' : '#7c3aed',
                  transition: 'width 0.5s ease'
                }}
                title={`${w.name}: ${w.percentage}%`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {data.coldStart.weights.map((w, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '3px', background: w.color === '#6366f1' ? '#4f46e5' : w.color === '#06b6d4' ? '#0284c7' : '#7c3aed' }}></span>
                <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{w.name}:</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>{w.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Performance Charts */}
      <div className="grid-2">
        <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Prediction vs Actual Convergence</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <Line data={predictionVsActualData} options={{ ...chartOptions, plugins: { legend: { display: true, labels: { color: '#64748b' } } } }} />
          </div>
        </div>

        <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Model Performance Metric Profile</h4>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={modelPerfData} options={chartOptions} />
          </div>
        </div>
      </div>

    </div>
  );
};
