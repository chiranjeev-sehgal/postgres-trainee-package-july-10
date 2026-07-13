# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Pulkit
- Trainee ID: Not Provided
- Database Track: PostgreSQL
- Branch: LN4-Z7Q-H2V
- Final Commit: b00564d7ee572ef7bfefc054c37885e55af94ccb

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not installed and `.env` is absent, so runtime commands (`test:visible`, typecheck, lint, build) were not executed in this evaluation environment.
  - Assessment relies on static review of scoped source, visible test expectations, fixture priorities, and git diff against the planted baseline.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`. Git history shows only `repositories/ticketRepository.ts` and submission/build artifacts were modified for the bug-fix work.
- What is correct:
  - GET and POST paths were already present and remain functional for supported methods.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set.
  - Internal 500 responses still return `error.message`, which can expose Prisma/SQL/connection details instead of a sanitized message.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `response.status(400)` without `setHeader("Allow", ...)`; catch block returns `message: error instanceof Error ? error.message : "Unexpected error"`
- Submission.md consistency: Not Mentioned

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 10 / 15
- What the trainee changed:
  - In `listOverdueTickets`, changed `dueDate` comparator from `gt: now` to `lt: now`.
  - Changed status filter from `not: "closed"` to `notIn: ["closed", "resolved"]`.
- What is correct:
  - Overdue means `dueDate < now`.
  - Active overdue set correctly includes open/in_progress and excludes resolved/closed.
  - Optional priority filter still works via spread of `{ priority }`.
  - Invalid priority rejection remains handled in the overdue API route via `validatePriority`.
  - Secondary sort by `dueDate: "asc"` (oldest first within a group) is present.
- What is incomplete or incorrect:
  - Priority ordering still uses Prisma `orderBy: { priority: "asc" }`, which follows the PostgreSQL/Prisma enum declaration order (`low`, `medium`, `high`, `critical`), not the required business order (`critical`, `high`, `medium`, `low`).
  - Existing `PRIORITY_ORDER` in `lib/priority.ts` is unused.
  - Against seeded overdue tickets (critical / high / medium), enum ascending order would yield medium → high → critical, which does not match the visible overdue test expectation of critical → high → medium.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` where-clause fixes (`lt`, `notIn`) plus unchanged `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`
- Submission.md consistency: Partially Accurate
  - Claims correctly describe the overdue date and status-filter fixes, but do not mention priority ordering, and one bullet mislabels the overdue list fix as “overdue ticket count.”

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 11 / 15
- What the trainee changed:
  - Priority aggregation query changed from `COUNT("assignedTo")` to `COUNT(*)`.
  - `overdueActive` count now excludes `closed` and `resolved` via `status: { notIn: ["closed", "resolved"] }`.
- What is correct:
  - Total count remains `prisma.ticket.count()`.
  - Status grouping uses `COUNT(*)`.
  - Priority grouping no longer undercounts unassigned tickets.
  - Active overdue count uses `dueDate < now` and excludes resolved/closed.
  - Fixes are query-based, not hardcoded fixture values.
- What is incomplete or incorrect:
  - `byStatus` and `byPriority` are built with `Object.fromEntries(...)` from `GROUP BY` rows only, so missing statuses/priorities are omitted rather than normalized to `0`.
  - Required zero-filled keys (`open`, `in_progress`, `resolved`, `closed` and `low`, `medium`, `high`, `critical`) are not guaranteed when a category has no rows.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` — `COUNT(*)` and overdue `notIn` fixes; return mapping without zero-fill normalization
- Submission.md consistency: Partially Accurate
  - Correctly describes `COUNT(*)` and overdue status exclusion; does not mention zero normalization. Line references / wording mix overdue-list and statistics concerns.

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (dependencies and database env unavailable in evaluator environment)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run here; trainee reported `npm run build` in SUBMISSION.md, and `.next` artifacts were committed, which suggests a local build occurred
- Tests added or changed: None
- Quality of tests: No trainee-authored tests; repository visible tests were left intact (no skips, no `.only`, no assertion weakening observed in scoped test files)
- Runtime verification limitations:
  - No `node_modules`, no `.env`, and no live PostgreSQL verification in this evaluation pass.
  - Static analysis indicates overdue ordering would still fail business/visible ordering expectations; statistics would likely pass on the full seed set because all status/priority keys are present, while still failing the zero-normalization requirement on sparse data.

## Code Quality Review

- Error handling: Unchanged and unsafe on the main tickets route (raw internal error messages on 500). Overdue/statistics routes already sanitize 500s.
- Validation: Existing validation helpers remain in place and were not broken.
- Query safety: Prisma queries and tagged `$queryRaw` remain parameterized/safe; no string-concatenated SQL introduced.
- Readability: Repository fixes are small and readable.
- Minimality of change: Good for the bugs that were fixed; scope stayed in `ticketRepository.ts`. Issue 1 and ordering/zero-fill were missed rather than over-engineered.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - Large `.next` build output and `package-lock.json` were committed alongside the fix (poor git hygiene, not evidence of answer hardcoding).
  - SUBMISSION.md Final Commit SHA left blank despite a final commit existing.
  - High confidence claimed without reporting `test:visible` results.

## Submission.md Review

- Bugs identified correctly: Partially — identified overdue date direction, overdue/active status exclusion, and priority `COUNT("assignedTo")` undercount; missed HTTP 405/Allow/error sanitization, business priority ordering, and zero-key normalization.
- Root causes explained correctly: No — “Root Causes” section is empty; bug list is mostly symptom/fix notes.
- Claims supported by code: Mostly for the repository edits claimed; wording/line accuracy is imperfect, and success coverage is overstated relative to remaining defects.
- AI usage declared: Yes — stated no AI tools were used.
- Known issues disclosed: No — section left empty despite remaining defects.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 11 / 20
- Functional correctness of planted issues: 21 / 40
- Testing and verification: 3 / 10
- Code quality and safety: 6 / 10
- Submission quality and engineering judgment: 5 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 46 / 90

## Final Evaluator Summary

Pulkit correctly identified and fixed several real PostgreSQL repository defects: overdue date comparison, exclusion of resolved/closed from overdue/active counts, and priority aggregation undercounting caused by `COUNT("assignedTo")`. Of the three planted issue categories, none are fully complete: Issue 1 was untouched, Issue 2 filtering is fixed but priority business ordering is not, and Issue 3 counting/overdue logic is improved but zero normalization is missing. The strongest part of the submission is the focused, correct repository query edits with no hardcoding or test tampering. The most important gap is incomplete end-to-end coverage—especially HTTP method/error safety and priority ordering—combined with a thin SUBMISSION.md that asserts high confidence without root-cause analysis or visible-test evidence. A viva is recommended to confirm whether the trainee understands why enum `asc` ordering is incorrect and how statistics should guarantee zero-filled keys. Ask specifically how overdue tickets should be ordered when priorities differ and how that maps to the current `orderBy`.

## Recommended Viva Question

In `listOverdueTickets`, you kept `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`. Given the Prisma `Priority` enum is declared as `low`, `medium`, `high`, `critical`, what order would PostgreSQL return for overdue tickets with those priorities, and how would you change the query (or post-processing) to enforce critical → high → medium → low?
