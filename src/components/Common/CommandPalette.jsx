import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  BarChart3,
  Bot,
  Sparkles,
  CheckCircle,
  BrainCircuit,
  UploadCloud,
  Settings,
  Mail,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';

export const CommandPalette = ({
  isOpen,
  onClose,
  onNavigate,
  leads = [],
  onSelectLead,
  onTriggerAction
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build searchable items list
  const navItems = [
    { type: 'nav', id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { type: 'nav', id: 'leads', label: 'Go to Leads & Pipeline', icon: Users, category: 'Navigation' },
    { type: 'nav', id: 'ai-assistant', label: 'Go to AI Copilot Workspace', icon: Bot, category: 'Navigation' },
    { type: 'nav', id: 'recommendations', label: 'Go to AI Recommendations', icon: Sparkles, category: 'Navigation' },
    { type: 'nav', id: 'analytics', label: 'Go to Analytics & Attribution', icon: BarChart3, category: 'Navigation' },
    { type: 'nav', id: 'data-quality', label: 'Go to Data Quality Hygiene', icon: CheckCircle, category: 'Navigation' },
    { type: 'nav', id: 'model-intelligence', label: 'Go to Model Intelligence', icon: BrainCircuit, category: 'Navigation' },
    { type: 'nav', id: 'import', label: 'Import Leads & CSV', icon: UploadCloud, category: 'Navigation' },
    { type: 'nav', id: 'settings', label: 'Settings & Integrations', icon: Settings, category: 'Navigation' }
  ];

  const actionItems = [
    {
      type: 'action',
      id: 'action-bulk-ai',
      label: '⚡ Generate AI Outreach for Top 5 Hot Leads',
      icon: Zap,
      category: 'AI Actions',
      handler: () => {
        onTriggerAction('Bulk AI Outreach', 'Generated personalized pitch drafts for top 5 high-propensity leads.');
        onNavigate('ai-assistant');
      }
    },
    {
      type: 'action',
      id: 'action-health-check',
      label: '🛡️ Run Pipeline Data Hygiene Diagnostic',
      icon: CheckCircle,
      category: 'AI Actions',
      handler: () => {
        onTriggerAction('Hygiene Check', 'Pipeline scan complete: 186 verified records, 0 critical anomalies.');
        onNavigate('data-quality');
      }
    },
    {
      type: 'action',
      id: 'action-forecast',
      label: '📈 Generate Conversion Propensity Forecast',
      icon: BarChart3,
      category: 'AI Actions',
      handler: () => {
        onTriggerAction('Forecast Generated', 'Forecast compiled: Estimated +$420,000 in closed-won ARR.');
        onNavigate('analytics');
      }
    }
  ];

  const leadItems = leads.slice(0, 8).map(lead => ({
    type: 'lead',
    id: `lead-${lead.id}`,
    label: `${lead.name} — ${lead.company} (${lead.probability}%)`,
    subLabel: `${lead.role} • ${lead.priority} Priority • ${lead.budget}`,
    icon: Users,
    category: 'Leads & Prospects',
    leadData: lead
  }));

  const allItems = [...navItems, ...actionItems, ...leadItems];

  const filteredItems = allItems.filter(item => {
    const q = query.toLowerCase();
    const labelMatch = item.label.toLowerCase().includes(q);
    const subMatch = item.subLabel ? item.subLabel.toLowerCase().includes(q) : false;
    const catMatch = item.category.toLowerCase().includes(q);
    return labelMatch || subMatch || catMatch;
  });

  const handleSelect = (item) => {
    if (!item) return;
    onClose();
    if (item.type === 'nav') {
      onNavigate(item.id);
    } else if (item.type === 'action') {
      item.handler?.();
    } else if (item.type === 'lead') {
      onSelectLead?.(item.leadData);
      onNavigate('leads');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        zIndex: 9999
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '65vh',
          animation: 'slideUpFloating 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '0.75rem'
        }}>
          <Search size={18} color="var(--accent-primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search leads, or jump to screens..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-main)',
              fontWeight: '500'
            }}
          />
          <kbd style={{
            fontSize: '0.65rem',
            padding: '0.15rem 0.4rem',
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            color: 'var(--text-dim)',
            fontFamily: 'monospace'
          }}>
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
              No commands or leads matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const IconComponent = item.icon;
              return (
                <div
                  key={`${item.category}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-surface-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-dim)'
                    }}>
                      <IconComponent size={15} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: isSelected ? '700' : '600', color: 'var(--text-main)' }}>
                        {item.label}
                      </div>
                      {item.subLabel && (
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {item.subLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: 'var(--text-dim)'
                    }}>
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={14} color="var(--accent-primary)" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div style={{
          padding: '0.65rem 1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.725rem',
          color: 'var(--text-dim)'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><strong style={{ color: 'var(--text-main)' }}>↑↓</strong> to navigate</span>
            <span><strong style={{ color: 'var(--text-main)' }}>↵</strong> to select</span>
          </div>
          <span>SalesSahara Spotlight</span>
        </div>
      </div>
    </div>
  );
};
