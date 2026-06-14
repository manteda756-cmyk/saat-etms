import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MONTHLY_ATTENDANCE, DEPT_PERFORMANCE, EMPLOYEES, formatHours, getProductivityColor } from '../data/mockData';

const WEEKLY_DATA = [
  { day: 'Mon', worked: 7.5, target: 8, unworked: 0.5, productivity: 94 },
  { day: 'Tue', worked: 8.5, target: 8, unworked: 0, productivity: 106 },
  { day: 'Wed', worked: 6.0, target: 8, unworked: 2, productivity: 75 },
  { day: 'Thu', worked: 9.0, target: 8, unworked: 0, productivity: 112 },
  { day: 'Fri', worked: 8.0, target: 8, unworked: 0, productivity: 100 },
];

const TREND_DATA = [
  { month: 'Oct', productivity: 88, worked: 7.1, overtime: 1.2 },
  { month: 'Nov', productivity: 90, worked: 7.2, overtime: 0.9 },
  { month: 'Dec', productivity: 85, worked: 6.8, overtime: 1.5 },
  { month: 'Jan', productivity: 92, worked: 7.4, overtime: 0.8 },
  { month: 'Feb', productivity: 95, worked: 7.6, overtime: 1.1 },
  { month: 'Mar', productivity: 98, worked: 7.8, overtime: 1.4 },
];

const RADAR_DATA = [
  { subject: 'Attendance', A: 90, fullMark: 100 },
  { subject: 'Punctuality', A: 75, fullMark: 100 },
  { subject: 'Productivity', A: 88, fullMark: 100 },
  { subject: 'Overtime', A: 60, fullMark: 100 },
  { subject: 'Leave', A: 82, fullMark: 100 },
  { subject: 'Tasks', A: 91, fullMark: 100 },
];

export default function Reports() {
  const { t, language } = useApp();
  const [activeReport, setActiveReport] = useState('daily');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const topEmployees = [...EMPLOYEES]
    .filter(e => e.workedHours > 0)
    .sort((a, b) => b.productivity - a.productivity)
    .slice(0, 5);

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('reports')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Analytics, trends and performance reports</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select className="form-control" style={{ width: 80 }} value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
          <button className="btn btn-primary">
            📥 {t('export')} {exportFormat.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Report type tabs */}
      <div className="tab-bar" style={{ marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'daily', label: t('dailyReport') },
          { id: 'weekly', label: t('weeklyReport') },
          { id: 'monthly', label: t('monthlyReport') },
          { id: 'annual', label: t('annualReport') },
        ].map(tab => (
          <button key={tab.id} className={`tab-item${activeReport === tab.id ? ' active' : ''}`} onClick={() => setActiveReport(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="card" style={{ padding: '1rem', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>📅 Date Range:</span>
          <input type="date" className="form-control" style={{ width: 160 }} value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <input type="date" className="form-control" style={{ width: 160 }} value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} />
          <button className="btn btn-primary btn-sm">Apply</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setDateRange({ from: '', to: '' })}>Reset</button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4" style={{ gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Avg Worked Time', labelAm: 'ስራ ላይ የዋለ ሰዓት', value: '7.4h', icon: '✅', color: '#10b981' },
          { label: 'Avg Unworked Time', labelAm: 'የባከነ ሰዓት', value: '0.6h', icon: '⚠️', color: '#f59e0b' },
          { label: 'Avg Overtime', value: '1.1h', icon: '🔵', color: '#3b82f6' },
          { label: 'Avg Productivity', value: '92%', icon: '📈', color: getProductivityColor(92) },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card" style={{ borderLeft: `4px solid ${kpi.color}` }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{kpi.icon}</span>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{kpi.label}</div>
                {kpi.labelAm && (
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
                    {kpi.labelAm}
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">
              {activeReport === 'daily' ? 'Hourly Breakdown' :
               activeReport === 'weekly' ? 'Daily Hours This Week' :
               activeReport === 'monthly' ? 'Monthly Attendance Trend' :
               'Annual Productivity Trend'}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={activeReport === 'monthly' ? MONTHLY_ATTENDANCE : activeReport === 'annual' ? TREND_DATA : WEEKLY_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey={activeReport === 'monthly' ? 'month' : 'day'} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              {activeReport === 'monthly' ? (
                <>
                  <Bar dataKey="present" name="Present" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey="worked" name="ስራ ላይ የዋለ ሰዓት" fill="#2563EB" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="unworked" name="የባከነ ሰዓት" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar chart */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">Performance Overview</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Radar name="Score" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Productivity trend */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">📈 Productivity Trend</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis domain={[70, 110]} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="productivity" name="Productivity %" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department ranking */}
        <div className="chart-container">
          <div className="section-header">
            <div className="section-title">🏢 Department Rankings</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 210 }}>
            {DEPT_PERFORMANCE
              .sort((a, b) => b.productivity - a.productivity)
              .map((dept, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : 'var(--surface-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6875rem', fontWeight: 700, flexShrink: 0,
                    color: i < 3 ? '#0f172a' : 'var(--text-muted)',
                  }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{dept.dept}</span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: getProductivityColor(dept.productivity) }}>
                        {dept.productivity}%
                      </span>
                    </div>
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-fill" style={{ width: `${Math.min(dept.productivity, 100)}%`, background: getProductivityColor(dept.productivity) }} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Employee leaderboard */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700 }}>🏆 {t('performanceLeaderboard')}</h3>
          <span className="badge badge-info">Top 5</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee</th>
              <th>Dept</th>
              <th>ስራ ላይ የዋለ ሰዓት</th>
              <th>የባከነ ሰዓት</th>
              <th>Overtime</th>
              <th>Productivity</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {topEmployees.map((emp, i) => (
              <tr key={emp.id}>
                <td>
                  <span style={{
                    fontSize: '1.125rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28,
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{emp.initials}</div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</span>
                  </div>
                </td>
                <td><span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{emp.dept}</span></td>
                <td style={{ color: '#10b981', fontWeight: 600 }}>{formatHours(emp.workedHours)}h</td>
                <td style={{ color: emp.workedHours >= 8 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {formatHours(Math.max(0, 8 - emp.workedHours))}h
                </td>
                <td style={{ color: '#3b82f6', fontWeight: 600 }}>
                  {formatHours(Math.max(0, emp.workedHours - 8))}h
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 60, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(emp.productivity, 100)}%`, height: '100%', background: getProductivityColor(emp.productivity) }} />
                    </div>
                    <span style={{ fontWeight: 600, color: getProductivityColor(emp.productivity), fontSize: '0.875rem' }}>
                      {emp.productivity}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${emp.productivity >= 100 ? 'badge-info' : emp.productivity >= 90 ? 'badge-success' : 'badge-warning'}`}>
                    {emp.productivity >= 100 ? 'Excellent' : emp.productivity >= 90 ? 'Good' : 'Fair'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Insights box */}
      <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(7,137,48,0.05))', borderColor: 'rgba(37,99,235,0.2)' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>🤖</span>
          <div>
            <div style={{ fontWeight: 700 }}>{t('aiInsights')}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>AI-powered workforce recommendations</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { icon: '⏰', text: 'Average late arrivals peaked on Monday (34% of workforce)', severity: 'warning' },
            { icon: '📉', text: 'Finance dept shows highest የባከነ ሰዓት: avg 1.5h/day', severity: 'danger' },
            { icon: '⭐', text: 'Operations team exceeds 100% productivity consistently', severity: 'success' },
            { icon: '📊', text: 'Overall workforce utilization improved 8% this quarter', severity: 'info' },
          ].map((insight, i) => (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.icon}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
