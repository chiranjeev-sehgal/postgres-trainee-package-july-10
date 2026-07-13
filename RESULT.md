# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Aditya Mishra
- Trainee ID: Not Provided
- Database Track: PostgreSQL
- Branch: RM8-V2C-J6W
- Final Commit: 0c9e60272ebbb5f665bc3b622faafe5677454ef7

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not installed, so `npm run typecheck`, `npm run lint`, `npm run test:visible`, and `npm run build` were not executed.
  - PostgreSQL runtime was not verified. Assessment is based on static review of scoped files and git blame/diff against the initial planted baseline.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - Only adjusted GET `assignedTo` filter pass-through to `assignedTo ? assignedTo.trim() : undefined` in `pages/api/tickets/index.ts`.
  - No change to unsupported-method handling or internal-error sanitization.
- What is correct:
  - GET and POST handlers remain present.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal 500 responses still return `error.message`, which can expose internal details.
  - The planted HTTP/error-safety defects were not identified or fixed.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)` with `METHOD_NOT_ALLOWED`; catch block returns `message: error instanceof Error ? error.message : "Unexpected error"`
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 7 / 15
- What the trainee changed:
  - In `listOverdueTickets`, changed `dueDate: { gt: now }` to `dueDate: { lt: now }`.
  - Left existing `status: { not: "closed" }` and `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]` unchanged for overdue listing.
- What is correct:
  - Due-date comparison now correctly selects tickets before current time.
  - Optional priority filter still works via the overdue API handler validation path.
  - Same-priority `dueDate` ascending ordering is present.
- What is incomplete or incorrect:
  - Resolved tickets are still included; only `closed` is excluded. Correct behavior requires excluding both `resolved` and `closed`.
  - Priority ordering still uses Prisma enum `asc` (`low`, `medium`, `high`, `critical` per `schema.prisma`), not the required business order (`critical`, `high`, `medium`, `low`). `lib/priority.ts` / CASE ranking was not used.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` (`dueDate.lt`, `status.not: "closed"`, `orderBy.priority: "asc"`)
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 4 / 15
- What the trainee changed:
  - Added `status: { not: "closed" }` to `overdueActive` counting.
  - Changed priority aggregate cast from `COUNT("assignedTo")::bigint` to `COUNT("assignedTo")::text`, with a comment claiming `assignedTo` type issues.
- What is correct:
  - Total count and status/priority grouping queries still exist.
  - Overdue active count now at least attempts to exclude closed tickets.
- What is incomplete or incorrect:
  - Priority counting still uses `COUNT("assignedTo")`, which skips null assignees; it should count rows (`COUNT(*)`), not assignee values.
  - Casting count to `text` does not fix the root cause and mismatches `RawGroupedCount.count: bigint`.
  - No zero-fill normalization for missing status/priority keys (`open`, `in_progress`, `resolved`, `closed` and `low`, `medium`, `high`, `critical`).
  - `overdueActive` still does not exclude `resolved`.
  - Result is still assembled via `Object.fromEntries(...)` without a predefined zeroed map.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` raw SQL groups and overdue `count` filter
- Submission.md consistency: Inaccurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` unavailable)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed:
  - `tests/visible/tickets.test.ts` import path changed from `@/pages/api/tickets/index` to `@/pages/api/tickets` (earlier intermediate commit briefly used `@/pages/api/tickets/pages`).
  - No new assertions added for 405/Allow, overdue ordering/status exclusion, or statistics zero-fill.
- Quality of tests:
  - Visible suite left largely intact; no meaningful assertion weakening observed in final tree.
  - Import-path churn suggests local path confusion rather than deliberate test sabotage.
- Runtime verification limitations:
  - Dependencies not installed; database runtime unavailable. Functional scoring is from static code review only.

## Code Quality Review

- Error handling: Unsafe on tickets index 500 path; overdue/statistics handlers sanitize better but were not part of the trainee’s Issue 1 fix.
- Validation: Existing validators reused; no improvement to method handling.
- Query safety: Parameterized Prisma/`$queryRaw` templates remain; logic bugs persist in filters/aggregates.
- Readability: Small inline comments added; statistics status filter formatting is messy.
- Minimality of change: Mixed. Core overdue `lt` fix is focused, but unrelated migration index rewrites and incorrect count cast dilute quality.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No (import path only; assertions preserved)
- Integrity flags:
  - Unrelated index-column reordering and removal of `Ticket_createdAt_idx` in `prisma/migrations/.../migration.sql` while `prisma/schema.prisma` indexes were left unchanged (schema/migration drift).
  - Misdiagnosis of priority `COUNT("assignedTo")` as a datatype/`Text` problem.
  - SUBMISSION claims success-oriented fixes that do not match planted Issue 1/3 requirements.
  - No evidence of hardcoded API fixtures, skipped tests, or `test.only` / `describe.only`.

## Submission.md Review

- Bugs identified correctly: Partially. Correctly noted overdue `gt`→`lt`. Incorrectly focused on index ordering and `assignedTo` casting. Did not identify HTTP 405/Allow/error sanitization or statistics zero-normalization / `COUNT(*)` issues.
- Root causes explained correctly: No. `## Root Causes` is empty.
- Claims supported by code: Partially. `lt` change and incomplete overdue status filter exist; bigint→text claim and index work are unsupported as correct fixes for planted defects; schema indexes were not updated to match migration edits.
- AI usage declared: Yes (`I confirm that I did not use AI tools during this challenge: Yes`)
- Known issues disclosed: Yes — POST parsing issue acknowledged; confidence Medium.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 7 / 20
- Functional correctness of planted issues: 11 / 40
- Testing and verification: 2 / 10
- Code quality and safety: 3 / 10
- Submission quality and engineering judgment: 5 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 28 / 90

## Final Evaluator Summary

The trainee correctly identified one planted overdue defect (`dueDate` compared with `gt` instead of `lt`) and partially improved overdue/statistics closed-ticket filtering. Issue 1 (405, Allow header, sanitized errors) was not addressed at all, and Issue 3 remains largely incorrect because priority counting still uses `COUNT("assignedTo")`, zero-fill normalization is missing, and resolved tickets are still counted as active overdue. Priority business ordering was never fixed. The strongest part of the submission is the clear overdue date-comparison fix and honest disclosure of remaining POST trouble. The most important gap is incomplete understanding of the three planted categories, with effort spent on unrelated index rewrites. A viva is recommended to separate lucky/local fixes from genuine root-cause understanding.

## Recommended Viva Question

In `listOverdueTickets`, why is `orderBy: { priority: "asc" }` insufficient for the required critical → high → medium → low ordering, and how would you implement that ordering correctly in PostgreSQL/Prisma without relying on enum declaration order?
