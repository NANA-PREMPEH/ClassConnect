create table public.student_progress (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade, lesson_id integer not null check (lesson_id between 1 and 5), status text not null check (status in ('not_started', 'in_progress', 'completed')), completed_at timestamptz, updated_at timestamptz not null default now(), unique (student_id, lesson_id));
create table public.diagnostic_attempts (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade, result jsonb not null, created_at timestamptz not null default now());
create table public.quiz_attempts (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade, lesson_id integer not null check (lesson_id between 1 and 5), result jsonb not null, created_at timestamptz not null default now());
create table public.assessments (id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, created_by uuid not null references public.profiles(id), title text not null, payload jsonb not null, published_at timestamptz, created_at timestamptz not null default now());
create table public.assessment_submissions (id uuid primary key default gen_random_uuid(), assessment_id uuid not null references public.assessments(id) on delete cascade, student_id uuid not null references public.profiles(id) on delete cascade, payload jsonb not null, submitted_at timestamptz not null default now(), unique (assessment_id, student_id));
create table public.audit_log (id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade, actor_id uuid references public.profiles(id), action text not null, detail jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

alter table public.student_progress enable row level security;
alter table public.diagnostic_attempts enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_submissions enable row level security;
alter table public.audit_log enable row level security;

create policy "progress: learner or assigned staff" on public.student_progress for select using (public.can_access_student(student_id));
create policy "progress: learner writes own" on public.student_progress for insert with check (student_id = auth.uid());
create policy "progress: learner updates own" on public.student_progress for update using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "diagnostics: learner or assigned staff" on public.diagnostic_attempts for select using (public.can_access_student(student_id));
create policy "diagnostics: learner writes own" on public.diagnostic_attempts for insert with check (student_id = auth.uid());
create policy "quizzes: learner or assigned staff" on public.quiz_attempts for select using (public.can_access_student(student_id));
create policy "quizzes: learner writes own" on public.quiz_attempts for insert with check (student_id = auth.uid());
create policy "assessments: staff read school" on public.assessments for select using (public.is_school_staff() and school_id = public.current_school_id());
create policy "assessments: teachers manage" on public.assessments for all using (public.is_school_staff() and school_id = public.current_school_id()) with check (public.is_school_staff() and school_id = public.current_school_id());
create policy "submissions: learner or assigned staff" on public.assessment_submissions for select using (public.can_access_student(student_id));
create policy "submissions: learner writes own" on public.assessment_submissions for insert with check (student_id = auth.uid());
create policy "audit: administrators read own school" on public.audit_log for select using (public.is_school_admin() and school_id = public.current_school_id());
