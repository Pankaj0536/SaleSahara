import React, { useState } from 'react';
import { Settings, Sliders, Shield, Key, Bell, Save } from 'lucide-react';

export const SettingsScreen = ({ onTriggerAction }) => {
  const [apiKey, setApiKey] = useState('ssh_live_99a8b7c6d5e4f3a210');
  const [threshold, setThreshold] = useState(85);

  const handleSave = () => {
    onTriggerAction('Settings Saved', 'SaleSahara configuration settings updated successfully.');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>
            Settings & Configurations
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage AI scoring thresholds, CRM integrations, and enterprise security keys.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid-2">
        
        {/* Scoring Thresholds */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="var(--accent-cyan)" />
            AI Scoring Thresholds
          </h3>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label">VERY HIGH Priority Threshold (%)</label>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>{threshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cold Start Strategy</label>
            <select className="form-select" defaultValue="Hybrid ML + Rules">
              <option value="Hybrid ML + Rules">Hybrid (50% Rules, 30% Intent, 20% ML)</option>
              <option value="Pure Machine Learning">Pure Machine Learning (Random Forest)</option>
              <option value="Rule-Based Standard">Rule-Based Standard</option>
            </select>
          </div>
        </div>

        {/* API & Integrations */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="var(--accent-primary)" />
            Enterprise API & CRM Keys
          </h3>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">SaleSahara Live Secret API Key</label>
            <input type="password" className="form-input" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>Salesforce Sync Engine</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669' }}>● Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>HubSpot CRM Webhook</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669' }}>● Connected</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
