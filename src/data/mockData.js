// Ethiopian Calendar utilities
export const ETH_MONTHS = [
  'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሃምሌ', 'ነሃሴ', 'ጳጉሜ'
];

export const ETH_MONTHS_EN = [
  'Meskerem', 'Tikimit', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miyazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

export const ETH_DAYS = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሓሙስ', 'ዓርብ', 'ቅዳሜ'];
export const ETH_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Convert Gregorian to Ethiopian
export function gregToEth(gregDate) {
  const d = new Date(gregDate);
  const jdn = Math.floor((d.getFullYear() - 1) * 365.25) + Math.floor((d.getMonth() + 1 - 1) * 30.6) + d.getDate() + 1721013;
  const r = (jdn - 1723856) % 1461;
  const n = r % 365 + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = n % 30 + 1;
  return { year, month: Math.min(month, 13), day: Math.min(day, 30) };
}

export function ethToGreg(year, month, day) {
  const jdn = 1723856 + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
  const l = jdn + 68569;
  const n = Math.floor(4 * l / 146097);
  const ll = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor(4000 * (ll + 1) / 1461001);
  const lll = ll - Math.floor(1461 * i / 4) + 31;
  const j = Math.floor(80 * lll / 2447);
  const d = lll - Math.floor(2447 * j / 80);
  const m = j + 2 - 12 * Math.floor(j / 11);
  const y = 100 * (n - 49) + i + Math.floor(j / 11);
  return new Date(y, m - 1, d);
}

export function getCurrentEthDate() {
  return gregToEth(new Date());
}

export function formatEthDate(year, month, day, lang = 'am') {
  if (lang === 'en') {
    return `${day} ${ETH_MONTHS_EN[month - 1]} ${year}`;
  }
  return `${day} ${ETH_MONTHS[month - 1]} ${year}`;
}

// Ethiopian public holidays 2016 (EC)
export const ETH_HOLIDAYS_2016 = [
  { month: 1, day: 1, name: 'እንቁጣጣሽ / Enkutatash', nameEn: 'Ethiopian New Year' },
  { month: 1, day: 17, name: 'መስቀል / Meskel', nameEn: 'Finding of the True Cross' },
  { month: 3, day: 29, name: 'ገና / Genna', nameEn: 'Ethiopian Christmas' },
  { month: 4, day: 11, name: 'ጥምቀት / Timkat', nameEn: 'Ethiopian Epiphany' },
  { month: 8, day: 1, name: 'አድዋ / Adwa', nameEn: 'Adwa Victory Day' },
  { month: 8, day: 23, name: 'ፋሲካ / Fasika', nameEn: 'Ethiopian Easter' },
  { month: 9, day: 1, name: 'አርበኞች ቀን', nameEn: 'Patriots Day' },
  { month: 9, day: 2, name: 'ዓለም አቀፍ የሰራተኞች ቀን', nameEn: 'International Labour Day' },
  { month: 10, day: 26, name: 'ደርሶ ምላሽ', nameEn: 'Eid Al-Adha' },
];

// Departments
export const DEPARTMENTS = [
  'Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'IT', 'Legal'
];

// Projects
export const PROJECTS = [
  'Project Alpha', 'Project Beta', 'Infrastructure', 'Client Portal', 'Mobile App', 'Data Pipeline', 'ERP Migration'
];

// Mock employees
export const EMPLOYEES = [
  { id: 1, name: 'Abebe Girma', nameAm: 'አበበ ግርማ', email: 'abebe@company.et', dept: 'Engineering', position: 'Software Engineer', avatar: null, initials: 'AG', status: 'present', workedHours: 7.5, productivity: 94, lateCount: 1, role: 'employee' },
  { id: 2, name: 'Sara Tesfaye', nameAm: 'ሳራ ተስፋዬ', email: 'sara@company.et', dept: 'Marketing', position: 'Marketing Manager', avatar: null, initials: 'ST', status: 'present', workedHours: 8.5, productivity: 106, lateCount: 0, role: 'manager' },
  { id: 3, name: 'Kebede Alemu', nameAm: 'ከበደ አለሙ', email: 'kebede@company.et', dept: 'Finance', position: 'Financial Analyst', avatar: null, initials: 'KA', status: 'late', workedHours: 5.0, productivity: 62, lateCount: 3, role: 'employee' },
  { id: 4, name: 'Tigist Haile', nameAm: 'ትግስት ኃይሌ', email: 'tigist@company.et', dept: 'HR', position: 'HR Specialist', avatar: null, initials: 'TH', status: 'present', workedHours: 8.0, productivity: 100, lateCount: 0, role: 'employee' },
  { id: 5, name: 'Dawit Bekele', nameAm: 'ዳዊት በቀለ', email: 'dawit@company.et', dept: 'IT', position: 'Systems Admin', avatar: null, initials: 'DB', status: 'absent', workedHours: 0, productivity: 0, lateCount: 2, role: 'employee' },
  { id: 6, name: 'Hana Mekonnen', nameAm: 'ሃና መኮንን', email: 'hana@company.et', dept: 'Operations', position: 'Operations Lead', avatar: null, initials: 'HM', status: 'present', workedHours: 9.25, productivity: 115, lateCount: 0, role: 'manager' },
  { id: 7, name: 'Yonas Tadesse', nameAm: 'ዮናስ ታደሰ', email: 'yonas@company.et', dept: 'Sales', position: 'Sales Executive', avatar: null, initials: 'YT', status: 'present', workedHours: 7.75, productivity: 97, lateCount: 1, role: 'employee' },
  { id: 8, name: 'Meron Bekele', nameAm: 'ሜሮን በቀለ', email: 'meron@company.et', dept: 'Engineering', position: 'Frontend Developer', avatar: null, initials: 'MB', status: 'leave', workedHours: 0, productivity: 0, lateCount: 0, role: 'employee' },
  { id: 9, name: 'Biruk Assefa', nameAm: 'ብሩክ አሰፋ', email: 'biruk@company.et', dept: 'Legal', position: 'Legal Counsel', avatar: null, initials: 'BA', status: 'present', workedHours: 8.0, productivity: 100, lateCount: 0, role: 'employee' },
  { id: 10, name: 'Selamawit Girma', nameAm: 'ሰላማዊት ግርማ', email: 'selam@company.et', dept: 'Engineering', position: 'Backend Developer', avatar: null, initials: 'SG', status: 'present', workedHours: 10.5, productivity: 131, lateCount: 0, role: 'employee' },
];

// Mock attendance records
export const ATTENDANCE_RECORDS = Array.from({ length: 30 }, (_, i) => {
  const start = 8 + (Math.random() > 0.7 ? Math.random() * 1.5 : 0);
  const breakMins = 30 + Math.floor(Math.random() * 30);
  const end = start + 8 + (Math.random() > 0.6 ? Math.random() * 2 - 0.5 : 0);
  const worked = end - start - breakMins / 60;
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    id: i + 1,
    date: date.toISOString().split('T')[0],
    startTime: `${Math.floor(start).toString().padStart(2, '0')}:${Math.floor((start % 1) * 60).toString().padStart(2, '0')}`,
    endTime: `${Math.floor(end).toString().padStart(2, '0')}:${Math.floor((end % 1) * 60).toString().padStart(2, '0')}`,
    breakMinutes: breakMins,
    workedHours: parseFloat(worked.toFixed(2)),
    status: worked >= 8 ? (worked > 8 ? 'overtime' : 'complete') : (worked >= 6 ? 'incomplete' : 'absent'),
    productivity: Math.min(Math.round((worked / 8) * 100), 150),
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
    project: PROJECTS[Math.floor(Math.random() * PROJECTS.length)],
    task: 'Worked on assigned tasks and deliverables for the day',
  };
});

