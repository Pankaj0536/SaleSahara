import React, { useState, useEffect } from 'react';
import { INITIAL_LEADS } from './data/mockData';

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
import { SalespersonComparisonScreen } from './components/Screens/SalespersonComparisonScreen';
import { CustomerRetentionScreen } from './components/Screens/CustomerRetentionScreen';

export default function App() {
  // Navigation view: 'landing' | 'login' | 'app'
  const [currentView, setCurrentView] = useState('landing');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Theme state defaulting to light
  const [theme, setTheme] = useState('light');

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

  const handleAddLead = (newLead) => {
    setLeads([newLead, ...leads]);
    setSelectedLead(newLead);
    setCurrentScreen('lead-details');
    showToast(`Lead "${newLead.name}" added & scored successfully!`);
  };

  const handleTriggerAction = (actionName, details) => {
    showToast(`${actionName}: ${details}`);
  };

  const handleImportComplete = (count) => {
    showToast(`Imported ${count} lead records successfully!`, 'success');
    setCurrentScreen('leads');
  };

  // 1. Render Landing Page
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

  // 2. Render Login Screen
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

  // 3. Render Main Application Shell
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
      
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

          {currentScreen === 'salesperson-comparison' && (
            <SalespersonComparisonScreen
              onTriggerAction={handleTriggerAction}
            />
          )}

          {currentScreen === 'customer-retention' && (
            <CustomerRetentionScreen
              onTriggerAction={handleTriggerAction}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              onTriggerAction={handleTriggerAction}
            />
          )}
        </main>
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
