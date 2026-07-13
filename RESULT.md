# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: medha bhardwaj
- Trainee ID: Not Provided
- Database Track: PostgreSQL
- Branch: GH3-Q9V-L6T
- Final Commit: 724a35121580cf70718673698734f15a98ab923f

## Evaluation Confidence

- Confidence: Medium
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` was not present; packages were not installed per instructions.
  - Visible tests, typecheck, lint, and build were not executed.
  - PostgreSQL runtime verification was unavailable; assessment is static code review plus git diff against the challenge baseline.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts` (or related error-handling helpers).
- What is correct:
  - GET and POST paths already existed and remain present.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal 500 responses expose `error.message`, which can leak implementation details.
  - Error responses for method failure do not use the shared `createApiError` helper consistently with a proper 405.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)` without `Allow`; catch block returns raw `error.message` for `INTERNAL_ERROR`
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 7 / 15
- What the trainee changed:
  - In `listOverdueTickets`, changed `dueDate` filter from `gt: now` to `lt: now`.
- What is correct:
  - Overdue tickets are now those with `dueDate` before the current controlled time.
  - Optional priority filter via spread of `{ priority }` remains intact.
  - Secondary sort by `dueDate: "asc"` (oldest due first within a group) remains present.
- What is incomplete or incorrect:
  - Status filter remains `status: { not: "closed" }`, so `resolved` tickets can still appear; expected behavior excludes both `resolved` and `closed` (active = `open` / `in_progress` only).
  - Ordering uses Prisma `priority: "asc"`, which follows enum declaration order (`low` → `medium` → `high` → `critical`), not the required business order (`critical` → `high` → `medium` → `low`).
  - Existing `PRIORITY_ORDER` in `lib/priority.ts` is unused; no CASE-based or rank-based ordering was added.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` — `dueDate.lt`, `status.not: "closed"`, `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 9 / 15
- What the trainee changed:
  - Priority grouping query: `COUNT("assignedTo")` → `COUNT(*)`.
  - `overdueActive` count: added `status: { not: "closed" }` alongside `dueDate.lt`.
- What is correct:
  - `COUNT(*)` correctly counts all tickets per priority, including rows with null `assignedTo`.
  - Total count and status `GROUP BY` with `COUNT(*)` were already sound and remain so.
  - Overdue active count now at least excludes `closed` tickets.
- What is incomplete or incorrect:
  - `overdueActive` still does not exclude `resolved` tickets; expected active overdue excludes both `resolved` and `closed`.
  - `byStatus` / `byPriority` are built only from `GROUP BY` rows via `Object.fromEntries`, with no zero-fill for missing keys (`open`, `in_progress`, `resolved`, `closed` and `low`, `medium`, `high`, `critical`).
  - Zero-normalization gap is masked by the seed fixture (all keys present with non-zero counts in the visible test).
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` — priority `COUNT(*)`, overdue filter, and unnormalized `Object.fromEntries` maps
- Submission.md consistency: Partially Accurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent; no install permitted)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None (visible tests unchanged; no trainee test updates in git diff)
- Quality of tests: Existing visible tests remain intact; no trainee-authored regression coverage for 405/Allow, priority business order, resolved exclusion, or zero-fill edge cases
- Runtime verification limitations: Dependencies not installed; database/runtime checks unavailable; evaluation relies on static review and git history

## Code Quality Review

- Error handling: Overdue and statistics handlers sanitize 500s; main tickets index still leaks internal error messages and mishandles unsupported methods
- Validation: Existing validation helpers unchanged and still used on overdue priority and tickets CRUD paths
- Query safety: Prisma/`$queryRaw` usage remains parameterized/static SQL strings; no injection introduced
- Readability: Small, localized edits in the repository layer; easy to review
- Minimality of change: Good — only three targeted lines in `ticketRepository.ts` for the intended bugs (plus incidental unrelated commit noise outside scoped app logic)
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - SUBMISSION.md names the wrong file (`testrepository.ts` vs `ticketRepository.ts`)
  - AI usage left as unresolved `Yes / No` template text
  - No evidence of skipped tests, `.only`, hardcoded API payloads, or assertion weakening in scoped test files
  - `prisma/seed.ts` diff is newline-only (not a fixture rewrite)

## Submission.md Review

- Bugs identified correctly: Partially — correctly called out overdue `gt`→`lt` and priority `COUNT(assignedTo)`→`COUNT(*)`; partially described overdue status exclusion; did not identify HTTP 405/Allow/error sanitization, priority business ordering, resolved exclusion, or zero normalization
- Root causes explained correctly: Weak — “Root Causes” section is empty; bug notes are brief and sometimes imprecise
- Claims supported by code: Partially — the three repository edits match the narrative direction, but the file name is wrong and status exclusion is overstated relative to full requirements
- AI usage declared: No — confirmation line left as `Yes / No` without a selection
- Known issues disclosed: No — section left blank; confidence template left as `Low / Medium / High`
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 11 / 20
- Functional correctness of planted issues: 16 / 40
- Testing and verification: 2 / 10
- Code quality and safety: 6 / 10
- Submission quality and engineering judgment: 4 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 39 / 90

## Final Evaluator Summary

The trainee identified three repository-layer defects and landed partial fixes for overdue dating and statistics counting, but did not address the HTTP method/error-safety issue at all. Of the three planted categories, none are fully fixed: overdue still includes `resolved` and sorts priority by enum ascending rather than business rank, and statistics still omit zero-filled keys and still count resolved tickets as active overdue. The strongest part of the submission is the accurate, minimal correction of `dueDate` from `gt` to `lt` and of `COUNT("assignedTo")` to `COUNT(*)`. The most important gap is incomplete requirement coverage—especially Issue 1 and priority ordering—combined with a thin, incomplete SUBMISSION.md. A viva is recommended to confirm whether the trainee understands the remaining filter/order/normalization rules versus fixing only what the visible fixture exercises. Ask how Prisma `orderBy: { priority: "asc" }` orders the Priority enum versus the required critical→high→medium→low sequence, and what query change would enforce that.

## Recommended Viva Question

In `listOverdueTickets`, you kept `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`. Given the Prisma Priority enum declaration order (`low`, `medium`, `high`, `critical`), what order does `"asc"` actually produce, and how would you implement the required business order `critical → high → medium → low` (for example with a CASE expression or `PRIORITY_ORDER`) while still sorting oldest `dueDate` first within the same priority?
