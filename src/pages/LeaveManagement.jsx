import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LEAVE_REQUESTS } from '../data/mockData';

const LEAVE_TYPES = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Unpaid'];

export default function LeaveManagement() {
  const { t, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('requests');
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(LEAVE_REQUESTS);
  const [form, setForm] = useState({
    type: '', startDate: '', endDate: '', reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };
  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1;
    setRequests(prev => [...prev, {
      id: prev.length + 1,
      employee: currentUser?.name || 'Current User',
      dept: currentUser?.dept || 'Engineering',
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
      status: 'pending',
      applied: new Date().toISOString().split('T')[0],
    }]);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ type: '', startDate: '', endDate: '', reason: '' });
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
    const labels = { pending: t('pending'), approved: t('approved'), rejected: t('rejected') };
    return <span className={`badge ${map[status]}`}>{labels[status]}</span>;
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('leaves')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Submit and manage employee leave requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + {t('leaveRequest')}
        </button>
      </div>

      {submitted && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          ✅ Leave request submitted successfully! Awaiting approval.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4" style={{ gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Requests', value: stats.total, color: 'var(--primary)', icon: '📋' },
          { label: t('pending'), value: stats.pending, color: '#f59e0b', icon: '⏳' },
          { label: t('approved'), value: stats.approved, color: '#10b981', icon: '✅' },
          { label: t('rejected'), value: stats.rejected, color: '#ef4444', icon: '❌' },
        ].map((s, i) => (
          <div key={i} className="kpi-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tab-bar" style={{ marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'requests', label: 'All Requests' },
          { id: 'my', label: 'My Leaves' },
          { id: 'balance', label: 'Leave Balance' },
        ].map(tab => (
          <button key={tab.id} className={`tab-item${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'requests' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 600 }}>{req.employee}</td>
                  <td><span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>{req.dept}</span></td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>{req.type}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{req.startDate}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{req.endDate}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{req.days}d</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', maxWidth: 150 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {req.reason}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{req.applied}</td>
                  <td>{statusBadge(req.status)}</td>
                  <td>
                    {req.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-success btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleApprove(req.id)}>
                          ✓
                        </button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleReject(req.id)}>
                          ✕
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'my' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requests.filter(r => r.employee === (currentUser?.name || 'Abebe Girma')).length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p style={{ color: 'var(--text-muted)' }}>No leave requests yet</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>
                Submit Leave Request
              </button>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, flexShrink: 0,
                }}>
                  🌿
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{req.type} Leave</span>
                    {statusBadge(req.status)}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {req.startDate} → {req.endDate} · {req.days} days
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>{req.reason}</div>
                </div>
                <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Applied {req.applied}</div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'balance' && (
        <div className="grid grid-cols-2" style={{ gap: 16 }}>
          {[
            { type: 'Annual Leave', total: 20, used: 8, remaining: 12, color: '#2563EB' },
            { type: 'Sick Leave', total: 15, used: 3, remaining: 12, color: '#10b981' },
            { type: 'Maternity Leave', total: 90, used: 0, remaining: 90, color: '#7c3aed' },
            { type: 'Paternity Leave', total: 14, used: 0, remaining: 14, color: '#f59e0b' },
          ].map((leave, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 600 }}>{leave.type}</span>
                <span style={{ fontWeight: 700, color: leave.color }}>{leave.remaining} days left</span>
              </div>
              <div className="progress-bar" style={{ marginBottom: 8, height: 10 }}>
                <div className="progress-fill" style={{
                  width: `${(leave.used / leave.total) * 100}%`,
                  background: leave.color,
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{leave.used} used</span>
                <span>{leave.total} total</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave request modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.0625rem' }}>🌿 New Leave Request</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                  <option value="">Select type...</option>
                  {LEAVE_TYPES.map(lt => <option key={lt} value={lt}>{lt}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>

              {form.startDate && form.endDate && (
                <div className="alert alert-info" style={{ marginBottom: 12 }}>
                  📅 Duration: {Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1} days
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-control" rows={3} value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Please provide reason for leave request..."
                  required style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  📤 {t('submit')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
