import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  Lock,
  Building2,
  Users,
  ChevronRight,
  BrainCircuit,
  Flame,
  Check,
  Star,
  Layers,
  Copy,
  ExternalLink
} from 'lucide-react';
import { ScoreRing } from '../Common/ScoreRing';

export const LandingPage = ({ onLoginSuccess, onOpenLoginScreen }) => {
  const [copied, setCopied] = useState(false);

  const companyCredentials = {
    company: "TechNova Technologies",
    role: "VP of Sales Operations",
    email: "admin@technova.io",
    password: "salesahara2026"
  };

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Email: ${companyCredentials.email}\nPassword: ${companyCredentials.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'transparent', color: 'var(--text-main)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* 1. TOP MARKETING NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '0.9rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              SalesSahara
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: '800', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-only">
          <a href="#features" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>Features</a>
          <a href="#credentials" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '800' }}>Company Login</a>
          <a href="#model" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>Model Intelligence</a>
          <a href="#pricing" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>Pricing</a>
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenLoginScreen}
          >
            Sign In
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={onLoginSuccess}
          >
            <Sparkles size={16} />
            <span>Launch App Demo</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section style={{
        padding: '5rem 2rem 4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Subtle Glow Backdrop */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />


        {/* Main Headline */}
        <h1 style={{
          fontSize: '3.25rem',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          lineHeight: '1.15',
          maxWidth: '900px',
          marginBottom: '1.25rem',
          color: 'var(--text-main)'
        }}>
          Know your best leads. Know why. <br />
          <span className="gradient-text">Know what to do next.</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          lineHeight: '1.6',
          marginBottom: '2.5rem'
        }}>
          SaleSahara is the AI-powered sales decision-support platform that transforms lead pipelines with real-time conversion probability, explainable AI scoring drivers, and automated next best actions.
        </p>

        {/* 3. PROMINENT COMPANY LOGIN CREDENTIALS CALLOUT BOX */}
        <div id="credentials" style={{
          width: '100%',
          maxWidth: '750px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(2, 132, 199, 0.04) 100%)',
          border: '2px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '3rem',
          textAlign: 'left',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Enterprise Demo Credential
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {companyCredentials.company}
                </h3>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCopyCredentials}
            >
              <Copy size={14} />
              <span>{copied ? 'Copied!' : 'Copy Credentials'}</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem'
          }} className="grid-responsive-2-1">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Role / Organization</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>{companyCredentials.role}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Work Email</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '2px' }}>{companyCredentials.email}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Password</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{companyCredentials.password}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Access Level</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#059669', marginTop: '4px' }}>● Enterprise Admin (Full Rights)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#059669" />
              <span>Clicking below pre-fills credentials & opens live pipeline</span>
            </div>

            <button
              className="btn btn-cyan btn-lg"
              onClick={onLoginSuccess}
              style={{ flex: 1, minWidth: '240px', justifyContent: 'center' }}
            >
              <Sparkles size={20} />
              <span>1-Click Instant Login as TechNova</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Interactive Dashboard Showcase Mock */}
        <div style={{
          width: '100%',
          maxWidth: '1050px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          padding: '1.5rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }}></span>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>app.salesahara.ai / dashboard</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>● ML Inference Active (Random Forest v4.2)</span>
          </div>

          {/* Quick Showcase Grid */}
          <div className="grid-3" style={{ gap: '1rem' }}>
            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Priority Lead</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>Rahul Sharma</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>TechNova Technologies</div>
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#dc2626' }}>91% PROBABILITY</span>
                <span className="badge badge-veryhigh">VERY HIGH</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explainable AI Drivers</div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700', marginTop: '6px' }}>✓ Demo requested on pricing page</div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700', marginTop: '4px' }}>✓ High website engagement (14 views)</div>
              <div style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: '700', marginTop: '4px' }}>! Unopened follow-up email</div>
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Recommended Action</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>🔥 Call within 2 hours</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>"Lead demonstrated high buying intent during webinar."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUE PILLARS / FEATURES SECTION */}
      <section id="features" style={{ padding: '4rem 2rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why SaleSahara
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>
              Built for Modern Enterprise Revenue Teams
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Transform generic CRM contacts into actionable revenue opportunities with 4 core pillars.
            </p>
          </div>

          <div className="grid-4">
            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Target size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Predictive Lead Scoring
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Supervised Random Forest ML engine trained on actual historical sales conversions with 84%+ accuracy.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Explainable AI (XAI)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Never guess why a score was assigned. Inspect positive intent signals and negative risk factors for every lead.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Flame size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Next Best Action
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Automated prescriptive recommendations directing reps whether to call, email, WhatsApp, or schedule a demo.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Cold Start Intelligence
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Hybrid scoring algorithm balancing rules (50%), behavioral intent (30%), and ML (20%) when data is limited.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING TIERS SECTION */}
      <section id="pricing" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Transparent Enterprise Pricing
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.4rem' }}>
            Scale Your Revenue Intelligence
          </h2>
        </div>

        <div className="grid-3">
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Growth Tier</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.5rem 0' }}>$49 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ user / mo</span></div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Ideal for growing mid-market sales teams.</p>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onLoginSuccess}>Start 14-Day Free Trial</button>
          </div>

          <div className="card" style={{ border: '2px solid var(--accent-primary)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--accent-primary)', color: '#ffffff', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>MOST POPULAR</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Enterprise Tier</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>$129 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ user / mo</span></div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Includes Random Forest ML customization & SOC2 SSO.</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onLoginSuccess}>Launch Enterprise Demo</button>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Custom Model</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: '0.5rem 0' }}>Custom</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Dedicated ML engineering & custom API webhooks.</p>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onLoginSuccess}>Contact Enterprise Sales</button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <TrendingUp size={18} color="var(--accent-primary)" />
          <strong style={{ color: 'var(--text-main)' }}>SaleSahara</strong>
          <span>— AI-Powered Lead Conversion Intelligence</span>
        </div>
        <div>© 2026 SaleSahara Inc. All rights reserved. SOC2 Type II Certified.</div>
      </footer>

    </div>
  );
};
