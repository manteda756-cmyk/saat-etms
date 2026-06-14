import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const DEMO_USERS = [
  {
    id: 1, name: 'Abebe Girma', email: 'employee@demo.et',
    password: 'demo123', role: 'employee',
    dept: 'Engineering', position: 'Software Engineer',
  },
  {
    id: 2, name: 'Sara Tesfaye', email: 'manager@demo.et',
    password: 'demo123', role: 'manager',
    dept: 'Marketing', position: 'Marketing Manager',
  },
];

export default function Login({ onBack }) {
  const { t, login, language, setLanguage, darkMode, setDarkMode } = useApp();
  const [mode, setMode] = useState('login'); // login | register
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', dept: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email === form.email && u.password === form.password);
      if (user) {
        login(user);
      } else {
        setError('Invalid email or password. Try employee@demo.et or manager@demo.et with demo123');
      }
      setLoading(false);
    }, 800);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login({
        id: 99, name: form.name, email: form.email,
        role: 'employee', dept: form.dept || 'General', position: 'Employee',
      });
      setLoading(false);
    }, 800);
  };

  const quickLogin = (user) => {
    setLoading(true);
    setTimeout(() => { login(user); setLoading(false); }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: darkMode
        ? 'linear-gradient(135deg, #0f172a, #1e293b)'
        : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    }}>
      {/* Left panel - branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f3460 100%)',
        padding: '48px', color: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        minWidth: 320,
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #078930, #2563EB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 22,
            }}>ሰ</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>ሰዓት ETMS</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Ethiopian Time Management</div>
            </div>
          </div>

          <div className="eth-stripe" style={{ marginBottom: 32, width: 80 }} />

          <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Welcome to<br />Ethiopia's #1<br />Workforce Platform
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 32 }}>
            Track ስራ ላይ የዋለ ሰዓት, reduce የባከነ ሰዓት, and manage your team with the Ethiopian Calendar built-in.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '📅', text: 'Ethiopian Calendar (EC) built-in' },
              { icon: '🌍', text: 'English · አማርኛ · Afaan Oromoo' },
              { icon: '🤖', text: 'AI-powered productivity insights' },
              { icon: '📊', text: 'Real-time dashboards & reports' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.8)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div style={{
        width: 480, padding: '48px 40px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', background: 'var(--surface)',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <div style={{ display: 'flex', gap: 6 }}>
            {['en', 'am', 'or'].map(code => (
              <button key={code} className={`btn btn-sm ${language === code ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => setLanguage(code)}>
                {code === 'en' ? 'EN' : code === 'am' ? 'አማ' : 'OR'}
              </button>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="tab-bar" style={{ marginBottom: 28, width: '100%' }}>
          <button className={`tab-item${mode === 'login' ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setMode('login')}>
            {t('signIn')}
          </button>
          <button className={`tab-item${mode === 'register' ? ' active' : ''}`} style={{ flex: 1 }} onClick={() => setMode('register')}>
            {t('signUp')}
          </button>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>
          {mode === 'login' ? t('signIn') : t('signUp')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>
          {mode === 'login' ? 'Sign in to your Ethiopian Time Management account' : 'Create your account to get started'}
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16 }}>
            <span>⚠️</span>
            <span style={{ fontSize: '0.8125rem' }}>{error}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input type="email" className="form-control" placeholder="your@email.et"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">{t('password')}</label>
              <input type={showPw ? 'text' : 'password'} className="form-control" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
              <button type="button" className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', right: 4, top: 26, padding: '4px 8px' }}
                onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" /> {t('rememberMe')}
              </label>
              <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
                {t('forgotPassword')}
              </a>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44 }} disabled={loading}>
              {loading ? '⏳ Signing in...' : `🔐 ${t('signIn')}`}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="Abebe Girma"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input type="email" className="form-control" placeholder="abebe@company.et"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('department')}</label>
              <select className="form-control" value={form.dept} onChange={e => setForm(p => ({ ...p, dept: e.target.value }))}>
                <option value="">Select department</option>
                {['Engineering', 'Finance', 'HR', 'Marketing', 'Operations', 'Sales', 'IT', 'Legal'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <input type="password" className="form-control" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="••••••••"
                value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 44 }} disabled={loading}>
              {loading ? '⏳ Creating account...' : `🚀 ${t('signUp')}`}
            </button>
          </form>
        )}

        {mode === 'login' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Quick Demo Access</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {DEMO_USERS.map(user => (
                <button key={user.id}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', flexDirection: 'column', height: 64, gap: 4 }}
                  onClick={() => quickLogin(user)}
                  disabled={loading}
                >
                  <span style={{ fontSize: 18 }}>{user.role === 'manager' ? '👔' : '👤'}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{user.role === 'manager' ? 'Manager Demo' : 'Employee Demo'}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