// Monthly chart data
export const MONTHLY_ATTENDANCE = [
  { month: 'Mes', present: 22, absent: 3, late: 4, overtime: 8 },
  { month: 'Tik', present: 21, absent: 4, late: 5, overtime: 6 },
  { month: 'Hid', present: 23, absent: 2, late: 3, overtime: 10 },
  { month: 'Tah', present: 20, absent: 5, late: 6, overtime: 7 },
  { month: 'Tir', present: 22, absent: 3, late: 4, overtime: 9 },
  { month: 'Yek', present: 24, absent: 1, late: 2, overtime: 12 },
];

// Weekly hours data
export const WEEKLY_HOURS = [
  { day: 'Mon', worked: 7.5, target: 8, overtime: 0 },
  { day: 'Tue', worked: 8.5, target: 8, overtime: 0.5 },
  { day: 'Wed', worked: 6.0, target: 8, overtime: 0 },
  { day: 'Thu', worked: 9.0, target: 8, overtime: 1.0 },
  { day: 'Fri', worked: 8.0, target: 8, overtime: 0 },
  { day: 'Sat', worked: 4.0, target: 8, overtime: 0 },
];

// Department performance
export const DEPT_PERFORMANCE = [
  { dept: 'Engineering', productivity: 98, present: 12, total: 14 },
  { dept: 'Marketing', productivity: 94, present: 8, total: 9 },
  { dept: 'Finance', productivity: 87, present: 7, total: 8 },
  { dept: 'HR', productivity: 96, present: 5, total: 5 },
  { dept: 'Operations', productivity: 102, present: 10, total: 11 },
  { dept: 'Sales', productivity: 91, present: 9, total: 10 },
  { dept: 'IT', productivity: 89, present: 6, total: 7 },
  { dept: 'Legal', productivity: 95, present: 4, total: 4 },
];

