import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS, calcTimeMetrics, formatHours, getStatusColor } from '../data/mockData';

function TimeMetricCard({ label, labelAm, value, icon, color }) {
  return (
    <div className="kpi-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{labelAm}</div>
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

// Empty state component
function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: '0.875rem' }}>{subtitle}</div>
    </div>
  );
}

export default function Attendance() {
  const { t } = useApp();
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '',
    breakMinutes: 60,
    department: '',
    task: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('log');
  // Attendance records stored locally until Supabase is fully wired per-user
  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (updated.startTime && updated.endTime) {
        const m = calcTimeMetrics(updated.startTime, updated.endTime, parseInt(updated.breakMinutes) || 0);
        setMetrics(m);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.endTime || !form.startTime) return;
    const m = calcTimeMetrics(form.startTime, form.endTime, parseInt(form.breakMinutes) || 0);
    setMetrics(m);
    // Save record locally
    setRecords(prev => [{
      id: Date.now(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      breakMinutes: parseInt(form.breakMinutes) || 60,
      department: form.department,
      task: form.task,
      workedHours: m.workedHours,
      unworkedHours: m.unworkedHours,
      overtimeHours: m.overtimeHours,
      productivity: m.productivity,
      status: m.status,
    }, ...prev]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const statusConfig = {
    'complete':          { label: t('complete'),             color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅' },
    'overtime':          { label: t('overtime'),             color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: '🔵' },
    'incomplete':        { label: t('incomplete'),           color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⚠️' },
    'incomplete-severe': { label: 'Significant Shortage',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '❌' },
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('attendance')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Track your daily working hours and productivity
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{ marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'log',       label: t('logAttendance') },
          { id: 'history',   label: t('myAttendance')  },
          { id: 'timesheet', label: t('myTimesheet')   },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-item${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── LOG TAB ── */}
      {activeTab === 'log' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Form */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⏰ {t('logAttendance')}
            </h3>

            {submitted && (
              <div className="alert alert-success" style={{ marginBottom: 16 }}>
                ✅ Attendance logged successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Date */}
              <div className="form-group">
                <label className="form-label">{t('date')}</label>
                <input
                  type="date" name="date" value={form.date}
                  onChange={handleChange} className="form-control"
                />
              </div>

              {/* Start / End time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">{t('startTime')}</label>
                  <input
                    type="time" name="startTime" value={form.startTime}
                    onChange={handleChange} className="form-control" required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('endTime')}</label>
                  <input
                    type="time" name="endTime" value={form.endTime}
                    onChange={handleChange} className="form-control" required
                  />
                </div>
              </div>

              {/* Break */}
              <div className="form-group">
                <label className="form-label">{t('breakTime')} (minutes)</label>
                <input
                  type="number" name="breakMinutes" value={form.breakMinutes}
                  onChange={handleChange} className="form-control"
                  min={0} max={240} placeholder="60"
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">{t('department')}</label>
                <select name="department" value={form.department} onChange={handleChange} className="form-control">
                  <option value="">{t('selectDept')}</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Task description */}
              <div className="form-group">
                <label className="form-label">{t('taskDescription')}</label>
                <textarea
                  name="task" value={form.task} onChange={handleChange}
                  className="form-control" rows={3}
                  placeholder={t('describeTask')}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                📤 {t('logAttendance')}
              </button>
            </form>
          </div>

          {/* Live metrics panel */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📊 Time Summary</h3>

            {metrics ? (
              <>
                {/* Status banner */}
                {statusConfig[metrics.status] && (
                  <div style={{
                    padding: '14px 16px', borderRadius: 'var(--radius)',
                    background: statusConfig[metrics.status].bg,
                    border: `1px solid ${statusConfig[metrics.status].color}40`,
                    marginBottom: 16,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ fontSize: 24 }}>{statusConfig[metrics.status].icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: statusConfig[metrics.status].color }}>
                        {statusConfig[metrics.status].label}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {metrics.productivity}% productivity
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: '1.5rem', fontWeight: 800, color: statusConfig[metrics.status].color }}>
                      {formatHours(metrics.workedHours)}h
                    </div>
                  </div>
                )}

                {/* 4 metric cards */}
                <div className="grid grid-cols-2" style={{ gap: 12, marginBottom: 16 }}>
                  <TimeMetricCard
                    label="Worked Time" labelAm="ስራ ላይ የዋለ ሰዓት"
                    value={`${formatHours(metrics.workedHours)}h`}
                    icon="✅" color="#10b981"
                  />
                  <TimeMetricCard
                    label="Unworked Time" labelAm="የባከነ ሰዓት"
                    value={`${formatHours(metrics.unworkedHours)}h`}
                    icon="⚠️"
                    color={metrics.unworkedHours === 0 ? '#10b981' : metrics.unworkedHours < 1 ? '#f59e0b' : '#ef4444'}
                  />
                  <TimeMetricCard
                    label="Overtime" labelAm="ትርፍ ሰዓት"
                    value={`${formatHours(metrics.overtimeHours)}h`}
                    icon="🔵" color="#3b82f6"
                  />
                  <TimeMetricCard
                    label="Productivity" labelAm="ምርታማነት"
                    value={`${metrics.productivity}%`}
                    icon="📈"
                    color={
                      metrics.productivity >= 100 ? '#3b82f6' :
                      metrics.productivity >= 90  ? '#10b981' :
                      metrics.productivity >= 75  ? '#f59e0b' : '#ef4444'
                    }
                  />
                </div>

                {/* Progress bar */}
                <div className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Daily Progress</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {formatHours(metrics.workedHours)}h / 8h
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 12 }}>
                    <div className="progress-fill" style={{
                      width: `${Math.min(metrics.productivity, 100)}%`,
                      background: `linear-gradient(90deg, ${getStatusColor(metrics.status)}, ${getStatusColor(metrics.status)}aa)`,
                    }} />
                  </div>
                  {metrics.workedHours < 8 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: 6 }}>
                      ⚠️ {formatHours(8 - metrics.workedHours)}h remaining to complete standard hours
                    </div>
                  )}
                  {metrics.overtimeHours > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: 6 }}>
                      🔵 {formatHours(metrics.overtimeHours)}h overtime — approval may be required
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
                <p style={{ color: 'var(--text-muted)' }}>Enter start and end times to see your time summary</p>
                <div style={{ marginTop: 16, padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif", color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 2 }}>
                    ✅ ስራ ላይ የዋለ ሰዓት: —<br />
                    ⚠️ የባከነ ሰዓት: —<br />
                    📈 Productivity: —
                  </div>
                </div>
              </div>
            )}

            {/* Rules */}
            <div className="card" style={{ padding: '1rem', marginTop: 16 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 10 }}>📋 Work Hour Rules</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: '🟢', color: '#10b981', label: 'Complete: 8+ hours worked' },
                  { icon: '🟡', color: '#f59e0b', label: 'Incomplete: 6–7.9 hours worked' },
                  { icon: '🔴', color: '#ef4444', label: 'Significant shortage: < 6 hours' },
                  { icon: '🔵', color: '#3b82f6', label: 'Overtime: > 8 hours worked' },
                ].map((rule, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{rule.icon}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === 'history' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 700 }}>Attendance History</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm">📥 {t('downloadPDF')}</button>
              <button className="btn btn-secondary btn-sm">📊 {t('downloadExcel')}</button>
            </div>
          </div>

          {records.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No attendance records yet"
              subtitle="Start logging attendance from Monday — records will appear here"
            />
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>{t('date')}</th>
                    <th>{t('startTime')}</th>
                    <th>{t('endTime')}</th>
                    <th>Break</th>
                    <th>{t('department')}</th>
                    <th>ስራ ላይ የዋለ ሰዓት</th>
                    <th>የባከነ ሰዓት</th>
                    <th>Productivity</th>
                    <th>{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(rec => (
                    <tr key={rec.id}>
                      <td style={{ fontWeight: 500 }}>{rec.date}</td>
                      <td>{rec.startTime}</td>
                      <td>{rec.endTime}</td>
                      <td>{rec.breakMinutes}m</td>
                      <td>
                        <span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>
                          {rec.department || '—'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#10b981' }}>{formatHours(rec.workedHours)}h</td>
                      <td style={{ fontWeight: 600, color: rec.workedHours >= 8 ? '#10b981' : '#ef4444' }}>
                        {formatHours(rec.unworkedHours)}h
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(rec.productivity, 100)}%`, height: '100%', background: getStatusColor(rec.status) }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{rec.productivity}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${rec.status === 'complete' || rec.status === 'overtime' ? 'success' : 'warning'}`}>
                          {rec.status === 'overtime' ? 'Overtime' : rec.status === 'complete' ? t('complete') : t('incomplete')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TIMESHEET TAB ── */}
      {activeTab === 'timesheet' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700 }}>
              Monthly Timesheet — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm">📥 {t('downloadPDF')}</button>
              <button className="btn btn-secondary btn-sm">📊 {t('downloadExcel')}</button>
            </div>
          </div>

          {records.length === 0 ? (
            <EmptyState
              icon="🗓️"
              title="Timesheet is empty"
              subtitle="Attendance data logged from Monday onward will populate your monthly timesheet"
            />
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-4" style={{ gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Days Logged',   value: records.length,                                                  icon: '📅', color: '#2563EB' },
                  { label: 'Total Worked',  value: `${formatHours(records.reduce((s, r) => s + r.workedHours, 0))}h`, icon: '✅', color: '#10b981' },
                  { label: 'Total Overtime',value: `${formatHours(records.reduce((s, r) => s + r.overtimeHours, 0))}h`,icon: '🔵', color: '#3b82f6' },
                  { label: 'Avg Productivity', value: `${Math.round(records.reduce((s, r) => s + r.productivity, 0) / records.length)}%`, icon: '📈', color: '#7c3aed' },
                ].map((item, i) => (
                  <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center', borderTop: `3px solid ${item.color}` }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>{t('date')}</th>
                      <th>{t('department')}</th>
                      <th>ስራ ላይ የዋለ ሰዓት</th>
                      <th>የባከነ ሰዓት</th>
                      <th>Overtime</th>
                      <th>Productivity</th>
                      <th>{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(rec => (
                      <tr key={rec.id}>
                        <td style={{ fontWeight: 600 }}>{rec.date}</td>
                        <td><span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{rec.department || '—'}</span></td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>{formatHours(rec.workedHours)}h</td>
                        <td style={{ color: rec.unworkedHours === 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>{formatHours(rec.unworkedHours)}h</td>
                        <td style={{ color: '#3b82f6', fontWeight: 500 }}>{formatHours(rec.overtimeHours)}h</td>
                        <td style={{ fontWeight: 700, color: rec.productivity >= 100 ? '#3b82f6' : rec.productivity >= 90 ? '#10b981' : '#f59e0b' }}>
                          {rec.productivity}%
                        </td>
                        <td>
                          <span className={`badge badge-${rec.status === 'complete' || rec.status === 'overtime' ? 'success' : 'warning'}`}>
                            {rec.status === 'overtime' ? 'Overtime' : rec.status === 'complete' ? t('complete') : t('incomplete')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
