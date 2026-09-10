import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, User, ChevronRight, Phone, ArrowUpRight } from 'lucide-react';
import { PriorityBadge } from '../Common/PriorityBadge';

export const AIAssistantDrawer = ({ leads, onSelectLead, onTriggerAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello Harsh! I'm SaleSahara AI, your predictive sales intelligence assistant. Ask me anything about lead scores, priority calls, or pipeline anomalies.",
      leads: null
    }
  ]);

  const quickPrompts = [
    "Which leads should I call today?",
    "Why is Rahul's score low?",
    "Which source generates the best leads?",
    "Show me leads above 70% probability."
  ];

  const handleSendPrompt = (promptText) => {
    const query = promptText || inputQuery;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { id: `msg-${Date.now()}`, sender: 'user', text: query };
    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent AI response card based on query
    setTimeout(() => {
      let aiResponse = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: '',
        leads: []
      };

      if (query.toLowerCase().includes('call today') || query.toLowerCase().includes('priority')) {
        const topLeads = leads.filter(l => l.probability >= 85);
        aiResponse.text = `Here are the top ${topLeads.length} highest-value leads you should call today based on >85% conversion probability and recent demo engagement:`;
        aiResponse.leads = topLeads;
      } else if (query.toLowerCase().includes('rahul')) {
        const rahul = leads.find(l => l.name.includes('Rahul')) || leads[0];
        aiResponse.text = `Rahul Sharma actually has a VERY HIGH conversion score of 91%. The main negative driver is that he hasn't responded to yesterday's follow-up email, but his demo request & 14 website visits give him an 86/100 total score. Recommended Action: Call within 2 hours.`;
        aiResponse.leads = [rahul];
      } else if (query.toLowerCase().includes('source') || query.toLowerCase().includes('best leads')) {
        aiResponse.text = `Partner Referrals generate the best leads with a 78% win rate and $120,000 average deal size, followed closely by Inbound Demo requests (74% win rate).`;
      } else {
        const highProb = leads.filter(l => l.probability >= 70);
        aiResponse.text = `Found ${highProb.length} qualified leads with over 70% conversion probability in your current pipeline:`;
        aiResponse.leads = highProb.slice(0, 3);
      }

      setChatMessages(prev => [...prev, aiResponse]);
    }, 600);
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
          <span>Ask SaleSahara AI</span>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '0.15rem 0.4rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.65rem',
            fontWeight: '800'
          }}>
            PRO
          </span>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '420px',
          height: '620px',
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
            padding: '1rem 1.25rem',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  SaleSahara AI
                </h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                  Sales Intelligence Assistant
                </p>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '88%',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' : 'var(--bg-dark)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-medium)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4'
                }}>
                  {msg.text}

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
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.825rem' }}>{l.name}</span>
                            <span style={{ fontWeight: '800', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>{l.probability}%</span>
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{l.company} • {l.nextAction}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Preset Quick Prompt Chips */}
          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-dark)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(prompt)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.7rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(inputQuery); }} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Ask SaleSahara AI..."
                className="form-input"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1rem' }}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}>
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
