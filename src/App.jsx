import React, { useState, useEffect } from 'react';
import { INITIAL_LEADS } from './data/mockData';
import { api } from './services/api';

// Shell & Landing
import { LandingPage } from './components/Landing/LandingPage';
import { Sidebar } from './components/Shell/Sidebar';
import { Navbar } from './components/Shell/Navbar';
import { Toast } from './components/Common/Toast';

// Screens
import { LoginScreen } from './components/Screens/LoginScreen';
import { DashboardScreen } from './components/Screens/DashboardScreen';
import { LeadsScreen } from './components/Screens/LeadsScreen';
import { LeadDetailsScreen } from './components/Screens/LeadDetailsScreen';
import { AIRecommendationsScreen } from './components/Screens/AIRecommendationsScreen';
import { AnalyticsScreen } from './components/Screens/AnalyticsScreen';
import { DataQualityScreen } from './components/Screens/DataQualityScreen';
import { ModelIntelligenceScreen } from './components/Screens/ModelIntelligenceScreen';
import { ImportDataScreen } from './components/Screens/ImportDataScreen';
import { AddLeadModal } from './components/Screens/AddLeadModal';
import { AIAssistantDrawer } from './components/Screens/AIAssistantDrawer';
import { SettingsScreen } from './components/Screens/SettingsScreen';
import { GradientBlinds } from './components/Backgrounds/GradientBlinds';

export default function App() {
  // Navigation view: 'landing' | 'login' | 'app'
  const [currentView, setCurrentView] = useState('landing');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Theme state defaulting to dark LeadIQ environment
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
  };

  // Data state
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState(INITIAL_LEADS[0]);
  
  // Fetch real leads from Node.js Express Gateway if available
  useEffect(() => {
    async function loadData() {
      try {
        const fetchedLeads = await api.getLeads();
        if (fetchedLeads && fetchedLeads.length > 0) {
          setLeads(fetchedLeads);
          setSelectedLead(fetchedLeads[0]);
        }
      } catch (err) {
        console.warn('Backend unavailable, using offline dataset:', err);
      }
    }
    loadData();
  }, []);

  // UI Overlays state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setCurrentScreen('lead-details');
  };

  const handleAddLead = async (newLead) => {
    try {
      const created = await api.createLead(newLead);
      setLeads(prev => [created, ...prev]);
      setSelectedLead(created);
      setCurrentScreen('lead-details');
      showToast(`Lead "${created.name}" added & scored successfully!`);
    } catch (err) {
      setLeads([newLead, ...leads]);
      setSelectedLead(newLead);
      setCurrentScreen('lead-details');
      showToast(`Lead "${newLead.name}" added & scored successfully!`);
    }
  };

  const handleTriggerAction = (actionName, details) => {
    showToast(`${actionName}: ${details}`);
  };

  const handleImportComplete = (count) => {
    showToast(`Imported ${count} lead records successfully!`, 'success');
    setCurrentScreen('leads');
  };

  // Main view content renderer
  const renderCurrentView = () => {
    if (currentView === 'landing') {
      return (
        <LandingPage
          onLoginSuccess={() => {
            setCurrentView('app');
            showToast("Authenticated as TechNova Technologies (VP Sales Ops)", "success");
          }}
          onOpenLoginScreen={() => setCurrentView('login')}
        />
      );
    }

    if (currentView === 'login') {
      return (
        <LoginScreen
          onLoginSuccess={() => {
            setCurrentView('app');
            showToast("Authenticated as TechNova Technologies (VP Sales Ops)", "success");
          }}
          onBackToLanding={() => setCurrentView('landing')}
        />
      );
    }

    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent', color: 'var(--text-main)' }}>
        {/* Sidebar Component */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(screenId) => setCurrentScreen(screenId)}
          onLogout={() => {
            setCurrentView('landing');
            showToast("Logged out of SaleSahara", "info");
          }}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area Container */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
          {/* Top Navbar */}
          <Navbar
            currentScreen={currentScreen}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
            onNavigate={(screenId) => setCurrentScreen(screenId)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />

          {/* Main View Screen Switcher */}
          <main style={{ flex: 1, marginLeft: '260px', paddingBottom: '3rem' }} className="main-content-wrapper">
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                leads={leads}
                onSelectLead={handleSelectLead}
                onTriggerAction={handleTriggerAction}
                onNavigate={(screenId) => setCurrentScreen(screenId)}
              />
            )}

            {currentScreen === 'leads' && (
              <LeadsScreen
                leads={leads}
                onSelectLead={handleSelectLead}
                onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
                onTriggerAction={handleTriggerAction}
              />
            )}

            {currentScreen === 'lead-details' && (
              <LeadDetailsScreen
                lead={selectedLead}
                onBack={() => setCurrentScreen('leads')}
                onTriggerAction={handleTriggerAction}
              />
            )}

            {currentScreen === 'recommendations' && (
              <AIRecommendationsScreen
                leads={leads}
                onSelectLead={handleSelectLead}
                onTriggerAction={handleTriggerAction}
              />
            )}

            {currentScreen === 'analytics' && (
              <AnalyticsScreen />
            )}

            {currentScreen === 'data-quality' && (
              <DataQualityScreen
                onTriggerAction={handleTriggerAction}
              />
            )}

            {currentScreen === 'model-intelligence' && (
              <ModelIntelligenceScreen
                onTriggerAction={handleTriggerAction}
              />
            )}

            {currentScreen === 'import' && (
              <ImportDataScreen
                onImportComplete={handleImportComplete}
              />
            )}

            {currentScreen === 'ai-assistant' && (
              <div style={{ padding: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  AI Assistant Workspace
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Use the floating AI Assistant widget at the bottom right to query lead scores, run simulations, or filter pipeline accounts.
                </p>
              </div>
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                onTriggerAction={handleTriggerAction}
              />
            )}
          </main>
        </div>
      </div>
    );
  };

  // 3. Render Layered Application (Gradient Blinds -> Dark Translucent Overlay -> App Shell)
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050607', color: 'var(--text-main)', overflowX: 'hidden' }}>
      
      {/* Layer 1: Gradient Blinds Background (Fixed, full viewport) */}
      <div style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#050607'
      }}>
        <GradientBlinds
          gradientColors={['#69F0EE', '#34A6CB']}
          blindCount={14}
          noise={0.16}
          angle={20}
          spotlightRadius={0.65}
          spotlightSoftness={1.1}
          spotlightOpacity={0.82}
          mouseDampening={0.12}
        />
      </div>

      {/* Layer 2: Dark Atmospheric Transparency Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(5, 6, 7, 0.55) 0%, rgba(5, 6, 7, 0.84) 100%)'
      }} />

      {/* Layer 3: Application Shell & Glassmorphic Surfaces */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
        {renderCurrentView()}
      </div>

      {/* Floating AI Assistant Panel & Trigger */}
      <AIAssistantDrawer
        leads={leads}
        onSelectLead={handleSelectLead}
        onTriggerAction={handleTriggerAction}
      />

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* Toast Notification Container */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
