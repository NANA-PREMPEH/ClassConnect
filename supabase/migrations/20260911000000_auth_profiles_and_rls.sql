-- Auth users are provisioned by an administrator or an approved invite flow.
-- Do not derive role or school membership from unrestricted user metadata.

create or replace function public.current_school_id() returns uuid
language sql stable security definer set search_path = public
as $$ select school_id from public.profiles where id = auth.uid() $$;

create or replace function public.is_school_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'administrator') $$;

create or replace function public.is_school_staff() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('administrator', 'teacher', 'invigilator')) $$;

create or replace function public.can_access_student(target_student_id uuid) returns boolean
language sql stable security definer set search_path = public
as $$ select auth.uid() = target_student_id or exists (
  select 1 from public.enrolments e join public.class_staff cs on cs.class_id = e.class_id
  where e.student_id = target_student_id and cs.staff_id = auth.uid()
) or exists (
  select 1 from public.profiles p join public.profiles student on student.id = target_student_id
  where p.id = auth.uid() and p.role = 'administrator' and p.school_id = student.school_id
) $$;

create policy "profiles: own or school staff" on public.profiles for select
using (id = auth.uid() or (public.is_school_staff() and school_id = public.current_school_id()));

create policy "schools: administrators read own school" on public.schools for select
using (id = public.current_school_id() and public.is_school_admin());

create policy "classes: school staff read" on public.classes for select
using (public.is_school_staff() and school_id = public.current_school_id());
create policy "classes: administrators manage" on public.classes for all
using (public.is_school_admin() and school_id = public.current_school_id())
with check (public.is_school_admin() and school_id = public.current_school_id());

create policy "class staff: school staff read" on public.class_staff for select using (exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.current_school_id() and public.is_school_staff()));
create policy "class staff: administrators manage" on public.class_staff for all using (exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.current_school_id() and public.is_school_admin()));

create policy "enrolments: learner or staff read" on public.enrolments for select
using (student_id = auth.uid() or exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.current_school_id() and public.is_school_staff()));
create policy "enrolments: administrators manage" on public.enrolments for all using (exists (select 1 from public.classes c where c.id = class_id and c.school_id = public.current_school_id() and public.is_school_admin()));

create policy "sync vault: staff submit" on public.sync_vault for insert
with check (public.is_school_staff() and school_id = public.current_school_id() and submitted_by = auth.uid());
create policy "sync vault: staff read school" on public.sync_vault for select
using (public.is_school_staff() and school_id = public.current_school_id());
