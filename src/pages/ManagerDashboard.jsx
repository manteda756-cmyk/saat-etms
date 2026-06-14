import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { EMPLOYEES, DEPT_PERFORMANCE, LEAVE_REQUESTS, AI_INSIGHTS, formatHours, getProductivityColor } from '../data/mockData';

const OVERTIME_DATA = [
  { dept: 'Engineering', hours: 24 },
  { dept: 'Operations', hours: 18 },
  { dept: 'Marketing', hours: 12 },
  { dept: 'Finance', hours: 8 },
  { dept: 'IT', hours: 15 },
  { dept: 'Sales', hours: 10 },
];

const TREND_WEEKS = [
  { week: 'W1', engineering: 94, marketing: 88, finance: 82 },
  { week: 'W2', engineering: 96, marketing: 91, finance: 85 },
  { week: 'W3', engineering: 92, marketing: 89, finance: 80 },
  { week: 'W4', engineering: 98, marketing: 94, finance: 87 },
];

export default function ManagerDashboard() {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [approvals, setApprovals] = useState(
    EMPLOYEES.filter(e => e.workedHours > 8).map(e => ({
      ...e, overtimeHours: (e.workedHours - 8).toFixed(1), approved: null
    }))
  );

  const handleOT = (id, val) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, approved: val } : a));
  };

  const teamMetrics = {
    avgProductivity: Math.round(EMPLOYEES.filter(e => e.workedHours > 0).reduce((s, e) => s + e.productivity, 0) / EMPLOYEES.filter(e => e.workedHours > 0).length),
    totalWorked: EMPLOYEES.reduce((s, e) => s + e.workedHours, 0),
    totalOvertime: EMPLOYEES.filter(e => e.workedHours > 8).reduce((s, e) => s + (e.workedHours - 8), 0),
    totalUnworked: EMPLOYEES.filter(e => e.workedHours > 0 && e.workedHours < 8).reduce((s, e) => s + (8 - e.workedHours), 0),
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('manager')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Team analytics, approvals and performance oversight</p>
      </div>

      <div className="tab-bar" style={{ marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'team', label: t('teamPerformance') },
          { id: 'overtime', label: t('overtimeApproval') },
          { id: 'insights', label: t('aiInsights') },
        ].map(tab => (
          <button key={tab.id} className={`tab-item${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Team KPIs */}
          <div className="grid grid-cols-4" style={{ gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Team Avg Productivity', labelAm: 'ምርታማነት', value: `${teamMetrics.avgProductivity}%`, icon: '📈', color: getProductivityColor(teamMetrics.avgProductivity) },
              { label: 'Total ስራ ላይ', value: `${formatHours(teamMetrics.totalWorked)}h`, icon: '✅', color: '#10b981' },
              { label: 'Total Overtime', value: `${formatHours(teamMetrics.totalOvertime)}h`, icon: '🔵', color: '#3b82f6' },
              { label: 'Total የባከነ ሰዓት', value: `${formatHours(teamMetrics.totalUnworked)}h`, icon: '⚠️', color: '#f59e0b' },
            ].map((kpi, i) => (
              <div key={i} className="kpi-card" style={{ borderTop: `3px solid ${kpi.color}` }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{kpi.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{kpi.label}</div>
                    {kpi.labelAm && <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{kpi.labelAm}</div>}
                  </div>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Dept performance */}
            <div className="chart-container">
              <div className="section-header">
                <div className="section-title">🏢 Dept Productivity Today</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DEPT_PERFORMANCE} layout="vertical" barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <YAxis type="category" dataKey="dept" width={80} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Bar dataKey="productivity" name="Productivity %" radius={[0, 4, 4, 0]}
                    fill="#2563EB"
                    label={{ position: 'right', fontSize: 11, fill: 'var(--text-secondary)', formatter: v => `${v}%` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly dept trend */}
            <div className="chart-container">
              <div className="section-header">
                <div className="section-title">📊 Weekly Dept Trend</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={TREND_WEEKS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis domain={[70, 110]} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Line type="monotone" dataKey="engineering" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="marketing" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="finance" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance alerts */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div className="section-header">
              <div className="section-title">🚨 Attention Required</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EMPLOYEES.filter(e => e.status === 'late' || e.status === 'absent' || (e.workedHours < 6 && e.workedHours > 0)).map(emp => (
                <div key={emp.id} style={{
                  padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                  background: emp.status === 'absent' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                  border: `1px solid ${emp.status === 'absent' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{emp.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.dept} · {emp.position}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: emp.status === 'absent' ? 'var(--danger)' : 'var(--warning)' }}>
                      {emp.status === 'absent' ? '❌ Absent' : emp.status === 'late' ? '⏰ Late Arrival' : '⚠️ Low Hours'}
                    </div>
                    {emp.workedHours > 0 && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {formatHours(emp.workedHours)}h worked · {formatHours(Math.max(0, 8 - emp.workedHours))}h missing
                      </div>
                    )}
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Contact</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'team' && (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Dept</th>
                  <th>ስራ ላይ የዋለ ሰዓት</th>
                  <th>የባከነ ሰዓት</th>
                  <th>Overtime</th>
                  <th>Productivity</th>
                  <th>Status</th>
                  <th>Late Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {EMPLOYEES.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{emp.initials}</div>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{emp.dept}</span></td>
                    <td style={{ fontWeight: 600, color: '#10b981' }}>{formatHours(emp.workedHours)}h</td>
                    <td style={{ fontWeight: 600, color: emp.workedHours >= 8 ? '#10b981' : '#ef4444' }}>
                      {formatHours(Math.max(0, 8 - emp.workedHours))}h
                    </td>
                    <td style={{ color: '#3b82f6', fontWeight: 500 }}>
                      {formatHours(Math.max(0, emp.workedHours - 8))}h
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: getProductivityColor(emp.productivity) }}>
                        {emp.productivity}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${emp.status === 'present' ? 'success' : emp.status === 'late' ? 'warning' : emp.status === 'absent' ? 'danger' : 'info'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${emp.lateCount === 0 ? 'badge-success' : emp.lateCount < 3 ? 'badge-warning' : 'badge-danger'}`}>
                        {emp.lateCount}x
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'overtime' && (
        <div>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 18 }}>ℹ️</span>
            <span>Overtime approval is required for all employees exceeding 8 hours/day.</span>
          </div>

          {approvals.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <p style={{ color: 'var(--text-muted)' }}>No overtime approvals pending</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {approvals.map(emp => (
                <div key={emp.id} className="card" style={{
                  padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 16,
                  borderLeft: `4px solid ${emp.approved === null ? '#f59e0b' : emp.approved ? '#10b981' : '#ef4444'}`,
                }}>
                  <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>{emp.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{emp.dept}</div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: '0.8125rem', color: '#3b82f6', fontWeight: 600 }}>
                        🔵 {emp.overtimeHours}h overtime
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                        (Total: {formatHours(emp.workedHours)}h)
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {emp.approved === null ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleOT(emp.id, true)}>
                          ✓ {t('approve')}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleOT(emp.id, false)}>
                          ✕ {t('reject')}
                        </button>
                      </div>
                    ) : (
                      <span className={`badge ${emp.approved ? 'badge-success' : 'badge-danger'}`}>
                        {emp.approved ? '✓ Approved' : '✕ Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Overtime chart */}
          <div className="chart-container" style={{ marginTop: 20 }}>
            <div className="section-header">
              <div className="section-title">📊 Overtime by Department This Month</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={OVERTIME_DATA} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dept" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="hours" name="Overtime Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AI_INSIGHTS.map((insight, i) => (
            <div key={i} className="card" style={{
              padding: '1.25rem',
              borderLeft: `4px solid ${
                insight.type === 'success' ? '#10b981' :
                insight.type === 'warning' ? '#f59e0b' :
                insight.type === 'danger' ? '#ef4444' : '#3b82f6'
              }`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{insight.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                      {language === 'am' ? insight.titleAm : insight.title}
                    </h4>
                    <span className={`badge badge-${insight.priority === 'high' ? 'danger' : insight.priority === 'medium' ? 'warning' : 'success'}`}>
                      {insight.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
                    {language === 'am' ? insight.descAm : insight.description}
                  </p>
                  {language === 'am' && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif", marginBottom: 8 }}>
                      {insight.descAm}
                    </p>
                  )}
                  <button className="btn btn-primary btn-sm">{insight.action}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
