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
  TrendingUp
} from 'lucide-react';

export const Sidebar = ({ currentScreen, onNavigate, onLogout, isOpenMobile, onCloseMobile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users, badge: '186' },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'data-quality', label: 'Data Quality', icon: CheckCircle, badge: '87%' },
    { id: 'model-intelligence', label: 'Model Intelligence', icon: BrainCircuit, badge: 'Healthy' },
    { id: 'import', label: 'Import Data', icon: UploadCloud },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, isNew: true },
    { id: 'settings', label: 'Settings', icon: Settings }
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
        background: 'rgba(10, 16, 26, 0.68)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(105, 240, 238, 0.14)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transition: 'transform var(--transition-normal)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.35)'
      }}>
        {/* Header Branding */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(105, 240, 238, 0.2) 0%, rgba(52, 166, 203, 0.3) 100%)',
              border: '1px solid rgba(105, 240, 238, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#69f0ee',
              boxShadow: '0 0 15px rgba(105, 240, 238, 0.25)'
            }}>
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1.1 }}>
                LEADIQ
              </h1>
              <p style={{ fontSize: '0.625rem', color: '#69f0ee', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px', textShadow: '0 0 8px rgba(105, 240, 238, 0.5)' }}>
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

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
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
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive
                    ? 'rgba(105, 240, 238, 0.08)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #69f0ee' : '3px solid transparent',
                  color: isActive ? '#69f0ee' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 0 15px rgba(105, 240, 238, 0.15), inset 0 0 12px rgba(105, 240, 238, 0.04)' : 'none',
                  textShadow: isActive ? '0 0 8px rgba(105, 240, 238, 0.35)' : 'none',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <IconComponent size={18} color={isActive ? '#69f0ee' : item.highlight ? 'var(--accent-cyan)' : 'currentColor'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: item.badge === 'Healthy' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(105, 240, 238, 0.1)',
                    color: item.badge === 'Healthy' ? '#10b981' : '#69f0ee',
                    border: '1px solid rgba(105, 240, 238, 0.2)'
                  }}>
                    {item.badge}
                  </span>
                )}

                {item.isNew && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff'
                  }}>
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
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
