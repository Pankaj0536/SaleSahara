import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Settings as SettingsIcon,
  Mail,
  Phone,
  MessageSquare,
  ExternalLink,
  User,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { freeAi } from '../../services/freeAiService';
import { PriorityBadge } from '../Common/PriorityBadge';
import { ScoreRing } from '../Common/ScoreRing';

export const AIAssistantScreen = ({ leads = [], onSelectLead, onTriggerAction, onNavigate }) => {
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || 'lead-101');
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [generatedOutreach, setGeneratedOutreach] = useState('');
  const [outreachChannel, setOutreachChannel] = useState('email');
  const [outreachTone, setOutreachTone] = useState('persuasive');
  const [isGeneratingOutreach, setIsGeneratingOutreach] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [geminiKeyInput, setGeminiKeyInput] = useState(freeAi.geminiKey);
  const [activeProvider, setActiveProvider] = useState(freeAi.activeProvider);

  const messagesEndRef = useRef(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `👋 Welcome to the **SalesSahara AI Intelligence Workspace**!\n\nI am your free, real-time sales copilot powered by our built-in neural reasoning engine and predictive scoring pipeline. I can analyze lead conversion probabilities, uncover hidden deal risks, explain SHAP drivers, or write personalized multi-channel outreach pitches.\n\nSelect any lead or ask me a question below to get started!`,
      leads: leads.slice(0, 3),
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    { label: "Prioritize Today's Leads", prompt: "Which leads have the highest conversion probability and should be called today?" },
    { label: "Analyze Top Prospect", prompt: `Explain the score, drivers, and deal risks for ${selectedLead?.name || 'Rahul Sharma'}.` },
    { label: "Draft Executive Email", prompt: `Draft a high-converting C-level email for ${selectedLead?.name || 'Rahul Sharma'} targeting ${selectedLead?.company || 'their enterprise'}.` },
    { label: "Diagnose Stalled Deals", prompt: "Flag all stalled pipeline leads suffering from engagement time-decay." },
    { label: "Handle Budget Objections", prompt: "How do I overcome pricing and budget constraint objections for enterprise CRM buyers?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGenerating]);

  // Handle Quick Chat Prompt
  const handleSendMessage = async (customPrompt) => {
    const query = customPrompt || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    try {
      const response = await freeAi.chat(query, leads, chatMessages);
      const aiMsg = {
        id: `ai-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text,
        leads: response.leads || [],
        provider: response.provider || 'SalesSahara Free AI Engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Here is the current pipeline intelligence summary:\n\n• Active Pipeline: **${leads.length} leads**\n• Top Opportunity: **${leads[0]?.name || 'Rahul Sharma'}** (${leads[0]?.probability}% conversion probability)\n• Next Best Action: *${leads[0]?.nextAction || 'Call within 2 hours'}*`,
        leads: leads.slice(0, 2),
        provider: 'SalesSahara Neural Engine (Offline Safe)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate 1-Click Outreach
  const handleGenerateOutreach = async () => {
    if (!selectedLead) return;
    setIsGeneratingOutreach(true);
    try {
      const draft = await freeAi.generateOutreach(selectedLead, outreachChannel, outreachTone);
      setGeneratedOutreach(draft);
      onTriggerAction?.('Outreach Generated', `Created ${outreachChannel} pitch for ${selectedLead.name}`);
    } catch (e) {
      setGeneratedOutreach(`Hi ${selectedLead.name},\n\nI noticed your recent engagement with our enterprise demo. Based on your focus at ${selectedLead.company}, I'd love to share how we helped similar organizations accelerate lead conversion by 32%.\n\nDo you have 10 minutes this Thursday?\n\nBest regards,\nHarsh (VP Sales Ops)`);
    } finally {
      setIsGeneratingOutreach(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    freeAi.setGeminiKey(geminiKeyInput.trim());
    freeAi.setProvider(activeProvider);
    setShowSettingsModal(false);
    onTriggerAction?.('AI Engine Configured', `Engine: ${activeProvider === 'gemini' ? 'Google Gemini 1.5 Flash' : 'Built-in Neural Sales Engine'}`);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 80px)' }}>
      
      {/* 1. Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(105, 240, 238, 0.2) 0%, rgba(52, 166, 203, 0.3) 100%)',
              border: '1px solid rgba(105, 240, 238, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#69f0ee',
              boxShadow: '0 0 15px rgba(105, 240, 238, 0.25)'
            }}>
              <Bot size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
                AI Sales Assistant Workspace
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Predictive conversation engine, prospect intelligence, and automated outreach generation
              </p>
            </div>
          </div>
        </div>

        {/* Engine Status & Config Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(105, 240, 238, 0.08)',
            border: '1px solid rgba(105, 240, 238, 0.3)',
            boxShadow: '0 0 15px rgba(105, 240, 238, 0.15)',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#69f0ee'
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#69f0ee', boxShadow: '0 0 8px #69f0ee' }} />
            <span>{activeProvider === 'gemini' && freeAi.geminiKey ? 'Gemini 1.5 Flash Active' : 'Free Neural AI Active'}</span>
            <span style={{ background: '#10b981', color: '#050607', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', marginLeft: '2px' }}>
              FREE
            </span>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <SettingsIcon size={15} />
            <span>AI Config</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Grid: Left Chat Stream | Right Prospect Co-Pilot */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="grid-responsive-2-1">

        {/* LEFT COLUMN: Conversational AI Intelligence Stream */}
        <div className="card" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '740px',
          padding: 0,
          overflow: 'hidden'
        }}>
          {/* Chat Panel Top Sub-header */}
          <div style={{
            padding: '1rem 1.4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#69f0ee" />
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
                Interactive Sales Copilot
              </span>
            </div>
            <button
              onClick={() => setChatMessages([
                {
                  id: `welcome-${Date.now()}`,
                  sender: 'ai',
                  text: "Chat refreshed. How can I assist you with your pipeline today?",
                  leads: null,
                  timestamp: 'Just now'
                }
              ])}
              title="Reset conversation"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
            >
              <RefreshCw size={13} />
              <span>Clear</span>
            </button>
          </div>

          {/* Chat Messages List */}
          <div style={{
            flex: 1,
            padding: '1.25rem 1.4rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem'
          }}>
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    maxWidth: '92%',
                    flexDirection: isAi ? 'row' : 'row-reverse'
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: isAi ? 'linear-gradient(135deg, rgba(105, 240, 238, 0.25) 0%, rgba(52, 166, 203, 0.35) 100%)' : 'rgba(255, 255, 255, 0.1)',
                      border: isAi ? '1px solid rgba(105, 240, 238, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isAi ? '#69f0ee' : '#ffffff',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isAi ? <Bot size={18} /> : <User size={16} />}
                    </div>

                    {/* Message Bubble */}
                    <div style={{
                      padding: '0.9rem 1.15rem',
                      borderRadius: '16px',
                      background: isAi ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, rgba(105, 240, 238, 0.2) 0%, rgba(52, 166, 203, 0.25) 100%)',
                      border: isAi ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(105, 240, 238, 0.35)',
                      boxShadow: isAi ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(105, 240, 238, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      lineHeight: '1.55',
                      whiteSpace: 'pre-wrap',
                      position: 'relative'
                    }}>
                      {msg.text}

                      {/* Matched Lead Chips if available */}
                      {msg.leads && msg.leads.length > 0 && (
                        <div style={{
                          marginTop: '0.85rem',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#69f0ee', letterSpacing: '0.05em' }}>
                            Related Pipeline Opportunities:
                          </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {msg.leads.map(ld => (
                              <button
                                key={ld.id}
                                onClick={() => {
                                  setSelectedLeadId(ld.id);
                                  onSelectLead?.(ld);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '8px',
                                  background: 'rgba(105, 240, 238, 0.08)',
                                  border: '1px solid rgba(105, 240, 238, 0.25)',
                                  color: '#ffffff',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <span style={{ color: '#69f0ee' }}>{ld.name}</span>
                                <span style={{ color: 'var(--text-muted)' }}>({ld.probability}%)</span>
                                <ChevronRight size={13} color="#69f0ee" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Copy Message Action */}
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        title="Copy to clipboard"
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          borderRadius: '4px'
                        }}
                      >
                        {copiedId === msg.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '4px', marginInline: '42px' }}>
                    {msg.timestamp} {isAi && msg.provider ? `• ${msg.provider}` : ''}
                  </span>
                </div>
              );
            })}

            {isGenerating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(105, 240, 238, 0.15)',
                  border: '1px solid rgba(105, 240, 238, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#69f0ee'
                }}>
                  <Sparkles size={16} className="animate-spin" />
                </div>
                <div style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#69f0ee',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>AI reasoning in progress...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div style={{
            padding: '0.65rem 1.4rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(105, 240, 238, 0.06)',
                  border: '1px solid rgba(105, 240, 238, 0.2)',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#69f0ee';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(105, 240, 238, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(105, 240, 238, 0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Zap size={12} color="#69f0ee" />
                <span>{qp.label}</span>
              </button>
            ))}
          </div>

          {/* Chat Input Box */}
          <div style={{
            padding: '0.9rem 1.4rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 16, 26, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <input
              type="text"
              placeholder="Ask about lead probabilities, deal drivers, draft emails, or next best actions..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              style={{
                flex: 1,
                padding: '0.75rem 1.15rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isGenerating || !inputQuery.trim()}
              className="btn btn-cyan"
              style={{
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                opacity: isGenerating || !inputQuery.trim() ? 0.6 : 1
              }}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Lead Intelligence & 1-Click Outreach Co-Pilot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Lead Selector Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="#69f0ee" />
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>
                  Pipeline Co-Pilot
                </h3>
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                Target Lead
              </span>
            </div>

            <select
              value={selectedLeadId}
              onChange={(e) => {
                setSelectedLeadId(e.target.value);
                const match = leads.find(l => l.id === e.target.value);
                if (match) onSelectLead?.(match);
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              {leads.map(ld => (
                <option key={ld.id} value={ld.id} style={{ background: '#0a101a', color: '#ffffff' }}>
                  {ld.name} — {ld.company} ({ld.probability}%, {ld.priority})
                </option>
              ))}
            </select>

            {/* Selected Lead Deep Dossier Preview */}
            {selectedLead && (
              <div style={{
                padding: '1rem',
                borderRadius: '14px',
                background: 'rgba(105, 240, 238, 0.04)',
                border: '1px solid rgba(105, 240, 238, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>
                      {selectedLead.name}
                    </h4>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {selectedLead.role} at <strong style={{ color: '#ffffff' }}>{selectedLead.company}</strong>
                    </p>
                  </div>
                  <PriorityBadge priority={selectedLead.priority} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Probability</span>
                    <strong style={{ color: '#69f0ee', fontSize: '0.95rem' }}>{selectedLead.probability}%</strong>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Deal Value</span>
                    <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{selectedLead.budget}</strong>
                  </div>
                </div>

                {/* Positive Driver signals */}
                {selectedLead.positiveFactors && selectedLead.positiveFactors.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase' }}>
                      Key Conversion Signals:
                    </span>
                    <ul style={{ paddingLeft: '1.1rem', marginTop: '0.3rem', fontSize: '0.775rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {selectedLead.positiveFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Recommended Action */}
                <div style={{
                  marginTop: '0.25rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(105, 240, 238, 0.08)',
                  border: '1px solid rgba(105, 240, 238, 0.25)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Flame size={16} color="#69f0ee" />
                  <span style={{ color: '#69f0ee', fontWeight: '700' }}>
                    Action: {selectedLead.nextAction || 'Call within 2 hours'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 1-Click AI Outreach Generator Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  1-Click Outreach Generator
                </h3>
              </div>
              <span style={{ fontSize: '0.725rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
                Instant Personalization
              </span>
            </div>

            {/* Controls: Channel & Tone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Channel</label>
                <select
                  value={outreachChannel}
                  onChange={(e) => setOutreachChannel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  <option value="email">Executive Email</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="linkedin">LinkedIn InMail</option>
                  <option value="phone">Phone Call Script</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Tone</label>
                <select
                  value={outreachTone}
                  onChange={(e) => setOutreachTone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  <option value="persuasive">Persuasive (ROI Focused)</option>
                  <option value="professional">Formal & Professional</option>
                  <option value="casual">Conversational & Friendly</option>
                  <option value="urgent">Urgent Follow-up</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateOutreach}
              disabled={isGeneratingOutreach}
              className="btn btn-cyan btn-sm"
              style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Sparkles size={15} />
              <span>{isGeneratingOutreach ? 'Generating tailored pitch...' : `Generate ${outreachChannel.toUpperCase()} Pitch`}</span>
            </button>

            {/* Outreach Preview Text Area */}
            {generatedOutreach && (
              <div style={{
                position: 'relative',
                padding: '0.9rem',
                borderRadius: '10px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                {generatedOutreach}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleCopyText('outreach-draft', generatedOutreach)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
                  >
                    {copiedId === 'outreach-draft' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedId === 'outreach-draft' ? 'Copied!' : 'Copy Draft'}</span>
                  </button>

                  <button
                    onClick={() => onTriggerAction?.('Outreach Sent', `Sent ${outreachChannel} to ${selectedLead?.name}`)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
                  >
                    <span>Execute Send</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Settings Modal */}
      {showSettingsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem', position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              AI Engine Configuration
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Choose between the 100% free built-in Neural Sales reasoning engine or connect a free Google Gemini 1.5 Flash API key.
            </p>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', color: '#ffffff' }}>
                  Provider Selection
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveProvider('builtin')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: activeProvider === 'builtin' ? 'rgba(105, 240, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: activeProvider === 'builtin' ? '1px solid #69f0ee' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: activeProvider === 'builtin' ? '#69f0ee' : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Built-in Neural AI (Free)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveProvider('gemini')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: activeProvider === 'gemini' ? 'rgba(105, 240, 238, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: activeProvider === 'gemini' ? '1px solid #69f0ee' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: activeProvider === 'gemini' ? '#69f0ee' : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Google Gemini 1.5 Flash
                  </button>
                </div>
              </div>

              {activeProvider === 'gemini' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', color: '#ffffff' }}>
                    Gemini API Key (Free tier supported)
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Key stored strictly in local browser storage.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-cyan btn-sm"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
