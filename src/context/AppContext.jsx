import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentProfile, signOut as sbSignOut } from '../lib/auth';
import { getNotifications, markNotificationsRead } from '../lib/db';

const AppContext = createContext();

export const translations = {
  en: {
    dashboard: 'Dashboard', attendance: 'Attendance', reports: 'Reports',
    employees: 'Employees', settings: 'Settings', calendar: 'Calendar',
    leaves: 'Leave Management', manager: 'Manager Dashboard', logout: 'Logout',
    profile: 'Profile', todayOverview: "Today's Overview", totalEmployees: 'Total Employees',
    presentToday: 'Present Today', lateArrivals: 'Late Arrivals', absentToday: 'Absent Today',
    hoursWorkedToday: 'Hours Worked Today', workedTime: 'Worked Time', unworkedTime: 'Unworked Time',
    overtime: 'Overtime', productivity: 'Productivity', attendanceStatus: 'Attendance Status',
    startTime: 'Start Time', endTime: 'End Time', breakTime: 'Break Time',
    taskDescription: 'Task Description', department: 'Department', project: 'Project',
    submit: 'Submit', cancel: 'Cancel', save: 'Save', complete: 'Complete',
    incomplete: 'Incomplete', present: 'Present', absent: 'Absent', late: 'Late',
    onLeave: 'On Leave', search: 'Search', filter: 'Filter', export: 'Export',
    download: 'Download', viewAll: 'View All', loading: 'Loading...', noData: 'No data available',
    name: 'Name', position: 'Position', status: 'Status', action: 'Action', date: 'Date',
    time: 'Time', hours: 'hours', minutes: 'minutes', leaveRequest: 'Leave Request',
    approve: 'Approve', reject: 'Reject', pending: 'Pending', approved: 'Approved',
    rejected: 'Rejected', darkMode: 'Dark Mode', lightMode: 'Light Mode', language: 'Language',
    notifications: 'Notifications', monthlyReport: 'Monthly Report', weeklyReport: 'Weekly Report',
    dailyReport: 'Daily Report', annualReport: 'Annual Report', employeeDirectory: 'Employee Directory',
    performanceLeaderboard: 'Performance Leaderboard', aiInsights: 'AI Insights',
    welcomeBack: 'Welcome back', goodMorning: 'Good Morning', goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening', trackTime: 'Track Time', myAttendance: 'My Attendance',
    myLeaves: 'My Leaves', teamPerformance: 'Team Performance', departmentReport: 'Department Report',
    overtimeApproval: 'Overtime Approval', enterStartTime: 'Enter start time',
    enterEndTime: 'Enter end time', enterBreakTime: 'Enter break time (minutes)',
    describeTask: 'Describe your tasks today...', selectDept: 'Select Department',
    selectProject: 'Select Project', logAttendance: 'Log Attendance', remainingHours: 'Remaining Hours',
    ethiopianCalendar: 'Ethiopian Calendar', gregorianCalendar: 'Gregorian Calendar',
    convert: 'Convert', publicHolidays: 'Public Holidays', fiscalYear: 'Fiscal Year',
    myTimesheet: 'My Timesheet', downloadPDF: 'Download PDF', downloadExcel: 'Download Excel',
    heroTitle: 'Ethiopian Workforce Management',
    heroSubtitle: 'Track time, manage attendance, and boost productivity with Ethiopian Calendar support',
    getStarted: 'Get Started Free', learnMore: 'Learn More',
    featuresTitle: 'Everything you need to manage your workforce',
    pricingTitle: 'Simple, transparent pricing', testimonialsTitle: 'Trusted by Ethiopian companies',
    contactTitle: 'Get in touch', signIn: 'Sign In', signUp: 'Sign Up', email: 'Email',
    password: 'Password', rememberMe: 'Remember me', forgotPassword: 'Forgot password?',
    aiRecommendations: 'AI Recommendations', frequentLateArrivals: 'Frequent Late Arrivals',
    excessiveUnworkedTime: 'Excessive Unworked Time', highPerformer: 'High Performer',
    overtimeTrend: 'Overtime Trend', workforceUtilization: 'Workforce Utilization',
    signingIn: 'Signing in...', creatingAccount: 'Creating account...',
    connectionError: 'Connection error. Running in offline mode.',
  },
  am: {
    dashboard: 'ዳሽቦርድ', attendance: 'የተገኝነት መዝገብ', reports: 'ሪፖርቶች',
    employees: 'ሰራተኞች', settings: 'ቅንብሮች', calendar: 'ቀን መቁጠሪያ',
    leaves: 'የፈቃድ አስተዳደር', manager: 'የስራ አስኪያጅ ዳሽቦርድ', logout: 'ውጣ',
    profile: 'መገለጫ', todayOverview: 'የዛሬ ሁኔታ', totalEmployees: 'ጠቅላላ ሰራተኞች',
    presentToday: 'ዛሬ የተገኙ', lateArrivals: 'ዘግይተው የደረሱ', absentToday: 'ዛሬ የሌሉ',
    hoursWorkedToday: 'ዛሬ የሰሩ ሰዓቶች', workedTime: 'ስራ ላይ የዋለ ሰዓት',
    unworkedTime: 'የባከነ ሰዓት', overtime: 'ትርፍ ሰዓት', productivity: 'ምርታማነት',
    attendanceStatus: 'የተገኝነት ሁኔታ', startTime: 'የመጀመሪያ ሰዓት', endTime: 'የማጠናቀቂያ ሰዓት',
    breakTime: 'የዕረፍት ጊዜ', taskDescription: 'የስራ መግለጫ', department: 'ክፍል',
    project: 'ፕሮጀክት', submit: 'ላክ', cancel: 'ሰርዝ', save: 'አስቀምጥ',
    complete: 'ተጠናቋል', incomplete: 'አልተጠናቀቀም', present: 'ተገኝቷል',
    absent: 'አልተገኘም', late: 'ዘግይቷል', onLeave: 'በፈቃድ ላይ', search: 'ፈልግ',
    filter: 'አጣራ', export: 'ወደ ውጭ ላክ', download: 'አውርድ', viewAll: 'ሁሉን ይዩ',
    loading: 'በመጫን ላይ...', noData: 'ምንም መረጃ የለም', name: 'ስም', position: 'ቦታ',
    status: 'ሁኔታ', action: 'እርምጃ', date: 'ቀን', time: 'ሰዓት', hours: 'ሰዓቶች',
    minutes: 'ደቂቃዎች', leaveRequest: 'የፈቃድ ጥያቄ', approve: 'አጽድቅ',
    reject: 'ውድቅ አድርግ', pending: 'በመጠባበቅ ላይ', approved: 'ጸድቋል',
    rejected: 'ውድቅ ሆኗል', darkMode: 'ጨለማ ሁነታ', lightMode: 'ብርሃን ሁነታ',
    language: 'ቋንቋ', notifications: 'ማሳወቂያዎች', monthlyReport: 'ወርሃዊ ሪፖርት',
    weeklyReport: 'ሳምንታዊ ሪፖርት', dailyReport: 'ዕለታዊ ሪፖርት', annualReport: 'ዓመታዊ ሪፖርት',
    employeeDirectory: 'የሰራተኞች ማውጫ', performanceLeaderboard: 'የአፈጻጸም ደረጃ ሰሌዳ',
    aiInsights: 'AI ትንታኔ', welcomeBack: 'እንኳን ተመለሱ', goodMorning: 'እንደምን አደሩ',
    goodAfternoon: 'እንደምን ዋሉ', goodEvening: 'እንደምን አመሹ', trackTime: 'ሰዓት ይቆጥሩ',
    myAttendance: 'የእኔ ተገኝነት', myLeaves: 'የእኔ ፈቃዶች', teamPerformance: 'የቡድን አፈጻጸም',
    departmentReport: 'የክፍል ሪፖርት', overtimeApproval: 'የትርፍ ሰዓት ፈቃድ',
    enterStartTime: 'የመጀመሪያ ሰዓት ያስገቡ', enterEndTime: 'የማጠናቀቂያ ሰዓት ያስገቡ',
    enterBreakTime: 'የዕረፍት ጊዜ ያስገቡ (ደቂቃ)', describeTask: 'ዛሬ ያከናወኗቸውን ስራዎች ይግለጹ...',
    selectDept: 'ክፍል ይምረጡ', selectProject: 'ፕሮጀክት ይምረጡ', logAttendance: 'ተገኝነት ይመዝግቡ',
    remainingHours: 'ቀሪ ሰዓቶች', ethiopianCalendar: 'የኢትዮጵያ ቀን መቁጠሪያ',
    gregorianCalendar: 'ዘመናዊ ቀን መቁጠሪያ', convert: 'ቀይር', publicHolidays: 'የህዝብ በዓላት',
    fiscalYear: 'የበጀት ዓመት', myTimesheet: 'የእኔ ሰዓት ሰሌዳ', downloadPDF: 'PDF አውርድ',
    downloadExcel: 'Excel አውርድ', heroTitle: 'የኢትዮጵያ የሰራተኞች አስተዳደር',
    heroSubtitle: 'የኢትዮጵያ ቀን መቁጠሪያ ድጋፍ ባለው ስርዓት ሰዓት ይቆጥሩ',
    getStarted: 'ይጀምሩ', learnMore: 'ተጨማሪ ይወቁ',
    featuresTitle: 'ሰራተኞችን ለማስተዳደር የሚያስፈልጉ ሁሉም ነገሮች',
    pricingTitle: 'ቀላልና ግልጽ ዋጋ', testimonialsTitle: 'በኢትዮጵያ ኩባንያዎች የሚታመን',
    contactTitle: 'ያግኙን', signIn: 'ግባ', signUp: 'ተመዝገብ', email: 'ኢሜይል',
    password: 'የሚስጥር ቁጥር', rememberMe: 'አስታውሰኝ', forgotPassword: 'የሚስጥር ቁጥሩን ረሱ?',
    aiRecommendations: 'AI ምክሮች', frequentLateArrivals: 'ተደጋጋሚ ዘግይቶ መምጣት',
    excessiveUnworkedTime: 'ከፍተኛ የባከነ ሰዓት', highPerformer: 'ከፍተኛ አፈጻጸም',
    overtimeTrend: 'የትርፍ ሰዓት አዝማሚያ', workforceUtilization: 'የሰራተኞች አጠቃቀም',
    signingIn: 'በመግባት ላይ...', creatingAccount: 'መለያ በመፍጠር ላይ...',
    connectionError: 'የግንኙነት ስህተት። ከሱፕርቤዝ ጋር ያልተገናኘ።',
  },
  or: {
    dashboard: 'Daashboordii', attendance: 'Argamuu', reports: 'Gabaasota',
    employees: 'Hojjettoota', settings: "Qindaa'ina", calendar: 'Kaalaandarii',
    leaves: 'Bulchiinsa Ayyaana', manager: 'Daashboordii Bulchaa', logout: "Ba'i",
    profile: 'Profaayilii', todayOverview: "Guyyaa Har'aa", totalEmployees: 'Hojjettoota Waliigalaa',
    presentToday: "Har'aa Argaman", lateArrivals: 'Yeroo Gara Dhuufan',
    absentToday: "Har'aa Hin Argamne", hoursWorkedToday: "Sa'aatii Har'aa Hojjetan",
    workedTime: "Sa'aatii Hojii Irra Oole", unworkedTime: "Sa'aatii Badiifame",
    overtime: 'Yeroo Dabalataa', productivity: 'Omishummaa', attendanceStatus: 'Haala Argamuu',
    startTime: 'Yeroo Eegaluu', endTime: 'Yeroo Xumuruuf', breakTime: 'Yeroo Boqonnaa',
    taskDescription: 'Ibsa Hojii', department: 'Kutaa', project: 'Pirojektii',
    submit: 'Ergi', cancel: 'Haqi', save: "Ol Kaa'i", complete: 'Xumurameera',
    incomplete: 'Hin Xumuramin', present: 'Argameera', absent: 'Hin Argamne',
    late: 'Yeroo Gara Dhufee', onLeave: 'Ayyaana Irra', search: 'Barbaadi',
    filter: 'Caalbaasi', export: 'Ergaa Ergi', download: 'Buusi', viewAll: 'Hunda Ilaali',
    loading: "Fe'aa Jira...", noData: 'Deetaa Hin Jiru', name: 'Maqaa', position: 'Gosa Hojii',
    status: 'Haala', action: 'Gocha', date: 'Guyyaa', time: "Sa'aatii", hours: "sa'aatii",
    minutes: 'daqiiqaa', leaveRequest: 'Gaaffii Ayyaanaa', approve: 'Hayyami', reject: 'Dhowwi',
    pending: 'Eegaa Jira', approved: 'Hayyamameera', rejected: 'Dhowwameera',
    darkMode: 'Gurraacha Haalaa', lightMode: 'Ifaa Haalaa', language: 'Afaan',
    notifications: 'Beeksisa', monthlyReport: "Gabaasa Ji'aa", weeklyReport: 'Gabaasa Torban',
    dailyReport: 'Gabaasa Guyyaa', annualReport: 'Gabaasa Waggaa',
    employeeDirectory: 'Galmee Hojjettoota', performanceLeaderboard: 'Sadarkaa Raawwii',
    aiInsights: 'Yaada AI', welcomeBack: 'Baga Deebittan', goodMorning: 'Akkam Bultee',
    goodAfternoon: 'Akkam Ooltee', goodEvening: 'Akkam Galtee', trackTime: "Sa'aatii Hordofi",
    myAttendance: 'Argamuu Koo', myLeaves: 'Ayyaana Koo', teamPerformance: 'Raawwii Garee',
    departmentReport: 'Gabaasa Kutaa', overtimeApproval: 'Hayyama Yeroo Dabalataa',
    enterStartTime: 'Yeroo Eegaluu Galchi', enterEndTime: 'Yeroo Xumuruuf Galchi',
    enterBreakTime: 'Yeroo Boqonnaa Galchi (Daqiiqaa)', describeTask: "Har'aa hojii raawwatte ibsi...",
    selectDept: 'Kutaa Filadhu', selectProject: 'Pirojektii Filadhu', logAttendance: 'Argamuu Galmeessi',
    remainingHours: "Sa'aatii Hafe", ethiopianCalendar: 'Kaalaandarii Itoophiyaa',
    gregorianCalendar: 'Kaalaandarii Greegooriyaan', convert: 'Jijjiiri',
    publicHolidays: 'Ayyaana Ummataa', fiscalYear: 'Waggaa Maallaqa',
    myTimesheet: "Sa'aatii Gabatee Koo", downloadPDF: 'PDF Buusi', downloadExcel: 'Excel Buusi',
    heroTitle: 'Bulchiinsa Hojjettoota Itoophiyaa',
    heroSubtitle: "Sa'aatii hordofi, argamuu bulchi Kaalaandarii Itoophiyaan",
    getStarted: 'Jalqabi', learnMore: 'Dabalataan Baradhu',
    featuresTitle: 'Hojjettoota Bulchuuf Waan Hundumaa',
    pricingTitle: 'Gatii Salphaa fi Ifaa', testimonialsTitle: 'Dhaabbilee Itoophiyaatiin Amanamee',
    contactTitle: 'Nu Quunnamaa', signIn: 'Seeni', signUp: "Galmaa'i", email: 'Imeelii',
    password: 'Jecha Darbii', rememberMe: 'Na Yaadadhu', forgotPassword: 'Jecha Darbii Irranfattee?',
    aiRecommendations: 'Gorsa AI', frequentLateArrivals: 'Yeroo Gara Dhufuu Deddeebii',
    excessiveUnworkedTime: "Sa'aatii Badiifame Baay'ee", highPerformer: "Raawwii Ol'aanaa",
    overtimeTrend: 'Aadaa Yeroo Dabalataa', workforceUtilization: 'Fayyadama Hojjettoota',
    signingIn: 'Seenaa Jira...', creatingAccount: "Galmaa'aa Jira...",
    connectionError: 'Dogoggora Walquunnamtii.',
  },
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('etms_lang') || 'en');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('etms_dark') === 'true');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [supabaseReady, setSupabaseReady] = useState(false);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  // Persist language
  useEffect(() => { localStorage.setItem('etms_lang', language); }, [language]);

  // Dark mode
  useEffect(() => {
    localStorage.setItem('etms_dark', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Supabase auth listener
  useEffect(() => {
    let notifSubscription = null;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const profile = await getCurrentProfile();
            if (profile) {
              setCurrentUser({
                id: session.user.id,
                name: profile.full_name,
                email: profile.email,
                role: profile.role,
                dept: profile.department,
                position: profile.position,
                language: profile.language,
              });
              setSupabaseReady(true);

              // Sync language from profile
              if (profile.language && profile.language !== language) {
                setLanguage(profile.language);
              }

              // Load notifications
              try {
                const notifs = await getNotifications(session.user.id);
                setNotifications(notifs?.map(n => ({
                  id: n.id,
                  type: n.type,
                  message: n.message,
                  time: new Date(n.created_at).toRelativeTimeString
                    ? new Date(n.created_at).toLocaleTimeString()
                    : new Date(n.created_at).toLocaleDateString(),
                  read: n.is_read,
                })) || []);
              } catch {
                // notifications table may not exist yet — use defaults
                setNotifications([
                  { id: 1, type: 'info', message: 'Connected to Supabase ✅', time: 'Just now', read: false },
                ]);
              }
            }
          } catch (err) {
            console.warn('Profile fetch failed:', err.message);
            // Fall back to auth user data
            setCurrentUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'employee',
              dept: session.user.user_metadata?.department || '',
            });
          }
        } else {
          setCurrentUser(null);
          setNotifications([]);
        }
        setAuthLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      notifSubscription?.unsubscribe();
    };
  }, []);

  const login = (user) => setCurrentUser(user); // for offline/demo mode

  const logout = async () => {
    try {
      await sbSignOut();
    } catch {
      // offline fallback
    }
    setCurrentUser(null);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (currentUser?.id) {
      try { await markNotificationsRead(currentUser.id); } catch { /* offline */ }
    }
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, t,
      darkMode, setDarkMode,
      currentUser, setCurrentUser, login, logout,
      authLoading, supabaseReady,
      sidebarCollapsed, setSidebarCollapsed,
      mobileSidebarOpen, setMobileSidebarOpen,
      notifications, setNotifications, unreadCount, markAllRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
