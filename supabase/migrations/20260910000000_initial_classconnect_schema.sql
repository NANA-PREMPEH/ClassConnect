create extension if not exists pgcrypto;
create type public.app_role as enum ('administrator', 'teacher', 'invigilator', 'student');

create table public.schools (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now());
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, school_id uuid references public.schools(id) on delete cascade, role public.app_role not null, display_name text not null, created_at timestamptz not null default now());
create table public.classes (id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, name text not null, year_group text, created_at timestamptz not null default now(), unique (school_id, name));
create table public.class_staff (class_id uuid not null references public.classes(id) on delete cascade, staff_id uuid not null references public.profiles(id) on delete cascade, primary key (class_id, staff_id));
create table public.enrolments (class_id uuid not null references public.classes(id) on delete cascade, student_id uuid not null references public.profiles(id) on delete cascade, enrolled_at timestamptz not null default now(), primary key (class_id, student_id));
create table public.sync_vault (id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, submitted_by uuid not null references public.profiles(id), device_id text not null, payload jsonb not null, status text not null default 'pending' check (status in ('pending', 'processing', 'processed', 'failed')), processing_error text, created_at timestamptz not null default now(), processed_at timestamptz);

alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_staff enable row level security;
alter table public.enrolments enable row level security;
alter table public.sync_vault enable row level security;

-- Role-specific RLS policies, JSONB processing functions, and Storage buckets
-- are added in their dedicated migrations so this baseline remains branch-safe.
