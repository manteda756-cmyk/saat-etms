import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  EMPLOYEES, MONTHLY_ATTENDANCE, WEEKLY_HOURS, DEPT_PERFORMANCE,
  AI_INSIGHTS, generateHeatmapData, formatHours, getProductivityColor,
  greetingByTime,
} from '../data/mockData';

function KPICard({ icon, iconBg, label, value, sub, trend, color }) {
  return (
    <div className="kpi-card card-interactive animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="kpi-icon" style={{ background: iconBg }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: '0.75rem', fontWeight: 600,
            color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: color || 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

function GaugeChart({ value, max = 100, color = '#2563EB', size = 140, label }) {
  const pct = Math.min(value / max, 1);
  const angle = pct * 180 - 90;
  const r = 52;
  const cx = size / 2;
  const cy = size * 0.6;

  const arcPath = (startAngle, endAngle, r) => {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  function polarToCartesian(cx, cy, r, angle) {
    const a = (angle - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  const needleTip = polarToCartesian(cx, cy, r - 8, angle);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        <path d={arcPath(-90, 90, r)} stroke="var(--border)" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d={arcPath(-90, -90 + pct * 180, r)} stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill={color} />
        <text x={cx} y={cy - 18} textAnchor="middle" style={{ fontSize: 18, fontWeight: 700, fill: 'var(--text-primary)' }}>
          {value}%
        </text>
      </svg>
      {label && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: -8 }}>{label}</div>}
    </div>
  );
}

const HEATMAP_COLORS = ['#e2e8f0', '#bbf7d0', '#86efac', '#4ade80', '#16a34a'];
function getHeatColor(v) {
  if (v < 40) return HEATMAP_COLORS[0];
  if (v < 60) return HEATMAP_COLORS[1];
  if (v < 75) return HEATMAP_COLORS[2];
  if (v < 90) return HEATMAP_COLORS[3];
  return HEATMAP_COLORS[4];
}

export default function Dashboard({ setCurrentPage }) {
  const { t, language, currentUser } = useApp();
  const [heatmapData] = useState(() => generateHeatmapData());
  const [animateKPI, setAnimateKPI] = useState(false);

  useEffect(() => { setTimeout(() => setAnimateKPI(true), 100); }, []);

  const presentCount = EMPLOYEES.filter(e => e.status === 'present').length;
  const lateCount = EMPLOYEES.filter(e => e.status === 'late').length;
  const absentCount = EMPLOYEES.filter(e => e.status === 'absent').length;
  const onLeave = EMPLOYEES.filter(e => e.status === 'leave').length;
  const totalWorked = EMPLOYEES.reduce((s, e) => s + e.workedHours, 0);
  const avgProductivity = Math.round(EMPLOYEES.filter(e => e.workedHours > 0).reduce((s, e) => s + e.productivity, 0) / EMPLOYEES.filter(e => e.workedHours > 0).length);

  const pieData = [
    { name: t('present'), value: presentCount, color: '#10b981' },
    { name: t('late'), value: lateCount, color: '#f59e0b' },
    { name: t('absent'), value: absentCount, color: '#ef4444' },
    { name: t('onLeave'), value: onLeave, color: '#3b82f6' },
  ];

  return (
    <div className="page-content animate-fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {greetingByTime(t)}, {currentUser?.name?.split(' ')[0] || 'User'} 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
          {t('todayOverview')} — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Ethiopian stripe */}
      <div className="eth-stripe" style={{ marginBottom: 24, borderRadius: 4 }} />

      {/* KPI Grid */}
      <div className="grid grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
        <KPICard
          icon="👥" iconBg="rgba(37,99,235,0.1)"
          label={t('totalEmployees')} value={EMPLOYEES.length}
          sub="Active this month" trend={5}
        />
        <KPICard
          icon="✅" iconBg="rgba(16,185,129,0.1)"
          label={t('presentToday')} value={presentCount}
          sub={`${Math.round(presentCount / EMPLOYEES.length * 100)}% attendance rate`}
          trend={2} color="var(--success)"
        />
        <KPICard
          icon="⚠️" iconBg="rgba(245,158,11,0.1)"
          label={t('lateArrivals')} value={lateCount}
          sub="Vs. 5 yesterday" trend={-40} color="var(--warning)"
        />
        <KPICard
          icon="❌" iconBg="rgba(239,68,68,0.1)"
          label={t('absentToday')} value={absentCount + onLeave}
          sub={`${onLeave} on leave, ${absentCount} unexcused`}
          trend={-10} color="var(--danger)"
        />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
        <KPICard
          icon="⏱️" iconBg="rgba(124,58,237,0.1)"
          label={t('hoursWorkedToday')} value={`${formatHours(totalWorked)}h`}
          sub="Total across all employees" trend={3}
        />
        <KPICard
          icon="📈" iconBg="rgba(16,185,129,0.1)"
          label={t('productivity')} value={`${avgProductivity}%`}
          sub="Company average" trend={4} color={getProductivityColor(avgProductivity)}
        />
        <KPICard
          icon="⏰" iconBg="rgba(59,130,246,0.1)"
          label={t('overtime')} value={`${formatHours(EMPLOYEES.filter(e => e.workedHours > 8).reduce((s, e) => s + (e.workedHours - 8), 0))}h`}
          sub="Total overtime today" trend={-5} color="#3b82f6"
        />
        <KPICard
          icon="🌿" iconBg="rgba(245,158,11,0.1)"
          label={t('onLeave')} value={onLeave}
          sub="Active leave requests" color="var(--warning)"
        />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Weekly hours chart */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">📊 Weekly Hours Overview</div>
            <div className="tab-bar" style={{ padding: 3 }}>
              {['Week', 'Month'].map(t => (
                <button key={t} className={`tab-item${t === 'Week' ? ' active' : ''}`} style={{ padding: '5px 10px', fontSize: '0.75rem' }}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={WEEKLY_HOURS}>
              <defs>
                <linearGradient id="workedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="overGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="worked" name="Worked Hours" stroke="#2563EB" strokeWidth={2} fill="url(#workedGrad)" />
              <Area type="monotone" dataKey="target" name="Target (8h)" stroke="#10b981" strokeWidth={2} strokeDasharray="4 2" fill="none" />
              <Area type="monotone" dataKey="overtime" name="Overtime" stroke="#3b82f6" strokeWidth={2} fill="url(#overGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance pie */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">📅 Today's Attendance</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {Math.round(presentCount / EMPLOYEES.length * 100)}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Monthly attendance */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">📆 Monthly Attendance Trend</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_ATTENDANCE} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department performance */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">🏢 Department Productivity</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 210 }}>
            {DEPT_PERFORMANCE.map((dept, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>{dept.dept}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: getProductivityColor(dept.productivity) }}>
                    {dept.productivity}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.min(dept.productivity, 100)}%`,
                    background: getProductivityColor(dept.productivity),
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Today's employees */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">👥 Employee Status</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentPage('employees')}>
              {t('viewAll')} →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {EMPLOYEES.slice(0, 5).map(emp => (
              <div key={emp.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-2)',
              }}>
                <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{emp.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emp.name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{emp.dept}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: getProductivityColor(emp.productivity) }}>
                    {formatHours(emp.workedHours)}h
                  </div>
                  <span className={`badge badge-${emp.status === 'present' ? 'success' : emp.status === 'late' ? 'warning' : emp.status === 'absent' ? 'danger' : 'info'}`} style={{ fontSize: '0.625rem' }}>
                    {t(emp.status === 'leave' ? 'onLeave' : emp.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div className="section-header">
            <div className="section-title">🤖 {t('aiInsights')}</div>
            <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>AI</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {AI_INSIGHTS.slice(0, 4).map((insight, i) => (
              <div key={i} style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{insight.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {language === 'am' ? insight.titleAm : insight.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                    {language === 'am' ? insight.descAm : insight.description}
                  </div>
                </div>
                <span className={`badge badge-${insight.priority === 'high' ? 'danger' : insight.priority === 'medium' ? 'warning' : 'success'}`} style={{ fontSize: '0.625rem', flexShrink: 0 }}>
                  {insight.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
