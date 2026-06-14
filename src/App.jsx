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

function AppContent() {
  const { currentUser, sidebarCollapsed } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [view, setView] = useState('landing'); // landing | login | app

  // If logged in, show app
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
