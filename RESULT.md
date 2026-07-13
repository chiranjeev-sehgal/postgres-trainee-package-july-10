# Hackathon Evaluation Result

## Submission Identity

- Trainee ID: Arimardan Pandey Saurabh
- Trainee Name: Arimardan Pandey Saurabh
- Database Track: PostgreSQL
- Branch: BZ5-H7L-X3M
- Final Commit: b14159cd79e035c8091437f8b16d2e6b002ecfd7

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not present, so typecheck, lint, build, and visible tests could not be executed.
  - Runtime PostgreSQL/Docker verification was unavailable; assessment is based on static review of scoped source, visible tests, and git diffs.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`. The unsupported-method and error-sanitization defects remain as in the initial challenge code.
- What is correct:
  - GET and POST paths themselves remain functional and use validation helpers.
  - Related routes (`overdue.ts`, `statistics.ts`) already return 405 with an `Allow` header, but those were not the planted main-route defect.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set on the main tickets route.
  - Internal 500 responses still expose `error.message`, which can leak Prisma/SQL/connection details.
  - This planted issue is not mentioned in `SUBMISSION.md`.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)` with `METHOD_NOT_ALLOWED`; catch block returns `message: error instanceof Error ? error.message : "Unexpected error"`
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - In `listOverdueTickets`, changed `dueDate` comparison from `gt: now` to `lt: now`.
  - Changed priority `orderBy` from `"asc"` to `"desc"`.
- What is correct:
  - Overdue tickets are now selected with `dueDate < now`.
  - Optional priority filter is preserved.
  - Within the same priority, `dueDate: "asc"` keeps oldest-due first.
  - For this schema’s PostgreSQL/Prisma enum declaration order (`low`, `medium`, `high`, `critical`), `priority: "desc"` yields the required business order: critical → high → medium → low.
- What is incomplete or incorrect:
  - Status filtering still uses `status: { not: "closed" }`, so `resolved` overdue tickets remain included.
  - Correct behavior requires including only `open` and `in_progress` (or excluding both `resolved` and `closed`).
  - Available `PRIORITY_ORDER` helper in `lib/priority.ts` is unused; enum DESC works here but is fragile if enum declaration order changes.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` (`dueDate.lt`, `status.not: "closed"`, `orderBy: [{ priority: "desc" }, { dueDate: "asc" }]`)
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 9 / 15
- What the trainee changed:
  - Fixed priority aggregation from `COUNT("assignedTo")` to `COUNT(*)`.
  - Added `status: { not: "closed" }` to `overdueActive`.
  - Minor typing edits on grouped-count mapping (`any` annotations; `count` typed as `string | bigint`).
- What is correct:
  - Total count via `prisma.ticket.count()` is appropriate.
  - Status grouping uses `COUNT(*)` and `GROUP BY status`.
  - Priority grouping now counts all tickets, not only assigned ones.
  - No hardcoded fixture totals were introduced.
- What is incomplete or incorrect:
  - `overdueActive` still excludes only `closed`, not `resolved`.
  - No zero-normalization: `byStatus` / `byPriority` are built only from returned groups, so missing status/priority keys stay absent instead of appearing as `0`.
  - Expected keys (`open`, `in_progress`, `resolved`, `closed` and `low`, `medium`, `high`, `critical`) are not guaranteed when counts are zero.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` (`COUNT(*)` priority query; `overdueActive` filter; `Object.fromEntries(...)` without zero-fill)
