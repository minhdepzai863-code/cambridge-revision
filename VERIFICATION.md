# Cambridge Revision verification

Audit date: 5 November 2026. Source: the user's handoff checklist and subsequent readability/navigation requests.

Production: https://cambridge-revision.vercel.app  
Repository: https://github.com/minhdepzai863-code/cambridge-revision

## Acceptance checklist

| Requirement | Evidence / status |
|---|---|
| Actual QP and MS uploads | Passed locally with the official June 2024 Mathematics 9709/11 PDFs. Filename and cover extraction recognized paper 11, May/June 2024, 75 marks, and 110 minutes. |
| 67/75 displays 89.33% | Passed in the browser, saved details, history, and automated grading/statistics checks. |
| Record 94 minutes manually | Passed; details show 1h 34m and “Manually recorded.” Upload did not invent a working time. |
| Question-specific marks and mistakes | Passed: Q1(a), 2 available, 1 obtained, 1 lost, linked to Quadratics. Incomplete breakdown shows a discrepancy warning. |
| Refresh preserves records and actual file bytes | Passed. Full JSON export after reload contained both PDFs; SHA-256 comparison matched both downloaded originals exactly. |
| Repeat attempt preserves original | Passed: separate 67/75 and 60/75 local attempts, numbered #1 and #2. |
| Both attempts appear in chart | Passed: score chart exposes two focusable attempt points and a matching accessible description. |
| Exact official threshold and provenance | Passed: June 2024 component 11 row from the official PDF produced component a and retained the official source URL. |
| No invented grade for missing thresholds / partial attempts | Missing threshold verified in the browser. Partial and wrong-variant/year behavior covered by automated tests. |
| Topic-linked mistakes and review queue | Passed: retry hides earlier working/correction, reveal shows them, Good schedules the next interval and retains review history. Original-practice self-marking also creates a topic-linked review entry. |
| All three subjects and AS/A2 | Browser controls checked for each subject/stage. Syllabus tests check stable IDs, route filtering, and shared CS P3/P4 content. |
| Countdown and timezone | Passed with an explicitly entered local test date/time; 09:00 remained 09:00 after save. The production app ships no assumed examination date. |
| Edit retains history and updates analytics | Passed: editing the local attempt retained its earlier snapshot, question marks, linked mistake, and updated paper identity. |
| Separate original app preserved | Work stayed in cambridge-tracker; the sibling scaffold and original app were not edited. |
| Desktop/mobile design | Checked at 1440px and 390px. No horizontal page overflow. Core navigation is five items; Study tools expands to reveal secondary functions. |

## Additional checks and fixes

- 30 Node tests pass, plus syntax checks and a static production build.
- Fixed blank optional elapsed-time validation, numeric question counts, direct #log entry, timer pause on navigation, PDF-only question-paper validation, and stale question-total feedback.
- Backups validate records, file references, MIME/base64/size limits, numeric fields, paper identities, source URLs, and revision history before writing. A real exported backup passes the stronger validator. Restoring into the existing local workspace kept two attempts and reused both attachments.
- Repeated cloud-copy/restore code preserves attachment IDs and reuses matching contents; conflicts fail explicitly. A signed-in isolated cloud check separately verified private PDF bytes, repeated cloud restore/reuse, and non-empty preference copying.
- Retry screens use the question/task rather than displaying the previous wrong answer first. Correction edits retain earlier correction snapshots.
- Calculator browser check: 200/250 displayed as a hypothetical estimate, with no grade for an unmatched entry option and an explicit unconfirmed carry-forward warning. Route/weighting checks are automated; a centre must determine actual eligibility.
- Syllabus audit corrected missing Physics 11.2, preserved the legacy power/efficiency ID as a supplementary focus within 5.1, expanded practical skills, and mapped advanced CS algorithms/programming to both Papers 3 and 4. See SYLLABUS_AUDIT.md.
- Blue, Paper, Sage, White, and Dark filters measured at least 6.65:1 text contrast. The prior fixed pale AS/A2 backgrounds and muted subject labels were removed. Device mode and saved preferences have automated coverage.
- Invalid sign-in shows “Invalid login credentials” and leaves the local workspace available.

## Supabase evidence

- Existing project is active and healthy. revision_records has owner-scoped SELECT/INSERT/UPDATE/DELETE RLS, with UPDATE ownership checked before and after the change.
- Transactional tests passed for own-row access/update, cross-user row invisibility, cross-user update/insert denial, and ownership-reassignment denial. Fixtures were rolled back.
- Anonymous REST reads of revision_records are denied. Authenticated table grants were narrowed to CRUD; TRUNCATE, REFERENCES, and TRIGGER were revoked.
- revision-files is private, limits uploads to 20 MiB, and allows PDF/PNG/JPEG/WebP. Storage policies restrict paths to the signed-in user's first folder. Uploads do not use upsert.
- Account email confirmation and successful sign-in were confirmed in server state. A real preference save from the user’s signed-in app was then verified directly in revision_records. The user reported correcting Auth Site URL and redirect allowlist to the production origin. Signup now explicitly requests the current origin as its confirmation destination.
- Latest security advisor: one warning, leaked-password protection disabled. [Supabase remediation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). No billing/plan or Auth security setting was changed automatically.
- Performance advisor: one informational unused-index notice on a new, initially empty project; the useful owner/kind index was retained.

## Authenticated cloud verification

