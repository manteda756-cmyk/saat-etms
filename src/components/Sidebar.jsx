import React from 'react';
import { useApp } from '../context/AppContext';

const navItems = [
  { key: 'dashboard', icon: '⊞', path: 'dashboard' },
  { key: 'attendance', icon: '✓', path: 'attendance' },
  { key: 'calendar', icon: '📅', path: 'calendar' },
  { key: 'leaves', icon: '🌿', path: 'leaves' },
  { key: 'reports', icon: '📊', path: 'reports' },
  { key: 'employees', icon: '👥', path: 'employees' },
  { key: 'manager', icon: '📋', path: 'manager' },
];

const bottomItems = [
  { key: 'settings', icon: '⚙', path: 'settings' },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  const { t, darkMode, sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, currentUser } = useApp();

  const handleNav = (path) => {
    setCurrentPage(path);
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-90"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}${mobileSidebarOpen ? ' mobile-open' : ''}`}
        style={{ zIndex: 100 }}
      >
        {/* Logo */}
        <div style={{
          padding: '20px 16px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 64,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #078930, #2563EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 18,
            flexShrink: 0,
          }}>ሰ</div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                ሰዓት ETMS
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Ethiopian Time Management
              </div>
            </div>
          )}
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 'auto', padding: 6, flexShrink: 0 }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <span style={{ fontSize: 16 }}>{sidebarCollapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* Ethiopian flag stripe */}
        <div className="eth-stripe" style={{ margin: '0 12px' }} />

        {/* User info */}
        {!sidebarCollapsed && currentUser && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>
                {currentUser.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', truncate: 'truncate' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {currentUser.role === 'manager' ? 'Manager' : 'Employee'}
                </div>
              </div>
              <div className="status-dot online" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ padding: '8px', flex: 1 }}>
          {!sidebarCollapsed && (
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 8px 4px' }}>
              Main Menu
            </div>
          )}
          {navItems.map(item => (
            <div key={item.key} className="tooltip-wrapper">
              <button
                className={`nav-item${currentPage === item.path ? ' active' : ''}`}
                onClick={() => handleNav(item.path)}
                style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span>{t(item.key)}</span>}
              </button>
              {sidebarCollapsed && (
                <div className="tooltip" style={{ left: 'calc(100% + 12px)', bottom: 'auto', top: '50%', transform: 'translateY(-50%)' }}>
                  {t(item.key)}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
          {bottomItems.map(item => (
            <button
              key={item.key}
              className={`nav-item${currentPage === item.path ? ' active' : ''}`}
              onClick={() => handleNav(item.path)}
              style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{t(item.key)}</span>}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
