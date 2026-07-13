# Hackathon Evaluation Result

## Submission Identity

- Trainee ID: Omar Khan
- Database Track: PostgreSQL
- Branch: WY8-K2F-P7D
- Final Commit: aa234f4db8c2cb6369e200396495171f6e498ff7

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not present, so typecheck, lint, build, and visible tests were not executed.
  - PostgreSQL runtime verification was unavailable; assessment is based on static code review against expected behavior and the trainee’s git diff (`967ad52` repository changes).

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`. Only `repositories/ticketRepository.ts` was modified in the submission commit.
- What is correct:
  - Nothing related to this issue was fixed.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - `Allow` header is not set to `GET, POST`.
  - Internal 500 responses still expose `error.message`, which can leak implementation details.
  - Error sanitization / consistent JSON error helper usage for method and internal failures was not applied on this route.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)` without `Allow`; catch block returns `message: error instanceof Error ? error.message : "Unexpected error"`
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 7 / 15
- What the trainee changed:
  - In `listOverdueTickets`, changed `dueDate` comparison from `gt: now` to `lt: now`.
  - Left status filter as `status: { not: "closed" }` and left `orderBy` as Prisma enum `priority: "asc"` then `dueDate: "asc"`.
- What is correct:
  - Overdue date predicate now correctly selects tickets with `dueDate` before current time.
  - Optional priority filter remains intact.
  - Within-priority `dueDate` ascending order is present.
- What is incomplete or incorrect:
  - Active overdue set still excludes only `closed`, so `resolved` tickets can still appear; expected behavior is open and in_progress only (exclude resolved and closed).
  - Priority ordering uses Postgres/Prisma enum alphabetical declaration order (`low` → `medium` → `high` → `critical`), not the required business order (`critical` → `high` → `medium` → `low`). Existing `PRIORITY_ORDER` in `lib/priority.ts` was unused.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` (`dueDate.lt`, `status.not: "closed"`, `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`)
- Submission.md consistency: Partially Accurate

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 9 / 15
- What the trainee changed:
  - Changed priority aggregation from `COUNT("assignedTo")` to `COUNT(*)`.
  - Added `status: { not: "closed" }` to the `overdueActive` count filter (in addition to `dueDate.lt`).
- What is correct:
  - Priority counts no longer undercount unassigned tickets; `COUNT(*)` is the right fix for the planted nullable-column bug.
  - Total and status `GROUP BY` counts remain structurally sound.
  - Overdue active count at least filters closed tickets and uses `dueDate < now`.
- What is incomplete or incorrect:
  - `overdueActive` still does not exclude `resolved` tickets.
  - No zero-normalization: `byStatus` / `byPriority` are built only from `GROUP BY` rows via `Object.fromEntries`, so missing status/priority keys are omitted instead of returned as `0`.
  - Solution is not fixture-hardcoded, but incomplete relative to required response shape.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` (`COUNT(*)` on priority query; overdue count with `not: "closed"`; return maps without zero-fill)
- Submission.md consistency: Partially Accurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` missing; dependencies not installed per evaluation rules)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None
- Quality of tests: N/A — trainee did not add or update tests; existing visible tests were left intact (no skips/`only`/assertion weakening observed in scoped test files)
- Runtime verification limitations:
  - No local dependency install allowed/available; PostgreSQL runtime and Jest suite not verified in this evaluation pass.

## Code Quality Review

- Error handling: Unchanged and still unsafe on tickets index (method status code and internal message leakage). Overdue/statistics handlers already sanitize 500s and were not part of trainee edits.
- Validation: Unchanged; existing validators remain in place for priority/status where used.
- Query safety: Prisma/`$queryRaw` usage remains parameterized/tagged-template safe; no SQL string concatenation introduced.
- Readability: Changes are small and localized; inline comments are informal/typo-heavy but do not break logic.
- Minimality of change: Strong — only `ticketRepository.ts` functional edits in scope; no unrelated rewrites of API routes or helpers.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - No hardcoded API responses, fixture array bypasses, skipped tests, or weakened assertions in scoped files.
  - SUBMISSION.md AI confirmation left as unresolved `Yes / No` template text.
  - Submission commit also included build artifacts / lockfile noise outside scoped review; not treated as evidence of test cheating.

## Submission.md Review

- Bugs identified correctly: Partially — correctly called out overdue `gt`→`lt` and `COUNT(assignedTo)`→`COUNT(*)`; incorrectly framed “not closed” as complete active-ticket rule; did not identify HTTP method/error-safety or priority business ordering or zero-fill gaps.
- Root causes explained correctly: Partially — nullable `assignedTo` undercount and inverted dueDate comparison are accurate; resolved-vs-closed active definition is incomplete/incorrect.
- Claims supported by code: Yes for the two repository fixes claimed; claims do not cover Issue 1 and overstate completeness of overdue/status filtering.
- AI usage declared: No clear declaration — template still shows `Yes / No` without a selection.
- Known issues disclosed: None listed despite remaining defects.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 10 / 20
- Functional correctness of planted issues: 16 / 40
- Testing and verification: 2 / 10
- Code quality and safety: 5 / 10
- Submission quality and engineering judgment: 3 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 36 / 90

## Final Evaluator Summary

Omar Khan (PostgreSQL track) correctly identified and fixed two real repository defects: inverted overdue date comparison (`gt` → `lt`) and incorrect priority counting via `COUNT("assignedTo")` → `COUNT(*)`. Issue 1 (HTTP 405, `Allow` header, sanitized internal errors on the tickets index) was not touched at all. Overdue and statistics work remain only partially correct because `resolved` tickets are still treated as active and priority ordering still follows enum ascending order instead of critical→high→medium→low; statistics also lack zero-key normalization. SUBMISSION.md is thin, does not disclose remaining gaps, and leaves AI usage unmarked. Strongest aspect is the minimal, accurate partial fix in `ticketRepository.ts`. Most important gap is missing Issue 1 plus incomplete overdue status/ordering semantics. A viva is recommended to confirm whether the trainee understands the remaining business rules versus fixture-passing coincidence.

## Recommended Viva Question

In `listOverdueTickets`, why is `status: { not: "closed" }` insufficient for “active overdue” tickets, and how would you change both the overdue query and the priority `orderBy` so results exclude `resolved` tickets and sort in critical → high → medium → low order instead of Prisma enum ascending order?
