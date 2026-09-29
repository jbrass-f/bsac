# BSAC — Brethren Skills Acquisition Center

Website for BSAC at EYN Church LCC Utako, Abuja. Next.js (App Router, TypeScript, Tailwind CSS v4), exported as a static site and hosted on Firebase Hosting (`bsac-center.web.app`). Applications and messages are stored in Supabase.

## Getting started

```bash
cp .env.example .env.local   # Supabase URL + publishable key
npm install
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload (service worker disabled) |
| `npm run build` | Static export to `out/` (then flattens prefetch files, see below) |
| `npm run preview` | Serve the built `out/` folder locally |
| `npm run deploy` | Build and `firebase deploy --only hosting` (needs `firebase login` and `firebase use <project>` first) |
| `npm run lint` | ESLint |

## Structure

```
app/(site)/           public routes: / , /apply , /activities , /connect (with the site header/nav)
app/admin/            admin dashboard (own layout, not indexed)
components/admin/     login, applications and messages panels
lib/admin.ts          admin Supabase calls (auth, list, update status)
supabase/*.sql        database setup scripts
components/layout/    header, bottom nav, splash + name prompt, install banner, notification modal
components/home/      home page sections (hero, courses, gallery, FAQ, contact, message form…)
components/apply/     application form, camera capture, payment modal, printable admission form
components/providers/ AppProvider — shared state (visitor name, notifications, PWA install,
                      application draft, video likes/comments) that survives page navigation
lib/content.ts        all editable content: courses, FAQs, gallery, contacts, payment details
lib/supabase.ts       passport upload + `applications` / `messages` inserts
public/sw.js          service worker (offline support)
```

To change courses, fees, contact numbers, FAQs etc., edit `lib/content.ts`.

## Supabase setup

Run in the Supabase SQL Editor, in order:

1. `supabase/setup.sql` — tables, the private `passports` bucket, public insert-only access.
2. `supabase/admin.sql` — admin access. First create the admin user (Authentication → Users → Add user, "Auto Confirm User"), put its email in step 3 of the script, and turn off "Allow new users to sign up".

## Admin

`/admin` — sign in with the admin account to see applications (filter, search, view passport photo, change status: pending / paid / admitted / rejected) and messages (mark handled, reply by email). There is exactly one admin, recorded in `public.admins`; re-run step 3 of `admin.sql` with another email to hand it over. Reset the admin password from the Supabase dashboard (Authentication → Users).

## Notes

- **Supabase:** writes go straight from the browser with the publishable key. Row Level Security must allow anonymous `insert` only on `applications`, `messages` and the `passports` storage bucket — never `select`.
- **Old links:** `/#apply`, `/#activities`, `/#connect` redirect to the new routes.
- **`scripts/fix-export-segments.mjs`:** works around a Next.js 16 bug where static exports built on Windows write prefetch files into the wrong place. Harmless on Linux/macOS; remove once fixed upstream.
