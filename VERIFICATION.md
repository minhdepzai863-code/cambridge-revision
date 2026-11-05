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

- 25 Node tests pass, plus syntax checks and a static production build.
- Fixed blank optional elapsed-time validation, numeric question counts, direct #log entry, timer pause on navigation, PDF-only question-paper validation, and stale question-total feedback.
- Backups validate records, file references, MIME/base64/size limits, numeric fields, paper identities, source URLs, and revision history before writing. A real exported backup passes the stronger validator. Restoring into the existing local workspace kept two attempts and reused both attachments.
- Repeated cloud-copy/restore code preserves attachment IDs and reuses matching contents; conflicts fail explicitly. Authenticated cloud file-copy behavior still needs the dedicated check below.
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

## Remaining verification limits

Successful sign-in occurred in the user's browser session; the automation browser remained in local mode. A real authenticated preference record was confirmed after the user saved it. Private attachment upload/download/isolation over the Storage API, refresh-token expiry, and non-empty local-to-cloud copy must not be described as fully browser-verified yet. Local PDF persistence and byte-complete backup/restore, database RLS isolation, and authenticated record save have separate evidence above.

No student marks, timetable, official grade-threshold library, or carry-forward eligibility is invented or preloaded. Downloaded official PDFs and all synthetic verification results stayed in ignored local outputs / browser-local QA workspaces, outside production data and repository assets.
