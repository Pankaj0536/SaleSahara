import React, { useState } from 'react';
import { TrendingUp, Sparkles, Shield, ArrowRight, Lock, Mail, Building2, Copy } from 'lucide-react';

export const LoginScreen = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('admin@technova.io');
  const [password, setPassword] = useState('salesahara2026');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleDemoLogin = () => {
    setEmail('admin@technova.io');
    setPassword('salesahara2026');
    onLoginSuccess();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: admin@technova.io\nPassword: salesahara2026`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '1050px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        zIndex: 10
      }} className="login-card-container">
        
        {/* Left Form Column */}
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: 'var(--shadow-glow)'
              }}>
                <TrendingUp size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                  SaleSahara
                </h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                  AI Lead Conversion Intelligence
                </p>
              </div>
            </div>

            {onBackToLanding && (
              <button className="btn btn-secondary btn-sm" onClick={onBackToLanding}>
                Landing Page
              </button>
            )}
          </div>

          {/* Company Login Credential Highlight Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%)',
            border: '1px dashed var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} /> Company Demo Credentials
              </div>
              <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Copy size={12} /> {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '700' }}>
              TechNova Technologies (VP Sales Ops)
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              Email: <strong>admin@technova.io</strong> | Password: <strong>salesahara2026</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn btn-cyan btn-lg"
                style={{ width: '100%' }}
              >
                <Sparkles size={18} />
                <span>1-Click Demo Login as TechNova</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Abstract Visual */}
        <div style={{
          background: 'var(--bg-surface-hover)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }} className="login-visual-panel">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={16} />
            <span>Prediction • Explanation • Action</span>
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <div style={{
              background: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Rahul Sharma (TechNova)</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#dc2626', background: 'rgba(239, 68, 68, 0.1)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>91% PROBABILITY</span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                ✓ Demo requested + High engagement Intent
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                🔥 Recommended Action: Call within 2 hours
              </div>
            </div>

            <div style={{
              background: 'rgba(2, 132, 199, 0.06)',
              border: '1px solid rgba(2, 132, 199, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Random Forest Model</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>84% Accuracy Score</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={14} /> Healthy
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            "SaleSahara increased our sales team conversion rate by 3.4x by prioritizing high-intent leads with explainable AI."
          </div>
        </div>

      </div>
    </div>
  );
};
