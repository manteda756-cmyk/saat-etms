import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ETH_MONTHS, ETH_MONTHS_EN, ETH_DAYS, ETH_DAYS_EN,
  ETH_HOLIDAYS_2016, getCurrentEthDate, formatEthDate, gregToEth, ethToGreg
} from '../data/mockData';

function CalendarGrid({ year, month, lang }) {
  const today = getCurrentEthDate();
  const daysInMonth = month === 13 ? 5 : 30;
  const holidayDays = ETH_HOLIDAYS_2016.filter(h => h.month === month).map(h => h.day);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 8 }}>
        {(lang === 'am' ? ETH_DAYS : ETH_DAYS_EN).map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: '0.75rem', fontWeight: 600,
            color: 'var(--text-muted)', padding: '4px 0',
            fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit',
          }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isToday = today.year === year && today.month === month && today.day === day;
          const isHoliday = holidayDays.includes(day);
          return (
            <div
              key={day}
              className="cal-day"
              style={{
                background: isToday ? 'var(--primary)' : isHoliday ? 'rgba(7,137,48,0.12)' : 'transparent',
                color: isToday ? 'white' : isHoliday ? 'var(--et-green)' : 'var(--text-primary)',
                fontWeight: isToday || isHoliday ? 600 : 400,
                border: isHoliday && !isToday ? '1px solid var(--et-green)' : 'none',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EthiopianCalendar() {
  const { t, language } = useApp();
  const today = getCurrentEthDate();
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);
  const [activeTab, setActiveTab] = useState('calendar');
  const [convertFrom, setConvertFrom] = useState('greg');
  const [gregDate, setGregDate] = useState(new Date().toISOString().split('T')[0]);
  const [ethYear, setEthYear] = useState(today.year);
  const [ethMonth, setEthMonth] = useState(today.month);
  const [ethDay, setEthDay] = useState(today.day);
  const [convResult, setConvResult] = useState('');

  const monthName = language === 'am' ? ETH_MONTHS[viewMonth - 1] : ETH_MONTHS_EN[viewMonth - 1];

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(13); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 13) { setViewMonth(1); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleConvert = () => {
    if (convertFrom === 'greg') {
      const eth = gregToEth(new Date(gregDate));
      setConvResult(`${eth.day} ${language === 'am' ? ETH_MONTHS[eth.month - 1] : ETH_MONTHS_EN[eth.month - 1]} ${eth.year} EC`);
    } else {
      const greg = ethToGreg(ethYear, ethMonth, ethDay);
      setConvResult(greg.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }
  };

  return (
    <div className="page-content animate-fade-in">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>
          📅 {t('ethiopianCalendar')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {formatEthDate(today.year, today.month, today.day, language)} — Fiscal Year: {today.year}/{today.year + 1} EC
        </p>
      </div>

      <div className="tab-bar" style={{ marginBottom: 20, width: 'fit-content' }}>
        {[
          { id: 'calendar', label: t('ethiopianCalendar') },
          { id: 'convert', label: t('convert') },
          { id: 'holidays', label: t('publicHolidays') },
        ].map(tab => (
          <button key={tab.id} className={`tab-item${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <button className="btn btn-ghost btn-sm" onClick={prevMonth} style={{ fontSize: 18 }}>‹</button>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.25rem', fontWeight: 700,
                  fontFamily: language === 'am' ? "'Noto Sans Ethiopic', sans-serif" : 'inherit',
                }}>{monthName}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{viewYear} EC</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={nextMonth} style={{ fontSize: 18 }}>›</button>
            </div>

            <CalendarGrid year={viewYear} month={viewMonth} lang={language} />

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { color: 'var(--primary)', label: 'Today' },
                { color: 'var(--et-green)', label: 'Holiday', border: true },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: l.border ? 'transparent' : l.color,
                    border: l.border ? `2px solid ${l.color}` : 'none',
                  }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Month info sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Today's info */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.9375rem' }}>📆 Today</div>
              <div style={{
                background: 'linear-gradient(135deg, var(--et-green), #2563EB)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                color: 'white',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '3rem', fontWeight: 800, lineHeight: 1,
                  fontFamily: "'Noto Sans Ethiopic', sans-serif",
                }}>{today.day}</div>
                <div style={{
                  fontSize: '1rem', fontWeight: 600, marginTop: 4,
                  fontFamily: "'Noto Sans Ethiopic', sans-serif",
                }}>{ETH_MONTHS[today.month - 1]}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{today.year} EC</div>
              </div>
              <div style={{ textAlign: 'center', marginTop: 10, color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Fiscal year */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>💰 {t('fiscalYear')}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Start:</span> 1 Meskerem {today.year} EC
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>End:</span> 30 Nehase {today.year} EC
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Quarter:</span> Q{Math.ceil(today.month / 3)}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Year progress</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {Math.round(((today.month - 1) * 30 + today.day) / 365 * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.round(((today.month - 1) * 30 + today.day) / 365 * 100)}%`,
                    background: 'var(--et-green)',
                  }} />
                </div>
              </div>
            </div>

            {/* Months list */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Ethiopian Months</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ETH_MONTHS.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => { setViewMonth(i + 1); setActiveTab('calendar'); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '5px 8px', borderRadius: 6,
                      background: viewMonth === i + 1 ? 'rgba(37,99,235,0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer', width: '100%',
                      color: viewMonth === i + 1 ? 'var(--primary)' : 'var(--text-primary)',
                    }}
                  >
                    <span style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif", fontSize: '0.875rem' }}>{m}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ETH_MONTHS_EN[i]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'convert' && (
        <div style={{ maxWidth: 560 }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🔄 Date Converter (EC ↔ Gregorian)</h3>

            <div className="tab-bar" style={{ marginBottom: 20, width: '100%' }}>
              <button
                className={`tab-item${convertFrom === 'greg' ? ' active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setConvertFrom('greg')}
              >
                Gregorian → EC
              </button>
              <button
                className={`tab-item${convertFrom === 'eth' ? ' active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setConvertFrom('eth')}
              >
                EC → Gregorian
              </button>
            </div>

            {convertFrom === 'greg' ? (
              <div className="form-group">
                <label className="form-label">Gregorian Date</label>
                <input
                  type="date" value={gregDate}
                  onChange={e => setGregDate(e.target.value)}
                  className="form-control"
                />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Year (EC)</label>
                  <input type="number" value={ethYear} onChange={e => setEthYear(parseInt(e.target.value))} className="form-control" min={1} max={9999} />
                </div>
                <div className="form-group">
                  <label className="form-label">Month</label>
                  <select value={ethMonth} onChange={e => setEthMonth(parseInt(e.target.value))} className="form-control">
                    {ETH_MONTHS.map((m, i) => (
                      <option key={i} value={i + 1}>{i + 1}. {m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Day</label>
                  <input type="number" value={ethDay} onChange={e => setEthDay(parseInt(e.target.value))} className="form-control" min={1} max={30} />
                </div>
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleConvert}>
              🔄 {t('convert')}
            </button>

            {convResult && (
              <div className="alert alert-success" style={{ marginTop: 16 }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Converted Date:</div>
                  <div style={{ fontSize: '1.125rem', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{convResult}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'holidays' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 700 }}>🎉 Ethiopian Public Holidays {today.year} EC</h3>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ethiopian Date</th>
                  <th>Amharic Name</th>
                  <th>English Name</th>
                  <th>Gregorian Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {ETH_HOLIDAYS_2016.map((h, i) => {
                  const greg = ethToGreg(today.year, h.month, h.day);
                  return (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>
                        {h.day} {ETH_MONTHS[h.month - 1]}
                      </td>
                      <td style={{ fontFamily: "'Noto Sans Ethiopic', sans-serif" }}>{h.name.split('/')[0].trim()}</td>
                      <td>{h.nameEn}</td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {greg.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td><span className="badge badge-success">Public</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
