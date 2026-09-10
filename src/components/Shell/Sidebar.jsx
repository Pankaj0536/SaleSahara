import React from 'react';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  BarChart3,
  CheckCircle,
  BrainCircuit,
  UploadCloud,
  Bot,
  Settings,
  LogOut,
  X,
  TrendingUp,
  Search
} from 'lucide-react';

export const Sidebar = ({ currentScreen, onNavigate, onLogout, isOpenMobile, onCloseMobile, onOpenCommandPalette }) => {
  const navSections = [
    {
      title: 'Core Pipeline',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'leads', label: 'Leads', icon: Users, badge: '186' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'AI Intelligence',
      items: [
        { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, isNew: true },
        { id: 'recommendations', label: 'Recommendations', icon: Sparkles, highlight: true }
      ]
    },
    {
      title: 'System & Ops',
      items: [
        { id: 'data-quality', label: 'Data Quality', icon: CheckCircle, badge: '87%' },
        { id: 'model-intelligence', label: 'Model Intelligence', icon: BrainCircuit, badge: 'Healthy' },
        { id: 'import', label: 'Import Data', icon: UploadCloud },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
        />
      )}

      <aside className={`sidebar ${isOpenMobile ? 'open' : ''}`} style={{
        width: '260px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transition: 'transform var(--transition-normal)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Header Branding */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(52, 166, 203, 0.25) 100%)',
              border: '1px solid rgba(2, 132, 199, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              boxShadow: 'var(--shadow-glow-cyan)'
            }}>
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1 }}>
                SalesSahara
              </h1>
              <p style={{ fontSize: '0.625rem', color: 'var(--accent-cyan)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>
                AI Sales Intelligence
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="mobile-only-btn"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List by Workspaces */}
        <nav style={{ flex: 1, padding: '0.75rem 0.65rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {navSections.map((section, idx) => (
            <div key={section.title} style={{ marginBottom: idx < navSections.length - 1 ? '0.5rem' : '0' }}>
              <div className="nav-section-title">
                {section.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive
                          ? 'var(--bg-surface-hover)'
                          : 'transparent',
                        borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        boxShadow: isActive ? 'var(--shadow-glow-cyan)' : 'none',
                        fontWeight: isActive ? '700' : '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <IconComponent size={17} color={isActive ? 'var(--accent-primary)' : item.highlight ? 'var(--accent-cyan)' : 'currentColor'} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '0.12rem 0.45rem',
                          borderRadius: 'var(--radius-full)',
                          background: item.badge === 'Healthy' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface-hover)',
                          color: item.badge === 'Healthy' ? '#10b981' : 'var(--accent-primary)',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          {item.badge}
                        </span>
                      )}

                      {item.isNew && (
                        <span style={{
                          fontSize: '0.62rem',
                          fontWeight: '800',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                          color: '#ffffff',
                          letterSpacing: '0.04em'
                        }}>
                          AI
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
          {/* Quick Command Launcher */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.45rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-hover)',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '0.75rem',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Search size={13} color="var(--accent-primary)" />
                <span>Quick Actions</span>
              </span>
              <kbd style={{
                fontSize: '0.65rem',
                padding: '0.1rem 0.35rem',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                color: 'var(--text-main)',
                fontFamily: 'monospace'
              }}>⌘K</kbd>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #69f0ee 0%, #34a6cb 100%)',
                color: '#050607',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                boxShadow: '0 0 12px rgba(105, 240, 238, 0.3)'
              }}>
                H
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Harsh
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  VP Sales Ops
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: 'var(--radius-sm)',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
