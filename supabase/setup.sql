-- BSAC database setup. Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement is idempotent.
--
-- Access model: the public website (anon key) may only ADD applications, messages and passport
-- photos. Nobody can read them with the public key — view them in the dashboard (or a future
-- admin page that signs in).

-- ───────────────────────── applications ─────────────────────────
create table if not exists public.applications (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  first_name          text not null check (char_length(first_name) between 1 and 100),
  middle_name         text not null default '' check (char_length(middle_name) <= 100),
  surname             text not null check (char_length(surname) between 1 and 100),
  address             text not null check (char_length(address) between 1 and 300),
  state               text not null check (char_length(state) between 1 and 100),
  lga                 text not null check (char_length(lga) between 1 and 100),
  gender              text not null check (gender in ('Male', 'Female')),
  phone               text not null check (char_length(phone) between 7 and 20),
  email               text not null check (char_length(email) between 3 and 254),
  course              text not null check (course in ('Fashion Design', 'Bakery', 'Coding', 'Adult Education', 'Graphic Design')),
  has_previous_skills text not null default 'No' check (has_previous_skills in ('Yes', 'No')),
  previous_skills     text not null default '' check (char_length(previous_skills) <= 300),
  passport_path       text not null check (passport_path like 'passports/%' and char_length(passport_path) <= 200),
  status              text not null default 'pending' check (status in ('pending', 'paid', 'admitted', 'rejected'))
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);

alter table public.applications enable row level security;

drop policy if exists "Public can submit applications" on public.applications;
create policy "Public can submit applications"
  on public.applications for insert
  to anon, authenticated
  with check (status = 'pending');

revoke all on public.applications from anon, authenticated;
grant insert (first_name, middle_name, surname, address, state, lga, gender, phone, email, course,
              has_previous_skills, previous_skills, passport_path)
  on public.applications to anon, authenticated;

-- ───────────────────────── messages ─────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null check (char_length(email) between 3 and 254),
  message     text not null check (char_length(message) between 5 and 5000),
  handled     boolean not null default false
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

alter table public.messages enable row level security;

drop policy if exists "Public can send messages" on public.messages;
create policy "Public can send messages"
  on public.messages for insert
  to anon, authenticated
  with check (handled = false);

revoke all on public.messages from anon, authenticated;
grant insert (email, message) on public.messages to anon, authenticated;

-- ───────────────────────── passport photos (private bucket) ─────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('passports', 'passports', false, 8388608, array['image/jpeg'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can upload passports" on storage.objects;
create policy "Public can upload passports"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'passports' and (storage.foldername(name))[1] = 'passports');
-- No select/update/delete policies: uploaded photos can't be listed, read or overwritten publicly.
