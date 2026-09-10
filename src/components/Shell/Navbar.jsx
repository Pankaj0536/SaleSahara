import React, { useState } from 'react';
import { Search, Bell, Plus, Menu, HelpCircle, Sparkles, AlertTriangle, Info, Sun, Moon } from 'lucide-react';
import { NOTIFICATIONS_LIST } from '../../data/mockData';

export const Navbar = ({ currentScreen = 'dashboard', onOpenMobileSidebar, onOpenAddLeadModal, onNavigate, theme, onToggleTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_LIST);
  const [searchQuery, setSearchQuery] = useState('');

  const screenTitles = {
    'dashboard': 'Dashboard Overview',
    'leads': 'Leads Pipeline',
    'lead-details': 'Lead Dossier & Insights',
    'recommendations': 'AI Next Best Actions',
    'analytics': 'Conversion Analytics',
    'data-quality': 'Data Quality Health',
    'model-intelligence': 'ML Model Intelligence',
    'import': 'Data Ingestion',
    'ai-assistant': 'AI Sales Assistant',
    'settings': 'Platform Settings'
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header style={{
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 80,
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      marginLeft: '260px'
    }} className="main-navbar">
      {/* Left: Mobile Toggle, Screen Title & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, maxWidth: '640px' }}>
        <button
          onClick={onOpenMobileSidebar}
          className="hamburger-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.4rem'
          }}
        >
          <Menu size={22} />
        </button>

        {/* Page Title */}
        <div style={{ display: 'none', minWidth: '160px' }} className="navbar-title-desktop">
          <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            {screenTitles[currentScreen] || 'AI Platform'}
          </span>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search leads, companies, signals, scores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onNavigate('leads');
              }
            }}
            style={{
              width: '100%',
              padding: '0.45rem 0.85rem 0.45rem 2.2rem',
              background: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'all var(--transition-fast)'
            }}
          />
        </div>
      </div>

      {/* Right Controls & AI Engine Online Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* AI Engine Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          background: 'var(--bg-surface-hover)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '0.725rem',
          fontWeight: '800',
          letterSpacing: '0.06em',
          color: 'var(--accent-primary)'
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981',
            display: 'inline-block'
          }} />
          <span>● AI ENGINE ONLINE</span>
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem',
            color: 'var(--text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background var(--transition-fast)'
          }}
        >
          {theme === 'light' ? <Moon size={18} color="var(--text-main)" /> : <Sun size={18} color="#f59e0b" />}
        </button>

        {/* Quick Add Lead Button */}
        <button
          onClick={onOpenAddLeadModal}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          <span>Add Lead</span>
        </button>

        {/* Notifications Dropdown Container */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              background: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--transition-fast)'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '340px',
              background: 'rgba(16, 24, 38, 0.88)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(105, 240, 238, 0.18)',
              borderRadius: '20px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(105, 240, 238, 0.1)',
              zIndex: 200,
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{
                padding: '0.85rem 1rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.725rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.type === 'urgent' || item.type === 'warning') onNavigate('recommendations');
                      setShowNotifications(false);
                    }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: item.read ? 'transparent' : 'rgba(79, 70, 229, 0.06)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                      {item.type === 'urgent' ? (
                        <AlertTriangle size={16} color="#ef4444" style={{ marginTop: '2px' }} />
                      ) : item.type === 'warning' ? (
                        <Sparkles size={16} color="#ea580c" style={{ marginTop: '2px' }} />
                      ) : (
                        <Info size={16} color="var(--accent-cyan)" style={{ marginTop: '2px' }} />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>
                          {item.message}
                        </div>
                        <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Icon */}
        <button
          onClick={() => onNavigate('model-intelligence')}
          title="Model Help & Documentation"
          style={{
            background: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <HelpCircle size={18} />
        </button>

        {/* User Profile Avatar */}
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #69f0ee 0%, #34a6cb 100%)',
          color: '#050607',
          fontWeight: '800',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(105, 240, 238, 0.35)'
        }}>
          H
        </div>
      </div>
    </header>
  );
};
