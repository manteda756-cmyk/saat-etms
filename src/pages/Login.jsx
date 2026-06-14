import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signIn, signUp } from '../lib/auth';

export default function Login({ onBack }) {
  const { t, language, setLanguage, darkMode, setDarkMode } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', dept: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [info, setInfo] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    setLoading(true);
    try {
      await signIn({ email: form.email, password: form.password });
      // AppContext auth listener handles the rest
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        fullName: form.name,
        department: form.dept,
        role: 'employee',
      });
      setInfo('✅ Account created! Check your email to confirm, then sign in.');
      setMode('login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick demo: sign in with demo credentials
  const handleDemoLogin = async (role) => {
    setError(''); setInfo('');
    setLoading(true);
    const email = role === 'manager' ? 'manager@demo.et' : 'employee@demo.et';
    try {
      await signIn({ email, password: 'Demo1234!' });
    } catch {
      // If demo user doesn't exist in Supabase, create and sign in
      try {
        await signUp({
          email,
          password: 'Demo1234!',
          fullName: role === 'manager' ? 'Sara Tesfaye (Demo)' : 'Abebe Girma (Demo)',
          department: role === 'manager' ? 'Marketing' : 'Engineering',
          role,
        });
        await signIn({ email, password: 'Demo1234!' });
      } catch (err2) {
        setError('Demo login failed: ' + err2.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: darkMode
        ? 'linear-gradient(135deg, #0f172a, #1e293b)'
        : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1, minWidth: 320,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f3460 100%)',
        padding: '48px', color: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
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
          Powered by Supabase — real-time data, secure auth, and cloud storage for your team.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '🔐', text: 'Secure Supabase Authentication' },
            { icon: '☁️', text: 'Real-time cloud database' },
            { icon: '📅', text: 'Ethiopian Calendar (EC) built-in' },
            { icon: '🌍', text: 'English · አማርኛ · Afaan Oromoo' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.8)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Supabase badge */}
        <div style={{
          marginTop: 40, padding: '10px 16px', borderRadius: 8,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', gap: 8, width: 'fit-content',
        }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>
            Powered by Supabase
          </span>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        width: 480, padding: '48px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: 'var(--surface)', boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
          <div style={{ display: 'flex', gap: 6 }}>
            {['en', 'am', 'or'].map(code => (
              <button key={code}
                className={`btn btn-sm ${language === code ? 'btn-primary' : 'btn-ghost'}`}
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

        <div className="tab-bar" style={{ marginBottom: 24, width: '100%' }}>
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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 20 }}>
          {mode === 'login' ? 'Sign in to your ETMS account' : 'Create your account to get started'}
        </p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 14 }}>
            <span>⚠️</span>
            <span style={{ fontSize: '0.8125rem' }}>{error}</span>
          </div>
        )}
        {info && (
          <div className="alert alert-success" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: '0.8125rem' }}>{info}</span>
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
              <input type={showPw ? 'text' : 'password'} className="form-control"
                placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
              <button type="button" className="btn btn-ghost btn-sm"
                style={{ position: 'absolute', right: 4, top: 26, padding: '4px 8px' }}
                onClick={() => setShowPw(!showPw)}>{showPw ? '🙈' : '👁'}</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" /> {t('rememberMe')}
              </label>
              <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
                {t('forgotPassword')}
              </a>
            </div>
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44 }} disabled={loading}>
              {loading ? `⏳ ${t('signingIn')}` : `🔐 ${t('signIn')}`}
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
              <input type="password" className="form-control" placeholder="min. 6 characters"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="••••••••"
                value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: 44 }} disabled={loading}>
              {loading ? `⏳ ${t('creatingAccount')}` : `🚀 ${t('signUp')}`}
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
              {[
                { role: 'employee', icon: '👤', label: 'Employee Demo' },
                { role: 'manager', icon: '👔', label: 'Manager Demo' },
              ].map(d => (
                <button key={d.role}
                  className="btn btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', flexDirection: 'column', height: 64, gap: 4 }}
                  onClick={() => handleDemoLogin(d.role)}
                  disabled={loading}>
                  <span style={{ fontSize: 20 }}>{d.icon}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{d.label}</span>
                </button>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10 }}>
              Demo accounts are created automatically in your Supabase project
            </p>
          </>
        )}
      </div>
    </div>
  );
}
