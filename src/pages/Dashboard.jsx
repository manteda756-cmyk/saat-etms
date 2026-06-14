import React from 'react';
import { useApp } from '../context/AppContext';
import { formatHours, getProductivityColor, greetingByTime, getCurrentEthDate, formatEthDate } from '../data/mockData';

function KPICard({ icon, iconBg, label, value, sub, color }) {
  return (
    <div className="kpi-card card-interactive animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="kpi-icon" style={{ background: iconBg }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: color || 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function ReadyBanner({ setCurrentPage }) {
  return (
    <div style={{
      padding: '32px 24px',
      borderRadius: 'var(--radius-lg)',
      background: 'linear-gradient(135deg, rgba(7,137,48,0.08), rgba(37,99,235,0.08))',
      border: '1px solid rgba(37,99,235,0.2)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🚀</div>
      <h3 style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: 8 }}>
        System Ready — Real Data Starts Monday
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.7 }}>
        All mock data has been cleared. Employees can start logging attendance from Monday.
        Dashboard charts and reports will populate automatically as data comes in.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => setCurrentPage('attendance')}>
          ⏰ Log Today's Attendance
        </button>
        <button className="btn btn-secondary" onClick={() => setCurrentPage('employees')}>
          👥 Add Employees
        </button>
      </div>
    </div>
  );
}

function EmptyChart({ title, icon }) {
  return (
    <div className="chart-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="section-header">
        <div className="section-title">{title}</div>
      </div>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px', color: 'var(--text-muted)',
        minHeight: 180,
      }}>
        <span style={{ fontSize: 32, marginBottom: 10 }}>{icon}</span>
        <span style={{ fontSize: '0.8125rem' }}>No data yet — available after Monday</span>
      </div>
    </div>
  );
}

export default function Dashboard({ setCurrentPage }) {
  const { t, language, currentUser } = useApp();
  const ethDate = getCurrentEthDate();

  return (
    <div className="page-content animate-fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {greetingByTime(t)}, {currentUser?.name?.split(' ')[0] || 'User'} 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
          {t('todayOverview')} — {formatEthDate(ethDate.year, ethDate.month, ethDate.day, language)}
          &nbsp;·&nbsp;
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Ethiopian flag stripe */}
      <div className="eth-stripe" style={{ marginBottom: 24, borderRadius: 4 }} />

      {/* Ready banner */}
      <div style={{ marginBottom: 24 }}>
        <ReadyBanner setCurrentPage={setCurrentPage} />
      </div>

      {/* KPI placeholders */}
      <div className="grid grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
        <KPICard icon="👥" iconBg="rgba(37,99,235,0.1)"    label={t('totalEmployees')}   value="—" sub="Add employees to begin"         />
        <KPICard icon="✅" iconBg="rgba(16,185,129,0.1)"   label={t('presentToday')}      value="—" sub="Attendance from Monday"         color="var(--success)" />
        <KPICard icon="⏰" iconBg="rgba(245,158,11,0.1)"   label={t('lateArrivals')}      value="—" sub="No data yet"                    color="var(--warning)" />
        <KPICard icon="❌" iconBg="rgba(239,68,68,0.1)"    label={t('absentToday')}       value="—" sub="No data yet"                    color="var(--danger)"  />
      </div>

      <div className="grid grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
        <KPICard icon="⏱️" iconBg="rgba(124,58,237,0.1)"  label={t('hoursWorkedToday')} value="—" sub="ስራ ላይ የዋለ ሰዓት"            />
        <KPICard icon="⚠️" iconBg="rgba(239,68,68,0.1)"   label={t('unworkedTime')}      value="—" sub="የባከነ ሰዓት"                   color="var(--danger)"  />
        <KPICard icon="🔵" iconBg="rgba(59,130,246,0.1)"  label={t('overtime')}          value="—" sub="Overtime hours"               color="#3b82f6"        />
        <KPICard icon="📈" iconBg="rgba(16,185,129,0.1)"  label={t('productivity')}      value="—" sub="Company average"              color="var(--success)" />
      </div>

      {/* Charts row — empty states */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <EmptyChart title="📊 Weekly Hours Overview"  icon="📈" />
        <EmptyChart title="📅 Today's Attendance"     icon="🥧" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <EmptyChart title="📆 Monthly Attendance Trend"     icon="📊" />
        <EmptyChart title="🏢 Department Productivity"      icon="🏢" />
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Getting started checklist */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">✅ Getting Started Checklist</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🗄️', label: 'Run Supabase schema (supabase/schema.sql)',     done: true  },
              { icon: '🔐', label: 'Supabase credentials connected (.env.local)',    done: true  },
              { icon: '👥', label: 'Register employee accounts',                    done: false },
              { icon: '⏰', label: 'Log first attendance (Monday)',                  done: false },
              { icon: '📊', label: 'Dashboard charts will auto-populate',           done: false },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                background: item.done ? 'rgba(16,185,129,0.06)' : 'var(--surface-2)',
                border: `1px solid ${item.done ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: 14, color: item.done ? '#10b981' : 'var(--text-muted)' }}>
                  {item.done ? '✓' : '○'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">⚡ Quick Actions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '⏰', label: t('logAttendance'),         page: 'attendance', color: '#2563EB' },
              { icon: '📅', label: t('ethiopianCalendar'),     page: 'calendar',   color: '#078930' },
              { icon: '🌿', label: t('leaveRequest'),          page: 'leaves',     color: '#10b981' },
              { icon: '📊', label: t('reports'),               page: 'reports',    color: '#7c3aed' },
              { icon: '👥', label: t('employeeDirectory'),     page: 'employees',  color: '#f59e0b' },
            ].map((action, i) => (
              <button
                key={i}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', gap: 10, padding: '10px 12px' }}
                onClick={() => setCurrentPage(action.page)}
              >
                <span style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: `${action.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>{action.icon}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{action.label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
