import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Settings, Check, Copy, ExternalLink, RefreshCw, Zap } from 'lucide-react';
import { freeAi } from '../../services/freeAiService';

export const AIAssistantDrawer = ({ leads = [], onSelectLead, onTriggerAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [geminiInputKey, setGeminiInputKey] = useState(freeAi.geminiKey);
  const [aiProvider, setAiProvider] = useState(freeAi.activeProvider);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "👋 Hello! I'm **SaleSahara AI**, your free predictive sales intelligence assistant.\n\nAsk me anything about your current pipeline, lead scores, deal risks, or ask me to draft personalized outreach emails for any prospect!",
      provider: 'SaleSahara Free Sales AI',
      leads: null
    }
  ]);

  const quickPrompts = [
    "Which leads should I call today?",
    "Analyze Rahul Sharma's score",
    "Draft an outreach email for Elena",
    "Show stalled leads with inactivity decay",
    "How do I handle budget objections?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen, isGenerating]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    freeAi.setGeminiKey(geminiInputKey.trim());
    freeAi.setProvider(aiProvider);
    setShowSettings(false);
    onTriggerAction?.('AI Settings', `Active Engine: ${aiProvider === 'gemini' ? 'Google Gemini 1.5 Flash (Free Tier)' : 'Free Built-in Neural Sales Agent'}`);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendPrompt = async (promptText) => {
    const query = promptText || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text: query };
    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    try {
      const response = await freeAi.chat(query, leads, chatMessages);
      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text,
        leads: response.leads || [],
        provider: response.provider || 'Free Sales AI'
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      const fallbackResponse = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `I ran into an issue connecting to the cloud engine, but here is what I found in your live pipeline:\n\n• You have **${leads.length} active leads**.\n• Top opportunity: **${leads[0]?.name || 'Rahul Sharma'}** (${leads[0]?.probability || 94}% conversion probability).\n• Action required: *${leads[0]?.nextAction || 'Call within 2 hours'}*.`,
        leads: leads.slice(0, 2),
        provider: 'SaleSahara Free Sales AI (Offline Safe)'
      };
      setChatMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Floating Assistant Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 900,
            background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '0.75rem 1.25rem',
            fontWeight: '700',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: 'var(--shadow-glow-cyan)',
            transition: 'transform var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Bot size={20} />
          <span>Ask Free AI</span>
          <span style={{
            background: '#10b981',
            color: '#ffffff',
            padding: '0.15rem 0.45rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.65rem',
            fontWeight: '800'
          }}>
            FREE
          </span>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '440px',
          maxWidth: 'calc(100vw - 32px)',
          height: '640px',
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 950,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          
          {/* Header */}
          <div style={{
            padding: '0.9rem 1.25rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    SaleSahara AI
                  </h3>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px'
                  }}>
                    100% FREE
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                  {freeAi.activeProvider === 'gemini' && freeAi.geminiKey ? 'Google Gemini 1.5 Flash Active' : 'Built-in Neural Sales Engine Active'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="AI Engine Settings"
                style={{
                  background: showSettings ? 'var(--border-medium)' : 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* AI Settings Overlay */}
          {showSettings && (
            <div style={{
              background: 'var(--bg-dark)',
              borderBottom: '1px solid var(--border-medium)',
              padding: '1rem',
              fontSize: '0.8rem'
            }}>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={14} color="#f59e0b" /> AI Engine Configuration
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                SaleSahara provides a <strong>100% Free Built-in Sales AI</strong> that runs everywhere with zero configuration. You can also optionally connect your free Google Gemini API key.
              </p>

              <form onSubmit={handleSaveSettings}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    Active AI Model:
                  </label>
                  <select
                    className="form-input"
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                  >
                    <option value="builtin">Free Built-in Neural Sales Engine (No Key Needed)</option>
                    <option value="gemini">Google Gemini 1.5 Flash (Free Tier API Key)</option>
                  </select>
                </div>

                {aiProvider === 'gemini' && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Gemini API Key (Free):
                    </label>
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      className="form-input"
                      value={geminiInputKey}
                      onChange={(e) => setGeminiInputKey(e.target.value)}
                      style={{ width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Get a free key from Google AI Studio (no credit card needed).
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Container */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '92%',
                  padding: '0.85rem 1rem',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' : 'var(--bg-dark)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-medium)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.84rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  position: 'relative'
                }}>
                  {msg.text}

                  {/* Copy Button for AI Messages */}
                  {msg.sender === 'ai' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {msg.provider}
                      </span>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        title="Copy text"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedId === msg.id ? '#10b981' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.7rem'
                        }}
                      >
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {/* Render Lead Cards if included in AI response */}
                  {msg.leads && msg.leads.length > 0 && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {msg.leads.map((l) => (
                        <div
                          key={l.id}
                          onClick={() => {
                            onSelectLead(l);
                            setIsOpen(false);
                          }}
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.65rem 0.75rem',
                            cursor: 'pointer',
                            transition: 'border-color var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.825rem' }}>{l.name}</span>
                            <span style={{
                              fontWeight: '800',
                              color: l.probability >= 80 ? '#10b981' : l.probability >= 60 ? '#38bdf8' : '#f59e0b',
                              fontSize: '0.85rem'
                            }}>
                              {l.probability}%
                            </span>
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {l.company} • {l.nextAction}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Generating State */}
            {isGenerating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem' }}>
                <Sparkles size={16} className="animate-pulse" color="#06b6d4" />
                <span>SaleSahara AI is analyzing your pipeline...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Quick Prompt Chips */}
          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-dark)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(prompt)}
                disabled={isGenerating}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.7rem',
                  color: 'var(--text-main)',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  opacity: isGenerating ? 0.6 : 1,
                  transition: 'background var(--transition-fast)'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Ask SaleSahara AI anything..."
                className="form-input"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem', fontSize: '0.825rem' }}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isGenerating}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isGenerating || !inputQuery.trim()}
                style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0, opacity: isGenerating || !inputQuery.trim() ? 0.5 : 1 }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
