import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { t, language, setLanguage, darkMode, setDarkMode, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+251 91 234 5678',
    dept: currentUser?.dept || '',
    position: currentUser?.position || '',
    bio: 'Experienced professional at Ethiopian company.',
  });
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    lateArrival: true,
    overtime: true,
    leaveApproval: true,
    dailyReport: false,
    weeklyReport: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const LANGS = [
    { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', flag: '🇪🇹' },
    { code: 'or', label: 'Oromo', nativeLabel: 'Afaan Oromoo', flag: '🇪🇹' },
  ];

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('settings')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your account settings and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Sidebar */}
        <div className="card" style={{ padding: '8px', height: 'fit-content' }}>
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'language', label: 'Language', icon: '🌐' },
            { id: 'appearance', label: 'Appearance', icon: '🎨' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'security', label: 'Security', icon: '🔐' },
            { id: 'system', label: 'System', icon: '⚙' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {saved && (
            <div className="alert alert-success" style={{ marginBottom: 16 }}>
              ✅ Settings saved successfully!
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>👤 Profile Information</h3>

              {/* Avatar section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                <div className="avatar" style={{ width: 64, height: 64, fontSize: 22 }}>
                  {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{currentUser?.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{currentUser?.role === 'manager' ? 'Manager' : 'Employee'}</div>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>Change Photo</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('email')}</label>
                  <input type="email" className="form-control" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('department')}</label>
                  <input className="form-control" value={profile.dept} onChange={e => setProfile(p => ({ ...p, dept: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Position</label>
                  <input className="form-control" value={profile.position} onChange={e => setProfile(p => ({ ...p, position: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleSave}>💾 {t('save')} Changes</button>
            </div>
          )}

          {activeTab === 'language' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>🌐 Language / ቋንቋ / Afaan</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
                Select your preferred language. The interface will switch immediately.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {LANGS.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius)',
                      border: `2px solid ${language === lang.code ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14,
                      background: language === lang.code ? 'rgba(37,99,235,0.05)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{lang.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{lang.nativeLabel}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{lang.label}</div>
                    </div>
                    {language === lang.code && (
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 12, fontWeight: 700,
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="alert alert-info" style={{ marginTop: 16 }}>
                <span>ℹ️</span>
                <span>Language changes take effect immediately without page reload. All menus, reports and notifications will be translated.</span>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🎨 Appearance</h3>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Color Mode</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { id: false, label: 'Light Mode', icon: '☀️', desc: 'Classic bright interface' },
                    { id: true, label: 'Dark Mode', icon: '🌙', desc: 'Easy on the eyes at night' },
                  ].map(mode => (
                    <div
                      key={mode.id.toString()}
                      onClick={() => setDarkMode(mode.id)}
                      style={{
                        flex: 1, padding: '1rem', borderRadius: 'var(--radius)',
                        border: `2px solid ${darkMode === mode.id ? 'var(--primary)' : 'var(--border)'}`,
                        cursor: 'pointer', textAlign: 'center',
                        background: darkMode === mode.id ? 'rgba(37,99,235,0.05)' : 'transparent',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{mode.icon}</div>
                      <div style={{ fontWeight: 600 }}>{mode.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mode.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Ethiopian Flag Accent</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { color: '#078930', label: 'Green' },
                    { color: '#FCDD09', label: 'Yellow' },
                    { color: '#DA121A', label: 'Red' },
                    { color: '#2563EB', label: 'Blue' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: c.color, cursor: 'pointer',
                        border: i === 3 ? '3px solid var(--text-primary)' : '3px solid transparent',
                        transition: 'transform 0.15s',
                      }} />
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Font Size</div>
                <input type="range" min={12} max={18} defaultValue={14} style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Small</span>
                  <span>Default</span>
                  <span>Large</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🔔 {t('notifications')}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive alerts via email' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive alerts via SMS' },
                  { key: 'lateArrival', label: 'Late Arrival Notifications', desc: 'Get notified when you arrive late' },
                  { key: 'overtime', label: 'Overtime Notifications', desc: 'Alerts when overtime is recorded' },
                  { key: 'leaveApproval', label: 'Leave Approval Updates', desc: 'Status updates on leave requests' },
                  { key: 'dailyReport', label: 'Daily Summary Report', desc: 'Receive daily attendance digest' },
                  { key: 'weeklyReport', label: 'Weekly Summary Report', desc: 'Receive weekly performance digest' },
                ].map(n => (
                  <div key={n.key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-2)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{n.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.desc}</div>
                    </div>
                    <div
                      onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))}
                      style={{
                        width: 44, height: 24, borderRadius: 12,
                        background: notifications[n.key] ? 'var(--primary)' : 'var(--border)',
                        cursor: 'pointer', position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2,
                        left: notifications[n.key] ? 22 : 2,
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'white', transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleSave}>
                💾 {t('save')} Preferences
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🔐 Security Settings</h3>

              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>

              <button className="btn btn-primary" style={{ marginBottom: 20 }}>Update Password</button>

              <div className="divider" />

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Two-Factor Authentication (MFA)</div>
                <div className="alert alert-warning">
                  <span>⚠️</span>
                  <span>MFA is not enabled. Enable it for enhanced security.</span>
                </div>
                <button className="btn btn-success btn-sm">Enable MFA</button>
              </div>

              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Active Sessions</div>
                {[
                  { device: 'Chrome on Windows', location: 'Addis Ababa, ET', time: 'Active now', current: true },
                  { device: 'Firefox on MacOS', location: 'Addis Ababa, ET', time: '2 days ago', current: false },
                ].map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-2)', marginBottom: 6,
                  }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{s.device}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.location} · {s.time}</div>
                    </div>
                    {s.current ? (
                      <span className="badge badge-success">Current</span>
                    ) : (
                      <button className="btn btn-danger btn-sm">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>⚙ System Configuration</h3>

              {[
                {
                  label: 'Work Hours Per Day', value: '8 hours', desc: 'Standard working hours requirement'
                },
                {
                  label: 'Work Week', value: 'Monday – Friday', desc: 'Standard working days'
                },
                {
                  label: 'Calendar System', value: 'Ethiopian Calendar (EC)', desc: 'Primary calendar for tracking'
                },
                {
                  label: 'Fiscal Year Start', value: 'Hamle 1', desc: 'Ethiopian government fiscal year: Hamle 1 – Sene 30'
                },
                {
                  label: 'Fiscal Year End', value: 'Sene 30', desc: 'Current FY: Hamle 1, 2017 – Sene 30, 2018 EC'
                },
                {
                  label: 'Overtime Threshold', value: '8 hours/day', desc: 'Hours after which overtime is counted'
                },
                {
                  label: 'Late Arrival Threshold', value: '30 minutes', desc: 'Grace period before marking as late'
                },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{item.value}</span>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <div className="alert alert-info">
                  <span>ℹ️</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>System Version</div>
                    <div>ሰዓት ETMS v2.0.0 — Ethiopian Time Management System</div>
                    <div style={{ fontSize: '0.75rem', color: 'inherit', marginTop: 2 }}>Last updated: Sene 2018 EC</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
