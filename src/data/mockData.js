// ─────────────────────────────────────────────────────────────
// Ethiopian Calendar Constants
// ─────────────────────────────────────────────────────────────
export const ETH_MONTHS = [
  'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሃምሌ', 'ነሃሴ', 'ጳጉሜ'
];

export const ETH_MONTHS_EN = [
  'Meskerem', 'Tikimit', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miyazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

export const ETH_DAYS    = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሓሙስ', 'ዓርብ', 'ቅዳሜ'];
export const ETH_DAYS_EN = ['Sun',  'Mon', 'Tue',   'Wed',  'Thu',  'Fri', 'Sat'];

// ─────────────────────────────────────────────────────────────
// Ethiopian ↔ Gregorian conversion
// Verified: June 14 2026 → Sene 7 2018 EC
//           Sep 11 2024  → Meskerem 1 2017 EC
// ─────────────────────────────────────────────────────────────
export function gregToEth(gregDate) {
  const d  = new Date(gregDate);
  const gy = d.getFullYear();
  const gm = d.getMonth() + 1;
  const gd = d.getDate();

  const a   = Math.floor((14 - gm) / 12);
  const y   = gy + 4800 - a;
  const m   = gm + 12 * a - 3;
  const jdn = gd
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;

  const ETH_EPOCH = 1723856;
  const r        = (jdn - ETH_EPOCH) % 1461;
  const n        = r % 365 + 365 * Math.floor(r / 1460);
  const ethYear  = 4 * Math.floor((jdn - ETH_EPOCH) / 1461)
                 + Math.floor(r / 365)
                 - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay   = (n % 30) + 1;

  return {
    year:  ethYear,
    month: Math.min(ethMonth, 13),
    day:   Math.min(ethDay, 30),
  };
}

export function ethToGreg(year, month, day) {
  const ETH_EPOCH = 1723856;
  const jdn = ETH_EPOCH
    + 365 * (year - 1)
    + Math.floor(year / 4)
    + 30 * (month - 1)
    + day
    - 1;

  const a  = jdn + 32044;
  const b  = Math.floor((4 * a + 3) / 146097);
  const c  = a - Math.floor((146097 * b) / 4);
  const dd = Math.floor((4 * c + 3) / 1461);
  const e  = c - Math.floor((1461 * dd) / 4);
  const mm = Math.floor((5 * e + 2) / 153);

  const gd = e - Math.floor((153 * mm + 2) / 5) + 1;
  const gm = mm + 3 - 12 * Math.floor(mm / 10);
  const gy = 100 * b + dd - 4800 + Math.floor(mm / 10);

  return new Date(gy, gm - 1, gd);
}

export function getCurrentEthDate() {
  return gregToEth(new Date());
}

export function formatEthDate(year, month, day, lang = 'am') {
  if (lang === 'en') return `${day} ${ETH_MONTHS_EN[month - 1]} ${year}`;
  return `${day} ${ETH_MONTHS[month - 1]} ${year}`;
}

// ─────────────────────────────────────────────────────────────
// Ethiopian Government Fiscal Year: Hamle 1 → Sene 30
// Current FY: Hamle 1, 2017 – Sene 30, 2018 EC
// ─────────────────────────────────────────────────────────────
export function getEthFiscalYear(ethDate) {
  const fyStart = ethDate.month >= 11 ? ethDate.year : ethDate.year - 1;
  const fyEnd   = fyStart + 1;
  return {
    startYear:    fyStart,
    endYear:      fyEnd,
    startLabel:   `Hamle 1, ${fyStart} EC`,
    endLabel:     `Sene 30, ${fyEnd} EC`,
    startLabelAm: `ሃምሌ 1፣ ${fyStart} ዓ.ም`,
    endLabelAm:   `ሰኔ 30፣ ${fyEnd} ዓ.ም`,
    display:      `${fyStart}/${fyEnd} EC`,
  };
}

export function getFiscalYearProgress(ethDate) {
  let monthsElapsed;
  if (ethDate.month >= 11) {
    monthsElapsed = ethDate.month - 11;
  } else {
    monthsElapsed = ethDate.month + 2;
  }
  const daysElapsed = monthsElapsed * 30 + ethDate.day;
  return Math.min(Math.round((daysElapsed / 360) * 100), 100);
}

// ─────────────────────────────────────────────────────────────
// Ethiopian Public Holidays 2018 EC
// ─────────────────────────────────────────────────────────────
export const ETH_HOLIDAYS_2016 = [
  { month: 1,  day: 1,  name: 'እንቁጣጣሽ',           nameEn: 'Ethiopian New Year' },
  { month: 1,  day: 17, name: 'መስቀል',              nameEn: 'Finding of the True Cross' },
  { month: 3,  day: 29, name: 'ገና',                nameEn: 'Ethiopian Christmas' },
  { month: 4,  day: 11, name: 'ጥምቀት',              nameEn: 'Ethiopian Epiphany' },
  { month: 8,  day: 1,  name: 'አድዋ',               nameEn: 'Adwa Victory Day' },
  { month: 8,  day: 23, name: 'ፋሲካ',               nameEn: 'Ethiopian Easter' },
  { month: 9,  day: 1,  name: 'አርበኞች ቀን',          nameEn: 'Patriots Day' },
  { month: 9,  day: 2,  name: 'ዓለም አቀፍ የሰራተኞች ቀን', nameEn: 'International Labour Day' },
  { month: 10, day: 26, name: 'ኢድ አል አድሃ',         nameEn: 'Eid Al-Adha' },
];

// ─────────────────────────────────────────────────────────────
// Departments  (no Projects — removed per requirement)
// ─────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Finance', 'HR',
  'Operations', 'Sales', 'IT', 'Peace and Security',
];

