-- All private object paths begin with the owning school UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('school-exports', 'school-exports', false, 10485760, array['text/csv', 'application/json', 'application/pdf']),
  ('school-backups', 'school-backups', false, 26214400, array['application/json']),
  ('lesson-assets', 'lesson-assets', false, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'])
on conflict (id) do nothing;

create policy "school staff read private school files" on storage.objects for select to authenticated
using (bucket_id in ('school-exports', 'school-backups', 'lesson-assets')
  and (storage.foldername(name))[1] = public.current_school_id()::text
  and public.is_school_staff());

create policy "school staff create exports and lesson assets" on storage.objects for insert to authenticated
with check (bucket_id in ('school-exports', 'lesson-assets')
  and (storage.foldername(name))[1] = public.current_school_id()::text
  and public.is_school_staff());

create policy "administrators manage backups" on storage.objects for all to authenticated
using (bucket_id = 'school-backups'
  and (storage.foldername(name))[1] = public.current_school_id()::text
  and public.is_school_admin())
with check (bucket_id = 'school-backups'
  and (storage.foldername(name))[1] = public.current_school_id()::text
  and public.is_school_admin());

create policy "administrators manage lesson assets" on storage.objects for update to authenticated
using (bucket_id = 'lesson-assets'
  and (storage.foldername(name))[1] = public.current_school_id()::text
  and public.is_school_admin())
with check (bucket_id = 'lesson-assets'
  and (storage.foldername(name))[1] = public.current_school_id()::text
  and public.is_school_admin());

create or replace function public.audit_change() returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  record_data jsonb := coalesce(to_jsonb(new), to_jsonb(old));
  event_school_id uuid;
  event_action text := lower(tg_table_name) || '.' || lower(tg_op);
begin
  if auth.uid() is null or not public.is_school_staff() then
    return coalesce(new, old);
  end if;

  if tg_table_name in ('classes', 'assessments') then
    event_school_id := (record_data ->> 'school_id')::uuid;
  elsif tg_table_name in ('class_staff', 'enrolments') then
    select school_id into event_school_id from public.classes where id = (record_data ->> 'class_id')::uuid;
  elsif tg_table_name = 'assessment_submissions' then
    select school_id into event_school_id from public.assessments where id = (record_data ->> 'assessment_id')::uuid;
  end if;

  if tg_table_name = 'assessments' and tg_op = 'UPDATE' and old.published_at is null and new.published_at is not null then
    event_action := 'assessment.published';
  elsif tg_table_name = 'assessment_submissions' and tg_op = 'UPDATE' then
    event_action := 'assessment.grade_updated';
  end if;

  if event_school_id is not null then
    insert into public.audit_log (school_id, actor_id, action, detail)
    values (event_school_id, auth.uid(), event_action, jsonb_build_object('record_id', record_data ->> 'id', 'table', tg_table_name));
  end if;
  return coalesce(new, old);
end;
$$;

create trigger audit_classes after insert or update or delete on public.classes for each row execute function public.audit_change();
create trigger audit_class_staff after insert or update or delete on public.class_staff for each row execute function public.audit_change();
create trigger audit_enrolments after insert or update or delete on public.enrolments for each row execute function public.audit_change();
create trigger audit_assessments after insert or update or delete on public.assessments for each row execute function public.audit_change();
create trigger audit_assessment_submissions after insert or update or delete on public.assessment_submissions for each row execute function public.audit_change();

create or replace function public.record_backup_audit(action_name text, detail jsonb default '{}'::jsonb) returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not public.is_school_admin() or action_name not in ('backup.exported', 'backup.restored') then
    raise exception 'Not authorized to record this audit event';
  end if;
  insert into public.audit_log (school_id, actor_id, action, detail)
  values (public.current_school_id(), auth.uid(), action_name, coalesce(detail, '{}'::jsonb));
end;
$$;
