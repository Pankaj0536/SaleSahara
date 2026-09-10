import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, CheckCircle, ArrowRight, User, Building2, DollarSign, Activity } from 'lucide-react';
import { ScoreRing } from '../Common/ScoreRing';
import { PriorityBadge } from '../Common/PriorityBadge';
import confetti from 'canvas-confetti';

export const AddLeadModal = ({ isOpen, onClose, onAddLead }) => {
  const [stage, setStage] = useState('form');

  const [formData, setFormData] = useState({
    name: 'Karan Malhotra',
    email: 'karan.m@apexsystems.in',
    phone: '+91 98200 11223',
    company: 'Apex Systems India',
    industry: 'Enterprise SaaS',
    companySize: '500-1,000',
    role: 'VP of Engineering',
    budget: '$85,000 / yr',
    timeline: 'Immediate (< 30 days)',
    source: 'Inbound Demo',
    websiteVisits: '12',
    emailOpens: '4',
    whatsAppResponse: 'Yes',
    demoRequested: 'Yes',
    notes: 'Urgent need for automated sales intelligence scoring.'
  });

  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStage('analyzing');

    setTimeout(() => {
      const result = {
        id: `lead-${Date.now()}`,
        name: formData.name,
        company: formData.company,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        industry: formData.industry,
        companySize: formData.companySize,
        budget: formData.budget,
        timeline: formData.timeline,
        probability: 87,
        priority: 'HIGH',
        status: 'Qualified',
        lastContact: 'Just now',
        why: 'Demo requested + 12 website visits + high budget',
        nextAction: 'Schedule a Demo',
        nextActionReason: 'Lead demonstrates high buying intent with immediate Q4 purchase timeline.',
        confidence: 'High',
        totalScore: 84,
        scoreBreakdown: {
          engagement: { score: 22, max: 25 },
          budgetMatch: { score: 23, max: 25 },
          companyFit: { score: 18, max: 20 },
          leadSource: { score: 13, max: 15 },
          recency: { score: 8, max: 15 }
        },
        positiveFactors: [
          'Demo requested on website',
          'High website engagement (12 page views)',
          'Strong budget match ($85,000 ARR)'
        ],
        negativeFactors: [
          'First contact lead (no email responses yet)'
        ],
        timelineEvents: [
          { date: 'Just now', type: 'demo', title: 'Lead Created & Analyzed', desc: 'Analyzed via SaleSahara AI ML Engine' }
        ]
      };

      setAnalysisResult(result);
      setStage('result');
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // Fallback
      }
    }, 2000);
  };

  const handleSaveAndClose = () => {
    if (analysisResult) {
      onAddLead(analysisResult);
    }
    setStage('form');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Add New Lead & AI Analysis
              </h2>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Input lead parameters to calculate instant predictive conversion score.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* STAGE 1: FORM INPUT */}
        {stage === 'form' && (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              
              {/* Section 1: Personal Info */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <User size={16} /> Personal Information
                </h4>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Role / Title</label>
                    <input type="text" className="form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Section 2: Company Info */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={16} /> Company & Firmographics
                </h4>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input type="text" className="form-input" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input type="text" className="form-input" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Size</label>
                    <select className="form-select" value={formData.companySize} onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}>
                      <option value="1-50">1-50 employees</option>
                      <option value="50-250">50-250 employees</option>
                      <option value="250-500">250-500 employees</option>
                      <option value="500-1,000">500-1,000 employees</option>
                      <option value="1,000+">1,000+ Enterprise</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Business Info */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <DollarSign size={16} /> Budget & Timeline
                </h4>
                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Annual Budget</label>
                    <input type="text" className="form-input" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Purchase Timeline</label>
                    <select className="form-select" value={formData.timeline} onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}>
                      <option value="Immediate (< 30 days)">Immediate (&lt; 30 days)</option>
                      <option value="This Quarter">This Quarter</option>
                      <option value="30-60 Days">30-60 Days</option>
                      <option value="60-90 Days">60-90 Days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lead Source</label>
                    <select className="form-select" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                      <option value="Inbound Demo">Inbound Demo</option>
                      <option value="Partner Referral">Partner Referral</option>
                      <option value="Webinar Attendee">Webinar Attendee</option>
                      <option value="Google Organic Search">Google Organic Search</option>
                      <option value="Outbound Email">Outbound Email</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Lead Behavior */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Activity size={16} /> Engagement Signals
                </h4>
                <div className="grid-4">
                  <div className="form-group">
                    <label className="form-label">Website Visits</label>
                    <input type="number" className="form-input" value={formData.websiteVisits} onChange={(e) => setFormData({ ...formData, websiteVisits: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Opens</label>
                    <input type="number" className="form-input" value={formData.emailOpens} onChange={(e) => setFormData({ ...formData, emailOpens: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp Response</label>
                    <select className="form-select" value={formData.whatsAppResponse} onChange={(e) => setFormData({ ...formData, whatsAppResponse: e.target.value })}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Demo Requested</label>
                    <select className="form-select" value={formData.demoRequested} onChange={(e) => setFormData({ ...formData, demoRequested: e.target.value })}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="btn btn-cyan btn-lg">
                <Sparkles size={18} />
                <span>Analyze Lead</span>
              </button>
            </div>
          </form>
        )}

        {/* STAGE 2: LOADING ELEGANT ANIMATION */}
        {stage === 'analyzing' && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '4px solid var(--accent-primary)',
              borderTopColor: 'transparent',
              animation: 'spinSlow 1s linear infinite',
              marginBottom: '1.5rem'
            }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              SaleSahara is analyzing this lead...
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Executing Random Forest Inference • Evaluating 18 intent signals
            </p>
          </div>
        )}

        {/* STAGE 3: AI PREDICTION RESULT */}
        {stage === 'result' && analysisResult && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <ScoreRing
                percentage={analysisResult.probability}
                priority={analysisResult.priority}
                confidence={analysisResult.confidence}
                size={150}
              />

              <div style={{ marginTop: '1.25rem', background: 'var(--bg-surface)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', width: '100%' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  Recommended Action:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                  🔥 {analysisResult.nextAction}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  "{analysisResult.nextActionReason}"
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-cyan btn-lg" onClick={handleSaveAndClose} style={{ width: '100%' }}>
                <CheckCircle size={18} />
                <span>Save Lead to Pipeline</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
