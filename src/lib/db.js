import { supabase } from './supabase';

// ─────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────

export async function logAttendance({
  userId, date, startTime, endTime, breakMinutes,
  taskDescription, department, project,
  isLate, ethYear, ethMonth, ethDay,
}) {
  const { data, error } = await supabase
    .from('attendance')
    .upsert({
      user_id: userId,
      date,
      start_time: startTime,
      end_time: endTime || null,
      break_minutes: breakMinutes || 60,
      task_description: taskDescription,
      department,
      project,
      is_late: isLate || false,
      eth_year: ethYear,
      eth_month: ethMonth,
      eth_day: ethDay,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,date' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyAttendance(userId, limit = 30) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getTodayAttendance(userId) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAllAttendanceToday() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('attendance')
    .select('*, profiles(full_name, department, position, avatar_url)')
    .eq('date', today);

  if (error) throw error;
  return data;
}

export async function getAttendanceByDateRange(userId, from, to) {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

export async function approveOvertime(attendanceId, approved, reviewerId) {
  const { data, error } = await supabase
    .from('attendance')
    .update({ overtime_approved: approved })
    .eq('id', attendanceId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────
// EMPLOYEES / PROFILES
// ─────────────────────────────────────────────

export async function getAllEmployees() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .order('full_name');

  if (error) throw error;
  return data;
}

export async function getEmployeeProductivity() {
  const { data, error } = await supabase
    .from('employee_productivity')
    .select('*')
    .order('avg_productivity', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name');

  if (error) throw error;
  return data?.map(d => d.name) || [];
}

// ─────────────────────────────────────────────
// LEAVE REQUESTS
// ─────────────────────────────────────────────

export async function submitLeaveRequest({ userId, leaveType, startDate, endDate, reason }) {
  const { data, error } = await supabase
    .from('leave_requests')
    .insert({
      user_id: userId,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyLeaveRequests(userId) {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllLeaveRequests() {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*, profiles(full_name, department)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateLeaveStatus(leaveId, status, reviewerId, reviewNote) {
  const { data, error } = await supabase
    .from('leave_requests')
    .update({
      status,
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      review_note: reviewNote,
    })
    .eq('id', leaveId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

export async function markNotificationsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw error;
}

// ─────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────

export async function getDashboardStats() {
  const today = new Date().toISOString().split('T')[0];

  const [profilesRes, attendanceRes, leavesRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('attendance').select('*').eq('date', today),
    supabase.from('leave_requests').select('*').eq('status', 'approved')
      .lte('start_date', today).gte('end_date', today),
  ]);

  const totalEmployees = profilesRes.count || 0;
  const todayAttendance = attendanceRes.data || [];
  const onLeave = leavesRes.data?.length || 0;

  const presentCount = todayAttendance.filter(a =>
    ['complete', 'overtime', 'in_progress'].includes(a.status)
  ).length;
  const lateCount = todayAttendance.filter(a => a.is_late).length;
  const totalWorkedHours = todayAttendance.reduce((s, a) => s + (a.worked_hours || 0), 0);
  const avgProductivity = todayAttendance.length > 0
    ? Math.round(todayAttendance.reduce((s, a) => s + (a.productivity_pct || 0), 0) / todayAttendance.length)
    : 0;

  return {
    totalEmployees,
    presentCount,
    lateCount,
    absentCount: totalEmployees - presentCount - onLeave,
    onLeave,
    totalWorkedHours: parseFloat(totalWorkedHours.toFixed(2)),
    avgProductivity,
    todayAttendance,
  };
}

// Real-time subscription helpers
export function subscribeToAttendance(date, callback) {
  return supabase
    .channel(`attendance-${date}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'attendance',
      filter: `date=eq.${date}`,
    }, callback)
    .subscribe();
}

export function subscribeToNotifications(userId, callback) {
  return supabase
    .channel(`notifications-${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, callback)
    .subscribe();
}
