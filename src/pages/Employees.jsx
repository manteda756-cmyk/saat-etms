import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EMPLOYEES, DEPARTMENTS, formatHours, getProductivityColor } from '../data/mockData';

export default function Employees() {
  const { t, language } = useApp();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selected, setSelected] = useState(null);

  const filtered = EMPLOYEES.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.dept.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || emp.dept === deptFilter;
    const matchStatus = !statusFilter || emp.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const statusBadge = (status) => {
    const map = {
      present: 'badge-success',
      late: 'badge-warning',
      absent: 'badge-danger',
      leave: 'badge-info',
    };
    const labels = { present: t('present'), late: t('late'), absent: t('absent'), leave: t('onLeave') };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{labels[status] || status}</span>;
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('employeeDirectory')}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {filtered.length} of {EMPLOYEES.length} employees
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            className="form-control" style={{ paddingLeft: 36 }}
            placeholder={t('search') + ' employees...'}
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-control" style={{ flex: '0 0 160px' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="form-control" style={{ flex: '0 0 140px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="present">{t('present')}</option>
          <option value="late">{t('late')}</option>
          <option value="absent">{t('absent')}</option>
          <option value="leave">{t('onLeave')}</option>
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          {['table', 'card'].map(mode => (
            <button
              key={mode}
              className={`btn btn-sm ${viewMode === mode ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode(mode)}
            >
              {mode === 'table' ? '☰' : '⊞'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4" style={{ gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Present', value: EMPLOYEES.filter(e => e.status === 'present').length, color: '#10b981', icon: '✅' },
          { label: 'Late', value: EMPLOYEES.filter(e => e.status === 'late').length, color: '#f59e0b', icon: '⏰' },
          { label: 'Absent', value: EMPLOYEES.filter(e => e.status === 'absent').length, color: '#ef4444', icon: '❌' },
          { label: 'On Leave', value: EMPLOYEES.filter(e => e.status === 'leave').length, color: '#3b82f6', icon: '🌿' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'table' ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>ስራ ላይ የዋለ ሰዓት</th>
                <th>የባከነ ሰዓት</th>
                <th>Productivity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(emp)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{emp.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{emp.dept}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{emp.position}</td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>{formatHours(emp.workedHours)}h</td>
                  <td style={{ fontWeight: 600, color: emp.workedHours >= 8 ? '#10b981' : '#ef4444' }}>
                    {formatHours(Math.max(0, 8 - emp.workedHours))}h
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(emp.productivity, 100)}%`, height: '100%',
                          background: getProductivityColor(emp.productivity),
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: getProductivityColor(emp.productivity) }}>
                        {emp.productivity}%
                      </span>
                    </div>
                  </td>
                  <td>{statusBadge(emp.status)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setSelected(emp); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3" style={{ gap: 16 }}>
          {filtered.map(emp => (
            <div
              key={emp.id}
              className="card card-interactive"
              style={{ padding: '1.25rem', cursor: 'pointer' }}
              onClick={() => setSelected(emp)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{emp.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{emp.position}</div>
                  <div style={{ marginTop: 4 }}>{statusBadge(emp.status)}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>ስራ ላይ</div>
                    <div style={{ fontWeight: 700, color: '#10b981' }}>{formatHours(emp.workedHours)}h</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>የባከነ</div>
                    <div style={{ fontWeight: 700, color: emp.workedHours >= 8 ? '#10b981' : '#ef4444' }}>
                      {formatHours(Math.max(0, 8 - emp.workedHours))}h
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Productivity</span>
                    <span style={{ fontWeight: 600, color: getProductivityColor(emp.productivity) }}>{emp.productivity}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${Math.min(emp.productivity, 100)}%`,
                      background: getProductivityColor(emp.productivity),
                    }} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{emp.dept}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 20 }}>{selected.initials}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selected.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{selected.position}</p>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  {statusBadge(selected.status)}
                  <span className="badge badge-gray">{selected.dept}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Worked Time', labelAm: 'ስራ ላይ የዋለ ሰዓት', value: `${formatHours(selected.workedHours)}h`, color: '#10b981', icon: '✅' },
                { label: 'Unworked Time', labelAm: 'የባከነ ሰዓት', value: `${formatHours(Math.max(0, 8 - selected.workedHours))}h`, color: selected.workedHours >= 8 ? '#10b981' : '#ef4444', icon: '⚠️' },
                { label: 'Productivity', labelAm: 'ምርታማነት', value: `${selected.productivity}%`, color: getProductivityColor(selected.productivity), icon: '📈' },
                { label: 'Late Count', labelAm: 'ዘግይቶ መምጣት', value: selected.lateCount, color: selected.lateCount === 0 ? '#10b981' : '#f59e0b', icon: '⏰' },
              ].map((m, i) => (
                <div key={i} className="card" style={{ padding: '0.875rem', borderLeft: `3px solid ${m.color}` }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span>{m.icon}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{m.labelAm}</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', marginBottom: 16 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Contact</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>📧 {selected.email}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: 4 }}>🏢 {selected.dept}</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View Full Profile</button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View Attendance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
