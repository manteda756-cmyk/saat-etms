import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getCurrentEthDate, formatEthDate } from '../data/mockData';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'or', label: 'Afaan Oromoo', flag: '🇪🇹' },
];

export default function TopBar({ currentPage, setCurrentPage }) {
  const { t, language, setLanguage, darkMode, setDarkMode, currentUser, logout, notifications, unreadCount, markAllRead, setMobileSidebarOpen } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const ethDate = getCurrentEthDate();

  const langRef = useRef();
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pageTitles = {
    dashboard: t('dashboard'),
    attendance: t('attendance'),
    calendar: t('calendar'),
    leaves: t('leaves'),
    reports: t('reports'),
    employees: t('employees'),
    manager: t('manager'),
    settings: t('settings'),
  };

  const notifTypeColor = { info: 'var(--info)', warning: 'var(--warning)', success: 'var(--success)', danger: 'var(--danger)' };

  return (
    <header className="topbar" style={{ boxShadow: '0 1px 0 var(--border)' }}>
      {/* Mobile menu */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ display: 'none', padding: 8 }}
        id="mobile-menu-btn"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <span style={{ fontSize: 20 }}>☰</span>
      </button>

      <style>{`
        @media(max-width:1024px){
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* Page title */}
      <div>
        <h1 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {pageTitles[currentPage] || currentPage}
        </h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formatEthDate(ethDate.year, ethDate.month, ethDate.day, language)}
        </p>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Dark mode toggle */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: 8, fontSize: 18 }}
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? t('lightMode') : t('darkMode')}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Language selector */}
        <div className="relative" ref={langRef}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ gap: 6, fontSize: '0.8125rem' }}
            onClick={() => setLangOpen(!langOpen)}
          >
            <span>{LANGS.find(l => l.code === language)?.flag}</span>
            <span style={{ display: 'none' }} id="lang-label">{LANGS.find(l => l.code === language)?.label}</span>
            <span style={{ fontSize: 10 }}>▼</span>
          </button>
          <style>{`@media(min-width:640px){#lang-label{display:inline!important}}`}</style>

          {langOpen && (
            <div className="card" style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              minWidth: 160, zIndex: 200, padding: '4px',
              boxShadow: 'var(--shadow-lg)',
            }}>
              {LANGS.map(lang => (
                <button
                  key={lang.code}
                  className={`nav-item${language === lang.code ? ' active' : ''}`}
                  style={{ gap: 8, padding: '8px 12px' }}
                  onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                >
                  <span>{lang.flag}</span>
                  <span style={{ fontSize: '0.875rem' }}>{lang.label}</span>
                  {language === lang.code && <span style={{ marginLeft: 'auto', color: 'var(--primary)' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: 8, position: 'relative', fontSize: 18 }}
            onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge" style={{ position: 'absolute', top: 2, right: 2, fontSize: '0.5625rem', minWidth: 16, height: 16 }}>
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="card" style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 320, zIndex: 200,
              boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t('notifications')}</span>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={markAllRead}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: 10,
                    background: n.read ? 'transparent' : 'rgba(37,99,235,0.04)',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: notifTypeColor[n.type],
                      marginTop: 5, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '4px 8px', borderRadius: 'var(--radius-sm)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </div>
            <div style={{ display: 'none' }} id="profile-info">
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left' }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                {currentUser?.dept}
              </div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'none' }} id="chevron">▼</span>
          </button>
          <style>{`@media(min-width:640px){#profile-info{display:block!important}#chevron{display:inline!important}}`}</style>

          {profileOpen && (
            <div className="card" style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 200, zIndex: 200, padding: '4px',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <button className="nav-item" onClick={() => { setCurrentPage('settings'); setProfileOpen(false); }}>
                <span>👤</span> {t('profile')}
              </button>
              <button className="nav-item" onClick={() => { setCurrentPage('settings'); setProfileOpen(false); }}>
                <span>⚙</span> {t('settings')}
              </button>
              <div className="divider" style={{ margin: '4px 0' }} />
              <button className="nav-item" style={{ color: 'var(--danger)' }} onClick={logout}>
                <span>🚪</span> {t('logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