The signed-in session was subsequently located on the localhost test origin. An ignored local test page imported the same store.mjs module and verified private upload/download of both official PDFs with exact byte equality, cloud export plus repeated restore/reuse, and reloading the saved preference record. It restored the original preference values and created no paper attempts.

A non-empty local-to-cloud preference copy passed twice without duplicate records. Forced client-cache expiry followed by concurrent reads successfully refreshed the real session. Added automated checks cover single-flight refresh, sibling-tab session adoption, account changes, and sign-out. Storage RLS testing exposed the two verification objects to their owner and zero to a different authenticated claim, with the SQL transaction rolled back. This tests database policy isolation; a second real-account browser login was not used.

The two verification-only PDF objects are retained in private Storage at the user’s explicit request. The local copy test retains the same genuine preference values in the separate local workspace. No paper marks or examination dates were added to the cloud. A large real-paper local-to-cloud migration was not run against the student’s data.

No student marks, timetable, official grade-threshold library, or carry-forward eligibility is invented or preloaded. Synthetic paper results stayed in browser-local QA workspaces, outside production data and repository assets. The two explicitly retained cloud verification PDFs contain official examination materials, not student results.

## Optional STEM catalogue and subject drawer

- 34 Node tests pass with syntax checks and a static production build. New coverage checks default subject compatibility, saved selections, restored subject records, all 24 Further Mathematics topics, science topic stages, practical headings, qualification weighting, paper recognition and backup validation.
- Isolated local browser check: added Further Mathematics, Chemistry and Biology; all persisted after refresh. Further Mathematics AS P1+P4 route showed exactly 12 headings. Saved completion/confidence persisted and the dashboard showed 1/24 topics confident. Paper identification offers all six selected subjects. Existing marks and preferences remained available.
- Subject toolbar now opens a sliding panel with selected state and Add subject. Checked desktop and 390 px mobile layouts, selection, Escape dismissal, and browser console errors. Selected subject text and syllabus code use the action foreground colour.
- The existing generic settings payload handles subject selections; no database schema or access policy change is required. No student cloud records were modified during this subject test.

- Subject management follow-up: sideways selector arrow; every selected subject has a remove control. Removal saves an explicit selection and retains paper/file/progress records. Removed subjects are excluded from filters and statistics until re-added. Empty selections route creation actions to Add subject; legacy settings retain the original defaults. Automated coverage now totals 35 tests.


## 6 November 2026 — second visual design pass

- Presentation-only restructuring: performance-first Overview, compact subject register, document-library Papers, separate attempt history and grouped Performance form. Existing event actions, routes, record types, Auth and Storage integration remain intact.
- Light canvas #F6F6F4 / white / charcoal; neutral charcoal dark mode. No grid paint or decorative cover shelf.
- npm run check and all 35 existing tests passed. Production static build passed.
- Browser checked at 1280×800, actual 990×884 and 390×844 using clearly isolated local fixtures. Confirmed overview values, recent-paper links, two attachment controls, separate attempts and existing repeat-attempt wizard fields. PDF preview iframe is present, but embedded PDF raster rendering was not assessed from screenshots.
- Current direction review packet: outputs/art-review/manifest.json (ignored development evidence). Detector source scan returned no findings. Reviewer confirmed composition, palette, paper library and form grouping; requested larger metadata. Important metadata now at least 11px. Actual-width chart axes render approximately 12.19px; mobile chart scroll is intentionally contained.
- Confirmation review found one mobile confidence caption overflow after text enlargement. Corrected wrapping without reducing 11px type. Targeted browser measurement: 64px column, 64px scroll width, 35.19px wrapped height. Mobile document width remains390px. No additional polish loop.
- No cloud records, private files, database schema or authentication settings were modified.

Deployment packaging: added .vercelignore to exclude local verification artifacts and environment files. The Vercel local builder encountered Windows symlink permissions; production release uses the validated dist files packaged as Build Output API v3 static output, with the same response headers as vercel.json. No runtime or data change is involved.

Final release confirmed READY: dpl_3W6c7zRCHjBeRomTL7kPVmFqYmfy, assigned to https://cambridge-revision.vercel.app. Live browser verified new Overview, compact subject rows, Papers empty state and existing attachment-upload step. Production computed palette: #F6F6F4, Manrope, no background grid; no horizontal document overflow at990px. Deployed workspace.css SHA256 matches local exactly:07a32e12233015e443c6692e16a112f942e460c235e897dc34902a793155c3c7. Screenshot outputs/art-review/live-overview.jpg. Browser session was Local; no signed-in cloud writes or new live records were used for this check. Abandoned source-build and direct-release attempts were cancelled; final static release is ready.


## 6 November 2026 — soft-silver light-theme refinement

Only neutral-light colour roles, scoped surface contrast, secondary-button borders, dialog elevation and browser theme colour changed. Typography, layout, dark styles, application code and data logic are unchanged.

- Browser inspection: populated Overview, document library and attempt form at1440×900; mobile Overview at390×844. No page overflow. Canvas rgb237,238,240; sidebar229,231,234; primary surface247,247,248.
- Before/after dark-mode sampling matched exactly for nine representative regions/controls, including backgrounds, colours, borders, shadows, fonts, padding and dimensions.
- Secondary text contrast4.66:1 on canvas /5.06:1 on panels; chart line4.60:1; control boundaries3.08:1 on canvas. The starting accent is retained as a soft accent, with darker related shades for meaningful chart strokes and focus.
- Existing35 tests and syntax checks pass. No new behavioural tests were added for this colour-only refinement. Ignored evidence is under outputs/silver-review.
