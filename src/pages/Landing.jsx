import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCurrentEthDate, ETH_MONTHS, ETH_MONTHS_EN } from '../data/mockData';

const FEATURES = [
  { icon: '⏱️', title: 'Smart Time Tracking', titleAm: 'ብልሃተኛ የሰዓት መከታተያ', desc: 'Automatically calculate worked time (ስራ ላይ የዋለ ሰዓት) and wasted time (የባከነ ሰዓት) with real-time analytics.' },
  { icon: '📅', title: 'Ethiopian Calendar', titleAm: 'የኢትዮጵያ ቀን መቁጠሪያ', desc: 'Full EC support with Ethiopian months, holidays, fiscal year and Gregorian date conversion.' },
  { icon: '🌍', title: 'Multi-Language', titleAm: 'ብዙ ቋንቋ', desc: 'Switch seamlessly between English, አማርኛ (Amharic), and Afaan Oromoo.' },
  { icon: '📊', title: 'Advanced Analytics', titleAm: 'የላቀ ትንታኔ', desc: 'AI-powered insights, department reports, productivity trends and performance leaderboards.' },
  { icon: '✅', title: 'Leave Management', titleAm: 'የፈቃድ አስተዳደር', desc: 'Submit, approve and track leave requests with automated balance tracking.' },
  { icon: '🔔', title: 'Smart Alerts', titleAm: 'ብልህ ማስጠንቀቂያ', desc: 'Late arrival alerts, overtime notifications and attendance anomaly detection via email & SMS.' },
  { icon: '🤖', title: 'AI Productivity Insights', titleAm: 'AI ምርታማነት ትንታኔ', desc: 'Machine learning analysis identifies patterns, top performers, and efficiency opportunities.' },
  { icon: '📱', title: 'Mobile First', titleAm: 'ሞባይል ቅድሚያ', desc: 'Fully responsive design that works perfectly on smartphones, tablets and desktops.' },
];

const PRICING = [
  {
    plan: 'Starter',
    price: '999',
    currency: 'ETB',
    period: '/month',
    features: ['Up to 25 employees', 'Time tracking', 'Ethiopian Calendar', 'Basic reports', 'Email support'],
    highlight: false,
  },
  {
    plan: 'Business',
    price: '2,499',
    currency: 'ETB',
    period: '/month',
    features: ['Up to 100 employees', 'All Starter features', 'Manager dashboard', 'AI insights', 'Leave management', 'Multi-language', 'Priority support'],
    highlight: true,
    badge: 'Most Popular',
  },
  {
    plan: 'Enterprise',
    price: 'Custom',
    currency: '',
    period: '',
    features: ['Unlimited employees', 'All Business features', 'Custom integrations', 'Dedicated support', 'On-premise option', 'SLA guarantee', 'Training included'],
    highlight: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Ato Kebede Mulugeta',
    role: 'HR Director, Ethio Telecom',
    content: 'ሰዓት ETMS transformed how we manage our 2,000+ employees. The Ethiopian Calendar integration is exactly what we needed.',
    avatar: 'KM',
  },
  {
    name: 'W/ro Sara Haile',
    role: 'Operations Manager, CBE',
    content: 'The ስራ ላይ የዋለ ሰዓት / የባከነ ሰዓት tracking gave us real visibility into productivity. Highly recommended.',
    avatar: 'SH',
  },
  {
    name: 'Ato Dawit Abebe',
    role: 'CEO, Zemen Bank',
    content: 'Multi-language support in Amharic and Oromo made adoption across all departments seamless and fast.',
    avatar: 'DA',
  },
];

const FAQ = [
  { q: 'Does the system support the Ethiopian Calendar?', a: 'Yes! Full Ethiopian Calendar support including all 13 months, public holidays, fiscal year tracking and EC↔Gregorian date conversion.' },
  { q: 'What languages are supported?', a: 'The system supports English, አማርኛ (Amharic), and Afaan Oromoo (Oromo) with seamless switching and saved user preferences.' },
  { q: 'How is ስራ ላይ የዋለ ሰዓት calculated?', a: 'Worked time = Total hours (end time - start time) minus break time. Unworked time (የባከነ ሰዓት) = 8 hours standard - worked hours.' },
  { q: 'Is the system cloud-based?', a: 'Yes, ሰዓት ETMS is fully cloud-hosted on AWS/Azure with 99.9% uptime SLA and bank-level data security.' },
  { q: 'Can managers approve overtime from mobile?', a: 'Yes, the mobile-first design allows full manager functionality including overtime approvals, leave management and team reports.' },
];

