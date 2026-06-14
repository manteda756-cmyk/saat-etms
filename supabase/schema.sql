-- ================================================
-- ሰዓት ETMS — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------
-- PROFILES (extends Supabase auth.users)
-- ------------------------------------------------
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  full_name    text not null,
  email        text unique not null,
  phone        text,
  department   text,
  position     text,
  role         text default 'employee' check (role in ('employee', 'manager', 'admin')),
  avatar_url   text,
  language     text default 'en' check (language in ('en', 'am', 'or')),
  is_active    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ------------------------------------------------
-- DEPARTMENTS
-- ------------------------------------------------
create table if not exists public.departments (
  id          uuid default uuid_generate_v4() primary key,
  name        text unique not null,
  manager_id  uuid references public.profiles(id),
  created_at  timestamptz default now()
);

insert into public.departments (name) values
  ('Engineering'), ('Marketing'), ('Finance'),
  ('HR'), ('Operations'), ('Sales'), ('IT'), ('Peace and Security')
on conflict (name) do nothing;

-- ------------------------------------------------
-- PROJECTS
-- ------------------------------------------------
create table if not exists public.projects (
  id           uuid default uuid_generate_v4() primary key,
  name         text not null,
  department_id uuid references public.departments(id),
  is_active    boolean default true,
  created_at   timestamptz default now()
);

insert into public.projects (name) values
  ('Project Alpha'), ('Project Beta'), ('Infrastructure'),
  ('Client Portal'), ('Mobile App'), ('Data Pipeline'), ('ERP Migration')
on conflict do nothing;

-- ------------------------------------------------
-- ATTENDANCE RECORDS
-- ------------------------------------------------
create table if not exists public.attendance (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  date            date not null default current_date,
  start_time      time not null,
  end_time        time,
  break_minutes   integer default 60,
  worked_hours    numeric(4,2) generated always as (
    case
      when end_time is not null then
        round(
          (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
          - break_minutes / 60.0,
          2
        )
      else null
    end
  ) stored,
  unworked_hours  numeric(4,2) generated always as (
    case
      when end_time is not null then
        greatest(
          0,
          8.0 - round(
            (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
            - break_minutes / 60.0,
            2
          )
        )
      else 8.0
    end
  ) stored,
  overtime_hours  numeric(4,2) generated always as (
    case
      when end_time is not null then
        greatest(
          0,
          round(
            (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
            - break_minutes / 60.0,
            2
          ) - 8.0
        )
      else 0
    end
  ) stored,
  productivity_pct integer generated always as (
    case
      when end_time is not null then
        least(
          200,
          round(
            (
              (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
              - break_minutes / 60.0
            ) / 8.0 * 100
          )::integer
        )
      else 0
    end
  ) stored,
  status          text generated always as (
    case
      when end_time is null then 'in_progress'
      when (
        (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
        - break_minutes / 60.0
      ) >= 8.0 + 0.01 then 'overtime'
      when (
        (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
        - break_minutes / 60.0
      ) >= 8.0 then 'complete'
      when (
        (extract(epoch from end_time) - extract(epoch from start_time)) / 3600.0
        - break_minutes / 60.0
      ) >= 6.0 then 'incomplete'
      else 'incomplete_severe'
    end
  ) stored,
  task_description text,
  department      text,
  project         text,
  is_late         boolean default false,
  overtime_approved boolean,
  eth_year        integer,
  eth_month       integer,
  eth_day         integer,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (user_id, date)
);

-- ------------------------------------------------
-- LEAVE REQUESTS
-- ------------------------------------------------
create table if not exists public.leave_requests (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  leave_type    text not null check (leave_type in ('Annual', 'Sick', 'Maternity', 'Paternity', 'Emergency', 'Unpaid')),
  start_date    date not null,
  end_date      date not null,
  days          integer generated always as (end_date - start_date + 1) stored,
  reason        text,
  status        text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by   uuid references public.profiles(id),
  reviewed_at   timestamptz,
  review_note   text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ------------------------------------------------
-- NOTIFICATIONS
-- ------------------------------------------------
create table if not exists public.notifications (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  type        text check (type in ('info', 'warning', 'success', 'danger')),
  title       text not null,
  message     text not null,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------

-- Profiles
alter table public.profiles enable row level security;
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Attendance
alter table public.attendance enable row level security;
create policy "Users can view own attendance" on public.attendance for select using (auth.uid() = user_id);
create policy "Managers can view all attendance" on public.attendance for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('manager', 'admin'))
);
create policy "Users can insert own attendance" on public.attendance for insert with check (auth.uid() = user_id);
create policy "Users can update own attendance" on public.attendance for update using (auth.uid() = user_id);

-- Leave requests
alter table public.leave_requests enable row level security;
create policy "Users can view own leaves" on public.leave_requests for select using (auth.uid() = user_id);
create policy "Managers can view all leaves" on public.leave_requests for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('manager', 'admin'))
);
create policy "Users can insert own leaves" on public.leave_requests for insert with check (auth.uid() = user_id);
create policy "Managers can update leave status" on public.leave_requests for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('manager', 'admin'))
);

-- Notifications
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- ------------------------------------------------
-- AUTO-CREATE PROFILE ON SIGNUP (trigger)
-- ------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'employee')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------
-- UPDATED_AT trigger
-- ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_attendance_updated_at before update on public.attendance
  for each row execute procedure public.set_updated_at();
create trigger set_leave_updated_at before update on public.leave_requests
  for each row execute procedure public.set_updated_at();
create trigger set_profile_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ------------------------------------------------
-- USEFUL VIEWS
-- ------------------------------------------------

-- Daily attendance summary
create or replace view public.daily_summary as
select
  a.date,
  count(*) filter (where a.status in ('complete', 'overtime', 'in_progress')) as present_count,
  count(*) filter (where a.is_late = true) as late_count,
  count(*) filter (where a.status = 'overtime') as overtime_count,
  round(avg(a.worked_hours) filter (where a.worked_hours is not null), 2) as avg_worked_hours,
  round(avg(a.productivity_pct) filter (where a.productivity_pct > 0), 0) as avg_productivity
from public.attendance a
group by a.date
order by a.date desc;

-- Employee productivity summary
create or replace view public.employee_productivity as
select
  p.id,
  p.full_name,
  p.department,
  p.position,
  p.role,
  count(a.id) as total_days,
  round(avg(a.worked_hours), 2) as avg_worked_hours,
  round(avg(a.unworked_hours), 2) as avg_unworked_hours,
  round(avg(a.overtime_hours), 2) as avg_overtime_hours,
  round(avg(a.productivity_pct), 0) as avg_productivity,
  count(*) filter (where a.is_late = true) as late_count
from public.profiles p
left join public.attendance a on a.user_id = p.id
group by p.id, p.full_name, p.department, p.position, p.role;
