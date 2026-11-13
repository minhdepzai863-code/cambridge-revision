-- Run in an empty test database. The production schema already supplies auth and the table.
create role anon;
create role authenticated;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to authenticated;
insert into auth.users values ('00000000-0000-4000-8000-000000000001'),
  ('00000000-0000-4000-8000-000000000002');

create table public.revision_records (
  user_id uuid not null references auth.users(id),
  id uuid not null,
  kind text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id,id)
);
alter table public.revision_records enable row level security;
create policy owner on public.revision_records to authenticated
  using (user_id=auth.uid()) with check (user_id=auth.uid());
grant select,insert,update,delete on public.revision_records to authenticated;
insert into public.revision_records(user_id,id,kind,payload) values
 ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000020','settings','{"displayName":"Original"}'),
 ('00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000020','settings','{"displayName":"Other account"}');

\ir ../supabase/migrations/20261113000000_versioned_revision_records.sql

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',false);
do $$
declare
  record_id constant uuid := '00000000-0000-4000-8000-000000000020';
  new_id constant uuid := '00000000-0000-4000-8000-000000000010';
  old_version uuid;
  new_version uuid;
  changed jsonb := '{"displayName":"Changed"}';
  write_stale jsonb;
  direct_blocked boolean := false;
begin
  select version into strict old_version from public.revision_records where id=record_id;
  if old_version is null then raise exception 'Existing rows must have versions'; end if;
  begin
    update public.revision_records set payload='{}' where id=record_id;
  exception when sqlstate 'PT409' then direct_blocked := true;
  end;
  if not direct_blocked then raise exception 'Direct client update was allowed'; end if;

  select version into strict new_version from public.commit_revision_records(jsonb_build_array(
    jsonb_build_object('id',record_id,'kind','settings','payload',changed,'expected_version',old_version)
  ));
  if old_version = new_version then raise exception 'A successful write must rotate the version'; end if;
  write_stale := jsonb_build_object('id',record_id,'kind','settings','payload','{}'::jsonb,'expected_version',old_version);

  begin
    perform public.commit_revision_records(jsonb_build_array(
      jsonb_build_object('id',new_id,'kind','settings','payload','{}'::jsonb),
      write_stale
    ));
    raise exception 'A stale batch was accepted';
  exception when sqlstate 'PT409' then null;
  end;
  if exists(select 1 from public.revision_records where id=new_id) then raise exception 'The stale batch partially committed'; end if;
  if (select payload from public.revision_records where id=record_id) is distinct from changed then raise exception 'The stale edit changed a record'; end if;

  begin
    perform public.commit_revision_records(jsonb_build_array(jsonb_build_object(
      'id',record_id,'remove',true,'expected_version',old_version
    )));
    raise exception 'A stale delete was accepted';
  exception when sqlstate 'PT409' then null;
  end;
  perform public.commit_revision_records(jsonb_build_array(jsonb_build_object(
    'id',record_id,'remove',true,'expected_version',new_version
  )));
  if exists(select 1 from public.revision_records) then raise exception 'The delete did not apply or exposed the other account'; end if;
end;
$$;
reset role;
do $$
begin
  if (select payload from public.revision_records) is distinct from '{"displayName":"Other account"}'::jsonb then
    raise exception 'The other account was modified';
  end if;
end;
$$;