// Leave requests
export const LEAVE_REQUESTS = [
  { id: 1, employee: 'Abebe Girma', dept: 'Engineering', type: 'Annual', startDate: '2024-02-15', endDate: '2024-02-19', days: 5, reason: 'Family vacation', status: 'pending', applied: '2024-02-10' },
  { id: 2, employee: 'Kebede Alemu', dept: 'Finance', type: 'Sick', startDate: '2024-02-12', endDate: '2024-02-13', days: 2, reason: 'Medical appointment', status: 'approved', applied: '2024-02-11' },
  { id: 3, employee: 'Tigist Haile', dept: 'HR', type: 'Maternity', startDate: '2024-03-01', endDate: '2024-05-31', days: 90, reason: 'Maternity leave', status: 'approved', applied: '2024-02-01' },
  { id: 4, employee: 'Yonas Tadesse', dept: 'Sales', type: 'Annual', startDate: '2024-02-20', endDate: '2024-02-22', days: 3, reason: 'Personal', status: 'rejected', applied: '2024-02-14' },
  { id: 5, employee: 'Dawit Bekele', dept: 'IT', type: 'Sick', startDate: '2024-02-14', endDate: '2024-02-14', days: 1, reason: 'Feeling unwell', status: 'pending', applied: '2024-02-14' },
];

// AI insights
export const AI_INSIGHTS = [
  { type: 'warning', icon: '⏰', title: 'Frequent Late Arrivals', titleAm: 'ተደጋጋሚ ዘግይቶ መምጣት', description: 'Kebede Alemu has been late 3 times this week. Consider a performance review.', descAm: 'ከበደ አለሙ ሳምንቱ ውስጥ 3 ጊዜ ዘግይቷል', action: 'Schedule Review', priority: 'high' },
  { type: 'danger', icon: '📉', title: 'High Unworked Time', titleAm: 'ከፍተኛ የባከነ ሰዓት', description: 'Finance dept averages 1.5 hrs of unworked time daily this month.', descAm: 'የፋይናንስ ክፍል ዕለት ዕለት 1.5 ሰዓት ያባክናል', action: 'View Details', priority: 'high' },
  { type: 'success', icon: '⭐', title: 'Top Performers', titleAm: 'ከፍተኛ አፈጻጸም', description: 'Selamawit Girma and Hana Mekonnen exceeded 100% productivity this month.', descAm: 'ሰላማዊት ግርማ እና ሃና መኮንን 100%+ ምርታማነት አሳይተዋል', action: 'Recognize', priority: 'low' },
  { type: 'info', icon: '📈', title: 'Overtime Trend', titleAm: 'የትርፍ ሰዓት አዝማሚያ', description: 'Engineering dept overtime increased 20% this month. Consider resource allocation.', descAm: 'የኢንጅነሪንግ ክፍል ትርፍ ሰዓት 20% ጨምሯል', action: 'Analyze', priority: 'medium' },
  { type: 'warning', icon: '🎯', title: 'Workforce Utilization', titleAm: 'የሰራተኞች አጠቃቀም', description: 'Overall workforce utilization is at 87%. Target is 95%.', descAm: 'አጠቃላይ የሰራተኞች አጠቃቀም 87% ነው። ዒላማ 95%', action: 'Improve Plan', priority: 'medium' },
];

// Heatmap data (last 3 months, daily attendance %)
export function generateHeatmapData() {
  const data = [];
  for (let i = 84; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // skip Sunday
    const pct = dayOfWeek === 6 ? Math.random() * 30 : 60 + Math.random() * 40;
    data.push({
      date: d.toISOString().split('T')[0],
      value: Math.round(pct),
      dayOfWeek,
    });
  }
  return data;
}

// Calculate time metrics
export function calcTimeMetrics(startTime, endTime, breakMinutes) {
  if (!startTime || !endTime) return null;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const totalMins = (eh * 60 + em) - (sh * 60 + sm) - (breakMinutes || 0);
  const workedHours = totalMins / 60;
  const standardHours = 8;
  const unworkedHours = Math.max(0, standardHours - workedHours);
  const overtimeHours = Math.max(0, workedHours - standardHours);
  const productivity = Math.round((workedHours / standardHours) * 100);
  let status = 'complete';
  if (workedHours < 6) status = 'incomplete-severe';
  else if (workedHours < 8) status = 'incomplete';
  else if (workedHours > 8) status = 'overtime';
  return {
    workedHours: parseFloat(workedHours.toFixed(2)),
    unworkedHours: parseFloat(unworkedHours.toFixed(2)),
    overtimeHours: parseFloat(overtimeHours.toFixed(2)),
    productivity,
    status,
    totalMinutes: totalMins,
  };
}

export function formatHours(h) {
  if (h <= 0) return '0:00';
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs}:${mins.toString().padStart(2, '0')}`;
}

export function getStatusColor(status) {
  if (status === 'overtime') return '#3b82f6';
  if (status === 'complete') return '#10b981';
  if (status === 'incomplete') return '#f59e0b';
  if (status === 'incomplete-severe') return '#ef4444';
  return '#94a3b8';
}

export function getProductivityColor(pct) {
  if (pct >= 100) return '#3b82f6';
  if (pct >= 90) return '#10b981';
  if (pct >= 75) return '#f59e0b';
  return '#ef4444';
}

export function greetingByTime(t) {
  const h = new Date().getHours();
  if (h < 12) return t('goodMorning');
  if (h < 17) return t('goodAfternoon');
  return t('goodEvening');
}