// ─────────────────────────────────────────────────────────────
// EMPTY DATA — real data will come from Supabase starting Monday
// ─────────────────────────────────────────────────────────────
export const EMPLOYEES         = [];
export const ATTENDANCE_RECORDS = [];
export const LEAVE_REQUESTS    = [];
export const MONTHLY_ATTENDANCE = [];
export const WEEKLY_HOURS      = [];
export const DEPT_PERFORMANCE  = [];
export const AI_INSIGHTS       = [];

// ─────────────────────────────────────────────────────────────
// Time calculation utilities
// ─────────────────────────────────────────────────────────────
export function calcTimeMetrics(startTime, endTime, breakMinutes) {
  if (!startTime || !endTime) return null;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const totalMins  = (eh * 60 + em) - (sh * 60 + sm) - (breakMinutes || 0);
  const workedHours = totalMins / 60;
  const unworkedHours  = Math.max(0, 8 - workedHours);
  const overtimeHours  = Math.max(0, workedHours - 8);
  const productivity   = Math.round((workedHours / 8) * 100);
  let status = 'complete';
  if (workedHours < 6)  status = 'incomplete-severe';
  else if (workedHours < 8) status = 'incomplete';
  else if (workedHours > 8) status = 'overtime';
  return {
    workedHours:    parseFloat(workedHours.toFixed(2)),
    unworkedHours:  parseFloat(unworkedHours.toFixed(2)),
    overtimeHours:  parseFloat(overtimeHours.toFixed(2)),
    productivity,
    status,
    totalMinutes: totalMins,
  };
}

export function formatHours(h) {
  if (!h || h <= 0) return '0:00';
  const hrs  = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}:${mins.toString().padStart(2, '0')}`;
}

export function getStatusColor(status) {
  if (status === 'overtime')          return '#3b82f6';
  if (status === 'complete')          return '#10b981';
  if (status === 'incomplete')        return '#f59e0b';
  if (status === 'incomplete-severe') return '#ef4444';
  return '#94a3b8';
}

export function getProductivityColor(pct) {
  if (pct >= 100) return '#3b82f6';
  if (pct >= 90)  return '#10b981';
  if (pct >= 75)  return '#f59e0b';
  return '#ef4444';
}

export function greetingByTime(t) {
  const h = new Date().getHours();
  if (h < 12) return t('goodMorning');
  if (h < 17) return t('goodAfternoon');
  return t('goodEvening');
}

// Heatmap stub — returns empty until real data loads
export function generateHeatmapData() {
  return [];
}