export default function Landing({ onNavigateToLogin }) {
  const { t, language, setLanguage, darkMode, setDarkMode } = useApp();
  const ethToday = getCurrentEthDate();
  const currentEthMonthName = ETH_MONTHS[ethToday.month - 1];
  const currentEthMonthNameEn = ETH_MONTHS_EN[ethToday.month - 1];
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [msgSent, setMsgSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 3000);
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #078930, #2563EB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 18,
            }}>ሰ</div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>ሰዓት ETMS</span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 24, marginLeft: 32 }}>
            {['Features', 'Pricing', 'FAQ', 'Contact'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{
                color: 'var(--text-secondary)', textDecoration: 'none',
                fontSize: '0.9375rem', fontWeight: 500,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{link}</a>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Lang */}
            {['en', 'am', 'or'].map(code => (
              <button key={code} className={`btn btn-sm ${language === code ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                onClick={() => setLanguage(code)}>
                {code === 'en' ? 'EN' : code === 'am' ? 'አማ' : 'OR'}
              </button>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onNavigateToLogin}>{t('signIn')}</button>
            <button className="btn btn-primary btn-sm" onClick={onNavigateToLogin}>{t('getStarted')}</button>
          </div>
        </div>
      </nav>

      {/* Ethiopian flag stripe */}
      <div className="eth-stripe" style={{ borderRadius: 0, height: 4 }} />

      {/* Hero */}
      <section style={{
        background: darkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f3460 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f3460 100%)',
        padding: '80px 24px',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 100, marginBottom: 20 }}>
            <span style={{ color: '#FCDD09' }}>🇪🇹</span>
            <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>Built for Ethiopian organizations</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20,
            background: 'linear-gradient(135deg, #ffffff, #93c5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {t('heroTitle')}
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.75)', marginBottom: 12, maxWidth: 600, margin: '0 auto 12px' }}>
            {t('heroSubtitle')}
          </p>

          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)', marginBottom: 32, fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
            ስራ ላይ የዋለ ሰዓት ይቆጥሩ · የባከነ ሰዓት ይቀንሱ · ምርታማነት ይጨምሩ
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <button className="btn btn-lg" style={{ background: '#078930', color: 'white' }} onClick={onNavigateToLogin}>
              🚀 {t('getStarted')}
            </button>
            <button className="btn btn-lg btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              ▶ Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { value: '500+', label: 'Ethiopian Companies' },
              { value: '50,000+', label: 'Employees Managed' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '3 Langs', label: 'EN / አማ / OR' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FCDD09' }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview cards */}
      <section style={{ background: 'var(--surface-2)', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Live Dashboard Preview</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>See exactly what your team sees every day</p>
          </div>

          {/* Mock dashboard cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
            {[
              { icon: '👥', label: 'Employees', value: '248', sub: 'Total active', color: '#2563EB' },
              { icon: '✅', label: t('presentToday'), value: '215', sub: '87% attendance', color: '#10b981' },
              { icon: '⏰', label: t('lateArrivals'), value: '12', sub: 'Need attention', color: '#f59e0b' },
              { icon: '📈', label: t('productivity'), value: '94%', sub: 'Company average', color: '#7c3aed' },
            ].map((card, i) => (
              <div key={i} className="card card-interactive" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', marginTop: 2 }}>{card.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Ethiopian-specific card */}
          <div className="card" style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(7,137,48,0.08), rgba(37,99,235,0.08))',
            borderColor: 'rgba(7,137,48,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: 'linear-gradient(135deg, #078930, #2563EB)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 24, flexShrink: 0,
              }}>⏱</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Today's Time Summary — Sample Employee</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time calculation using Ethiopian work standards</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { icon: '✅', label: 'ስራ ላይ የዋለ ሰዓት', value: '6:45 hrs', color: '#10b981' },
                  { icon: '⚠️', label: 'የባከነ ሰዓት', value: '1:15 hrs', color: '#f59e0b' },
                  { icon: '📈', label: 'Productivity', value: '84%', color: '#2563EB' },
                  { icon: '⏰', label: 'Overtime', value: '0 hrs', color: '#94a3b8' },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 2 }}>{m.icon}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: m.color }}>{m.value}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-success" style={{ marginBottom: 12 }}>Features</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>{t('featuresTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              Specifically designed for Ethiopian organizations with local calendar, language and HR compliance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(7,137,48,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 14,
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{language === 'am' ? f.titleAm : f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethiopian Calendar showcase */}
      <section style={{ padding: '80px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: 12 }}>🇪🇹 Ethiopian First</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>
              Full Ethiopian Calendar Integration
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
              Unlike generic HR tools, ሰዓት ETMS is built with the Ethiopian Calendar at its core. Track attendance in EC dates, view Ethiopian public holidays, and manage the Ethiopian fiscal year.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                '✅ All 13 Ethiopian months (12×30 + Pagume)',
                '✅ Ethiopian public holidays automatically blocked',
                '✅ Fiscal year tracking (Hamle 1 → Sene 30)',
                '✅ EC ↔ Gregorian date conversion',
                '✅ Reports in Ethiopian dates',
              ].map((item, i) => (
                <div key={i} style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{item}</div>
              ))}
            </div>
          </div>
          {/* Calendar visual */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                {currentEthMonthName} {ethToday.year} EC
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {currentEthMonthNameEn} {ethToday.year} · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {['እሑ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሓሙ', 'ዓር', 'ቅዳ'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', padding: '4px', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{d}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                <div key={day} style={{
                  textAlign: 'center', padding: '6px 4px', borderRadius: '50%',
                  background: day === 17 ? 'rgba(7,137,48,0.15)' : day === 22 ? 'var(--primary)' : 'transparent',
                  color: day === 22 ? 'white' : day === 17 ? 'var(--et-green)' : 'var(--text-primary)',
                  fontSize: '0.8125rem', fontWeight: day === 22 ? 700 : 400,
                  border: day === 17 ? '1px solid var(--et-green)' : 'none',
                  cursor: 'pointer',
                }}>{day}</div>
              ))}
            </div>
            <div className="eth-stripe" style={{ marginTop: 12 }} />
            <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} /> Today
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid var(--et-green)', display: 'inline-block' }} /> Holiday
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>{t('pricingTitle')}</h2>
            <p style={{ color: 'var(--text-muted)' }}>All plans include Ethiopian Calendar, multi-language support and 24/7 uptime</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {PRICING.map((plan, i) => (
              <div key={i} className="card" style={{
                padding: '1.75rem',
                border: plan.highlight ? '2px solid var(--primary)' : '1px solid var(--border)',
                position: 'relative',
                transform: plan.highlight ? 'scale(1.03)' : 'none',
                boxShadow: plan.highlight ? 'var(--shadow-xl)' : 'var(--shadow)',
              }}>
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--primary)', color: 'white', fontSize: '0.75rem',
                    fontWeight: 700, padding: '4px 14px', borderRadius: 100,
                  }}>{plan.badge}</div>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{plan.plan}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)' }}> {plan.currency}{plan.period}</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={onNavigateToLogin}
                >
                  {plan.plan === 'Enterprise' ? 'Contact Sales' : t('getStarted')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('testimonialsTitle')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', color: '#FCDD09', marginBottom: 12 }}>★★★★★</div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, fontSize: '0.9375rem' }}>
                  "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '80px 24px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Frequently Asked Questions</h2>
          </div>
          {FAQ.map((faq, i) => (
            <div key={i} className="card" style={{ marginBottom: 10, overflow: 'hidden' }}>
              <button
                style={{
                  width: '100%', padding: '1rem 1.25rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  font: 'inherit', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'left',
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span style={{ fontSize: '0.9375rem' }}>{faq.q}</span>
                <span style={{ fontSize: 18, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                  ▼
                </span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 1.25rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: '80px 24px', background: 'var(--surface-2)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>{t('contactTitle')}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Have questions? Our team responds within 24 hours.</p>

          {msgSent && (
            <div className="alert alert-success" style={{ marginBottom: 16, textAlign: 'left' }}>
              ✅ Message sent! We'll get back to you within 24 hours.
            </div>
          )}

          <form onSubmit={handleContact} style={{ textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-control" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows={4} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} required style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              📨 Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.7)', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #078930, #2563EB)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 18,
                }}>ሰ</div>
                <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'white' }}>ሰዓት ETMS</span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
                Ethiopia's leading workforce management platform. Tracking ስራ ላይ የዋለ ሰዓት, reducing የባከነ ሰዓት, and boosting productivity.
              </p>
              <div className="eth-stripe" style={{ marginTop: 16, width: 80 }} />
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'API Docs', 'Changelog'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, color: 'white', marginBottom: 12 }}>{col.title}</div>
                {col.links.map((link, j) => (
                  <div key={j} style={{ marginBottom: 8 }}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color = 'white'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                    >{link}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.8125rem' }}>© {ethToday.year} EC ({new Date().getFullYear()}) ሰዓት ETMS. All rights reserved.</span>
            <span style={{ fontSize: '0.8125rem' }}>Made with ❤️ for Ethiopia 🇪🇹</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
