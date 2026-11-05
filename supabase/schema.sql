-- Reproducible reference for the existing project. Do not run against a different
-- project without reviewing its data model. This is not a deployment migration.
create table if not exists public.revision_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  id uuid not null,
  kind text not null check (kind in ('attempt','mistake','threshold','exam','topic','question','session','settings','timer')),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  updated_at timestamptz not null default now(),
  primary key (user_id,id)
);
alter table public.revision_records enable row level security;
create index if not exists revision_records_user_kind on public.revision_records(user_id,kind,updated_at desc);
revoke all on public.revision_records from anon;
revoke truncate,references,trigger on public.revision_records from authenticated;
grant select,insert,update,delete on public.revision_records to authenticated;
drop policy if exists own_select on public.revision_records;
create policy own_select on public.revision_records for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists own_insert on public.revision_records;
create policy own_insert on public.revision_records for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists own_update on public.revision_records;
create policy own_update on public.revision_records for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists own_delete on public.revision_records;
create policy own_delete on public.revision_records for delete to authenticated using ((select auth.uid())=user_id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('revision-files','revision-files',false,20971520,array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists revision_file_select on storage.objects;
create policy revision_file_select on storage.objects for select to authenticated using (bucket_id='revision-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists revision_file_insert on storage.objects;
create policy revision_file_insert on storage.objects for insert to authenticated with check (bucket_id='revision-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists revision_file_delete on storage.objects;
create policy revision_file_delete on storage.objects for delete to authenticated using (bucket_id='revision-files' and (storage.foldername(name))[1]=(select auth.uid())::text);
