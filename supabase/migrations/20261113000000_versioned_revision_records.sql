-- Apply before releasing the version-aware browser client.
begin;

alter table public.revision_records
  add column if not exists version uuid not null default gen_random_uuid();

create or replace function public.guard_revision_record_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if current_user = 'authenticated'
      and current_setting('cambridge.revision_write', true) is distinct from 'checked' then
    raise sqlstate 'PT409' using message = 'Reload Cambridge Revision before changing cloud records.';
  end if;
  if TG_OP = 'DELETE' then
    return old;
  end if;
  new.version := gen_random_uuid();
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

revoke all on function public.guard_revision_record_write() from public, anon, authenticated;
drop trigger if exists revision_record_write_guard on public.revision_records;
create trigger revision_record_write_guard
before insert or update or delete on public.revision_records
for each row execute function public.guard_revision_record_write();

create or replace function public.commit_revision_records(changes jsonb)
returns setof public.revision_records
language plpgsql
security invoker
set search_path = ''
as $$
declare
  owner_id uuid := auth.uid();
  change record;
  saved public.revision_records%rowtype;
begin
  if owner_id is null then
    raise sqlstate 'PT401' using message = 'Sign in before saving.';
  end if;
  perform set_config('cambridge.revision_write', 'checked', true);
  -- Acquire locks in ID order and roll back the entire batch on a stale row.
  for change in
    select * from jsonb_to_recordset(changes)
      as c(id uuid, expected_version uuid, kind text, payload jsonb, remove boolean)
    order by c.id
  loop
    if change.remove then
      delete from public.revision_records r
      where r.user_id = owner_id and r.id = change.id and r.version = change.expected_version
      returning r.* into saved;
    elsif change.expected_version is null then
      insert into public.revision_records as r(user_id, id, kind, payload)
      values (owner_id, change.id, change.kind, change.payload)
      on conflict (user_id, id) do nothing returning r.* into saved;
    else
      update public.revision_records r
      set kind = change.kind, payload = change.payload
      where r.user_id = owner_id and r.id = change.id and r.version = change.expected_version
      returning r.* into saved;
    end if;

    if not found then
      raise sqlstate 'PT409' using
        message = 'A cloud record changed before this save.',
        detail = change.id::text;
    end if;
    if not coalesce(change.remove, false) then
      return next saved;
    end if;
  end loop;
end;
$$;

revoke all on function public.commit_revision_records(jsonb) from public, anon;
grant execute on function public.commit_revision_records(jsonb) to authenticated;
commit;
