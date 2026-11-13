# Cambridge Revision

A Cambridge AS & A Level revision workspace for Mathematics 9709, Physics 9702, and Computer Science 9618.

## Run locally

Requires Node.js 22 or later. Run npm ci before building or running CI checks.

- npm run dev — open http://127.0.0.1:4173
- npm run check — JavaScript syntax checks
- npm test — grading, validation, statistics, timers, spaced review, and theme tests
- npm run build — create the static production site in dist

Run npm run test:browser after building dist and installing the pinned Playwright version in .github/workflows/checks.yml and its Chromium browser.

Vercel uses the build command and output directory in vercel.json.

## Appearance

Settings & backup offers Blue, Paper, Sage (the original green), White, Dark, or the device theme. Dark uses a softer forest-charcoal palette. A quiet notebook grid is enabled by default and can be turned off. Appearance is saved per browser; the sidebar provides a quick dark-mode switch.

## Data

Local work uses IndexedDB and remains separate from the signed-in Supabase workspace. Export a complete JSON backup before clearing site data or moving devices. Cloud records use owner-scoped row-level security. The private revision-files bucket accepts PDF, PNG, JPEG, and WebP files up to 20 MB each. Question papers must be PDFs.

config.mjs contains a public publishable key. Authorization is enforced by database and storage policies. Never commit a service-role key, private token, or .env file.

Thresholds require supplied evidence or a labelled manual estimate. Partial attempts do not receive full-paper grades. This is an independent revision tool, not affiliated with Cambridge International Education.

## Cloud updates

Apply the migration in supabase/migrations and release the matching static build in the same release window. The write guard rejects direct writes from already-open older clients. Those clients must refresh to get the version-aware save flow.

The cloud compares each record version in the same transaction as the write or delete. A rejected edit is held on the current device under Settings & backup → Cloud conflicts. Review or export it there, or explicitly use the recovered edit. The replaced cloud version is retained in that device's recovery list. Copy local data to cloud can be run again after an interruption. It reuses uploaded attachments and previously copied records, and puts differing copies in Cloud conflicts.

## Paper sources

Paper catalogue links to 176 question paper and mark-scheme pairs for Cambridge Mathematics, Physics, and Computer Science and to Cambridge's subject collections. Exam builder uses the saved question bank and linked catalogue questions. The included 9702/12 May/June 2024 MCQ set uses the published mark scheme. Questions and diagrams from that set are read in the linked source PDF. A printable custom paper includes the saved prompts and references for linked questions.

## Setup and verification

- Auth Site URL: https://cambridge-revision.vercel.app
- Auth redirect allowlist: https://cambridge-revision.vercel.app/**
- Existing schema reference: supabase/schema.sql (review before running)
- Checklist evidence and remaining limitations: VERIFICATION.md
- Syllabus edition and assessment audit: SYLLABUS_AUDIT.md

Core navigation is Overview, Papers, Mistakes, Review, and Progress. Expand Study tools for the syllabus, exam plan, question bank, practice studio, thresholds, and full paper history.
