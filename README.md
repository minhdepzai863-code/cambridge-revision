# Cambridge Revision

A Cambridge AS & A Level revision workspace for Mathematics 9709, Physics 9702, and Computer Science 9618.

## Run locally

Requires Node.js 22 or later. No dependency installation is needed.

- npm run dev — open http://127.0.0.1:4173
- npm run check — JavaScript syntax checks
- npm test — grading, validation, statistics, timers, spaced review, and theme tests
- npm run build — create the static production site in dist

Vercel uses the build command and output directory in vercel.json.

## Appearance

Settings & backup offers the original green theme, white, dark, or the device theme. Dark uses a softer forest-charcoal palette. A quiet notebook grid is enabled by default and can be turned off. Appearance is saved per browser; the sidebar provides a quick dark-mode switch.

## Data

Local work uses IndexedDB and remains separate from the signed-in Supabase workspace. Export a complete JSON backup before clearing site data or moving devices. Cloud records use owner-scoped row-level security. The private revision-files bucket accepts PDF, PNG, JPEG, and WebP files up to 20 MB each. Question papers must be PDFs.

config.mjs contains a public publishable key. Authorization is enforced by database and storage policies. Never commit a service-role key, private token, or .env file.

Thresholds require supplied evidence or a labelled manual estimate. Partial attempts do not receive full-paper grades. This is an independent revision tool, not affiliated with Cambridge International Education.
