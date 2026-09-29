-- BSAC admin access. Run AFTER setup.sql: SQL Editor → New query → paste → edit step 3 → Run.
-- Safe to re-run.
--
-- Before running, create the admin login:
--   Authentication → Users → Add user → "Create new user" → email + password, tick "Auto Confirm User".
-- Then turn off public sign-ups:
--   Authentication → Sign In / Providers → "Allow new users to sign up" → off.

-- ───────────────────────── 1. the single admin ─────────────────────────
-- `singleton` is always true and is the primary key, so this table can hold at most one row.
create table if not exists public.admins (
  singleton  boolean primary key default true check (singleton),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ───────────────────────── 2. what the admin can do ─────────────────────────
-- Applications: read all, change only `status`.
drop policy if exists "Admin can read applications" on public.applications;
create policy "Admin can read applications"
  on public.applications for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin can update application status" on public.applications;
create policy "Admin can update application status"
  on public.applications for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.applications to authenticated;
grant update (status) on public.applications to authenticated;

-- Messages: read all, tick `handled`.
drop policy if exists "Admin can read messages" on public.messages;
create policy "Admin can read messages"
  on public.messages for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin can mark messages handled" on public.messages;
create policy "Admin can mark messages handled"
  on public.messages for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

grant select on public.messages to authenticated;
grant update (handled) on public.messages to authenticated;

-- Passport photos: admin can view them (via short-lived signed links).
drop policy if exists "Admin can view passports" on storage.objects;
create policy "Admin can view passports"
  on storage.objects for select to authenticated
  using (bucket_id = 'passports' and (select public.is_admin()));

-- ───────────────────────── 3. make your account the admin ─────────────────────────
-- Replace the email with the one you created above. Re-running with a different email moves admin
-- rights to that account (there can only ever be one admin).
insert into public.admins (user_id)
select id from auth.users where email = 'REPLACE_WITH_ADMIN_EMAIL'
on conflict (singleton) do update set user_id = excluded.user_id;

-- Should return one row with your email:
select u.email as admin_email from public.admins a join auth.users u on u.id = a.user_id;