- Submission.md consistency: Partially Accurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` missing; Docker/Testcontainers unavailable in this evaluation environment)
- Typecheck result: Not run (`tsc` unavailable without dependencies)
- Lint result: Not run
- Build result: Not run
- Tests added or changed:
  - No visible test files were added or modified.
  - Trainee reported changes to `tests/helpers/testContainer.ts` (outside primary bug-fix scope).
- Quality of tests:
  - Existing visible tests remain intact; no `.only`, `.skip`, or assertion weakening detected in scoped test files.
  - Trainee did not add regression coverage for 405/Allow, resolved exclusion, or zero-key normalization.
- Runtime verification limitations:
  - Dependencies not installed; packages were not installed per evaluation rules.
  - PostgreSQL/Docker runtime unavailable; evaluation relies on static code review.

## Code Quality Review

- Error handling:
  - Main tickets route still returns 400 for unsupported methods and unsafely echoes internal error messages on 500.
  - Overdue/statistics handlers sanitize 500s better, but Issue 1 remains open.
- Validation:
  - Existing validation helpers remain in use; no clear regression there.
- Query safety:
  - Raw SQL remains parameterized/`$queryRaw` template usage; priority count fix is safe.
  - Overdue/status filters remain incomplete relative to business rules.
- Readability:
  - Repository changes are small and mostly readable; introduced `any` annotations reduce type safety without benefit.
- Minimality of change:
  - Core repository edits are relatively focused, but the branch also includes unrelated/environment work and a damaged `prisma/schema.prisma` fragment.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - `prisma/schema.prisma` contains an invalid inserted block (`----` plus duplicate datasource/generator), which would break Prisma generation if used as-is.
  - Git history shows unrelated artifacts/config churn (for example `.next` build output, `tsconfig.json`, `prisma.config.ts`, test helper edits) outside the three planted defect areas.
  - Issue 1 left completely untouched despite being an intentional planted defect.

## Submission.md Review

- Bugs identified correctly:
  - Partially. Trainee correctly called out overdue date comparison/sorting problems, incorrect priority `COUNT("assignedTo")`, and incomplete overdue-active filtering for `closed`.
  - Missed the main HTTP 405/Allow/error-sanitization issue.
  - Over-emphasized Prisma version, Docker, and TypeScript config problems that are not the planted functional defects.
- Root causes explained correctly:
  - Partially accurate for repository SQL/filter bugs; inaccurate/overstated for Prisma “older version” as a primary planted bug.
- Claims supported by code:
  - Overdue `lt` / priority `desc`, `COUNT(*)`, and `overdueActive` closed filter are present in code.
  - Claims do not cover unresolved gaps (405 handling, resolved exclusion, zero normalization).
  - Final commit SHA field in `SUBMISSION.md` was left blank.
- AI usage declared:
  - Yes — trainee stated AI tools were not used.
- Known issues disclosed:
  - Yes — Docker/Testcontainers dependency for tests and a Prisma typing/`@ts-ignore` limitation.
- Documentation quality: Adequate

## Preliminary Scoring

- Issue identification and root-cause understanding: 11 / 20
- Functional correctness of planted issues: 19 / 40
- Testing and verification: 4 / 10
- Code quality and safety: 5 / 10
- Submission quality and engineering judgment: 6 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 45 / 90

## Final Evaluator Summary

The trainee correctly identified parts of two planted defect areas (overdue querying and statistics counting) and made real repository fixes for date comparison, priority sort direction, and priority `COUNT(*)`. Issue 1 on the main tickets route was neither identified nor fixed: unsupported methods still return 400, no `Allow` header is set, and 500 responses can still leak internal error details. Issue 2 and Issue 3 remain only partially correct because `resolved` tickets are still treated as active overdue and statistics responses lack zero-filled status/priority keys. The strongest part of the submission is the concrete, evidence-backed repository fix for the wrong overdue date comparator and the assigned-only priority count. The most important gap is the complete miss on HTTP method/error safety, compounded by remaining status-filter and normalization gaps. A viva is recommended to distinguish genuine understanding of the business rules from environment/setup debugging. Ask specifically why `status: { not: "closed" }` is insufficient for overdue and overdueActive correctness.

## Recommended Viva Question

In `repositories/ticketRepository.ts`, both `listOverdueTickets` and `getTicketStatistics` filter with `status: { not: "closed" }`. Walk through what happens for an overdue ticket with status `resolved`, and explain what filter (or `notIn`) you should use so only active overdue tickets are counted and returned.
