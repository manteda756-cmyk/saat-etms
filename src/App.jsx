import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import EthiopianCalendar from './pages/EthiopianCalendar';
import LeaveManagement from './pages/LeaveManagement';
import Reports from './pages/Reports';
import Employees from './pages/Employees';
import ManagerDashboard from './pages/ManagerDashboard';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Login from './pages/Login';

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: 'white', gap: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'linear-gradient(135deg, #078930, #2563EB)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 700,
        animation: 'pulse 1.5s infinite',
      }}>ሰ</div>
      <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>ሰዓት ETMS</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
        Connecting to Supabase...
      </div>
      <div style={{
        width: 200, height: 3, background: 'rgba(255,255,255,0.1)',
        borderRadius: 2, overflow: 'hidden', marginTop: 8,
      }}>
        <div style={{
          width: '60%', height: '100%',
          background: 'linear-gradient(90deg, #078930, #2563EB)',
          animation: 'shimmer 1.5s infinite',
          backgroundSize: '200% 100%',
        }} />
      </div>
    </div>
  );
}

function AppContent() {
  const { currentUser, authLoading, sidebarCollapsed } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [view, setView] = useState('landing');

  // Show loading while Supabase checks session
  if (authLoading) return <LoadingScreen />;

  // Logged in — show app
  if (currentUser) {
    const pageComponents = {
      dashboard: <Dashboard setCurrentPage={setCurrentPage} />,
      attendance: <Attendance />,
      calendar: <EthiopianCalendar />,
      leaves: <LeaveManagement />,
      reports: <Reports />,
      employees: <Employees />,
      manager: <ManagerDashboard />,
      settings: <Settings />,
    };

    return (
      <div className="app-layout">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className={`main-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
          <TopBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main style={{ background: 'var(--surface-2)', minHeight: 'calc(100vh - 64px)' }}>
            {pageComponents[currentPage] || pageComponents.dashboard}
          </main>
        </div>
      </div>
    );
  }

  // Not logged in
  if (view === 'login') {
    return <Login onBack={() => setView('landing')} />;
  }

  return <Landing onNavigateToLogin={() => setView('login')} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
