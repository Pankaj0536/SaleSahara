/**
 * SaleSahara / LeadIQ API Client Service
 * Bridges React Frontend to Node.js Express Gateway and FastAPI ML Service
 * Includes automatic response normalization, JWT handling, and fallback resilience.
 */

import { INITIAL_LEADS } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('leadiq_token') || null;
    this.user = JSON.parse(localStorage.getItem('leadiq_user') || 'null');
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('leadiq_token', token);
    localStorage.setItem('leadiq_user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('leadiq_token');
    localStorage.removeItem('leadiq_user');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `API error: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`[ApiService] Request to ${url} failed:`, err.message);
      throw err;
    }
  }

  // --- AUTHENTICATION ---

  async login(email = 'admin@leadiq.ai', password = 'Password@123') {
    try {
      const res = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.data?.tokens?.accessToken) {
        this.setAuth(res.data.tokens.accessToken, res.data.user);
        return { success: true, user: res.data.user, token: res.data.tokens.accessToken };
      }
      return { success: false, message: 'Invalid response format' };
    } catch (err) {
      // Return demo mode fallback
      return {
        success: true,
        demoMode: true,
        user: { name: 'Demo Admin', email, role: 'ADMIN' },
        message: 'Running in resilient offline demo mode'
      };
    }
  }

  async getMe() {
    try {
      const res = await this.request('/auth/me');
      return res.data?.user || this.user;
    } catch {
      return this.user;
    }
  }

  // --- LEADS ---

  async getLeads(params = {}) {
    try {
      const query = new URLSearchParams({ limit: '100', ...params }).toString();
      const res = await this.request(`/leads?${query}`);
      const rawLeads = res.data?.leads || [];
      if (rawLeads.length === 0) return INITIAL_LEADS;
      return rawLeads.map(this.normalizeLead);
    } catch (err) {
      return INITIAL_LEADS;
    }
  }

  async getLeadById(id) {
    try {
      const res = await this.request(`/leads/${id}`);
      return this.normalizeLead(res.data?.lead);
    } catch {
      return INITIAL_LEADS.find(l => l.id === id) || INITIAL_LEADS[0];
    }
  }

  async createLead(leadData) {
    try {
      const payload = {
        firstName: leadData.name?.split(' ')[0] || 'Lead',
        lastName: leadData.name?.split(' ').slice(1).join(' ') || 'Contact',
        companyName: leadData.company || 'Enterprise Corp',
        email: leadData.email,
        phone: leadData.phone || '+1 555-0199',
        jobTitle: leadData.role || 'Executive',
        industry: leadData.industry || 'SaaS',
        companySize: leadData.companySize || '51-200',
        budget: typeof leadData.budget === 'number' ? leadData.budget : parseInt(String(leadData.budget || '50000').replace(/\D/g, '')),
        source: leadData.source || 'website'
      };

      const res = await this.request('/leads', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return this.normalizeLead(res.data?.lead);
    } catch (err) {
      // Mock creation fallback
      const mockLead = {
        id: `lead-${Date.now()}`,
        name: leadData.name || 'New Lead',
        company: leadData.company || 'Enterprise Inc',
        role: leadData.role || 'VP Operations',
        email: leadData.email,
        phone: leadData.phone || '+91 99999 11111',
        budget: leadData.budget || '$50,000 / yr',
        industry: leadData.industry || 'Technology',
        companySize: leadData.companySize || '50-250',
        probability: 78,
        priority: 'HIGH',
        status: 'New',
        lastContact: 'Just now',
        why: 'Inbound submission + budget alignment',
        nextAction: 'Schedule introductory discovery call',
        confidence: 'High',
        totalScore: 78,
        timelineEvents: [{ date: 'Just now', type: 'web', title: 'Lead Created', desc: 'Manual form submission' }]
      };
      return mockLead;
    }
  }

  // --- AI PREDICTIONS & NBA ---

  async predictLead(id) {
    try {
      const res = await this.request(`/predictions/lead/${id}`, { method: 'POST' });
      return res.data;
    } catch (err) {
      return null;
    }
  }

  async getNextBestAction(id) {
    try {
      const res = await this.request(`/ai/next-action/${id}`);
      return res.data?.action;
    } catch {
      return null;
    }
  }

  async generateSalesMessage(leadId, channel = 'email', tone = 'professional') {
    try {
      const res = await this.request('/ai/generate-message', {
        method: 'POST',
        body: JSON.stringify({ leadId, channel, tone })
      });
      return res.data?.message?.content || null;
    } catch {
      return null;
    }
  }

  // --- ANALYTICS & METRICS ---

  async getAnalyticsOverview() {
    try {
      const res = await this.request('/analytics/overview');
      return res.data?.overview || null;
    } catch {
      return null;
    }
  }

  async getModelMetrics() {
    try {
      const res = await this.request('/models/metrics');
      return res.data?.metrics || null;
    } catch {
      return null;
    }
  }

  // --- NORMALIZER ---

  normalizeLead(bLead) {
    if (!bLead) return null;
    const name = `${bLead.firstName || ''} ${bLead.lastName || ''}`.trim() || bLead.companyName || 'Enterprise Lead';
    const score = bLead.aiScore || (bLead.conversionProbability ? Math.round(bLead.conversionProbability * 100) : 75);
    
    return {
      id: bLead._id || bLead.id,
      name,
      company: bLead.companyName || 'Corporate',
      role: bLead.jobTitle || 'Executive Contact',
      email: bLead.email || 'lead@domain.com',
      phone: bLead.phone || '+1 555-0100',
      source: bLead.source || 'website',
      industry: bLead.industry || 'Technology',
      companySize: bLead.companySize || '51-200',
      budget: bLead.budget ? `$${bLead.budget.toLocaleString()} / yr` : '$45,000 / yr',
      timeline: bLead.timeframe || 'Immediate (< 30 days)',
      probability: score,
      priority: bLead.priority === 'HOT' ? 'VERY HIGH' : bLead.priority || 'HIGH',
      status: bLead.status || 'Qualified',
      lastContact: bLead.lastActivityAt ? new Date(bLead.lastActivityAt).toLocaleDateString() : '2 hours ago',
      why: bLead.notes || 'High behavioral engagement & pricing evaluation',
      nextAction: bLead.nextAction || 'Contact within 2 hours to confirm schedule',
      nextActionReason: 'Strong buying signals observed across pricing exploration and demo requests.',
      confidence: bLead.confidenceLevel || 'High',
      totalScore: score,
      scoreBreakdown: {
        engagement: { score: 24, max: 25 },
        budgetMatch: { score: 22, max: 25 },
        companyFit: { score: 19, max: 20 },
        leadSource: { score: 14, max: 15 },
        recency: { score: 12, max: 15 }
      },
      positiveFactors: [
        'Enterprise pricing page visits',
        'Demo requested with technical discovery',
        'Engagement velocity increasing week-over-week'
      ],
      negativeFactors: [],
      timelineEvents: [
        { date: 'Recent', type: 'demo', title: 'Demo Evaluation', desc: 'Active sales qualification lifecycle' }
      ]
    };
  }
}

export const api = new ApiService();
export default api;
