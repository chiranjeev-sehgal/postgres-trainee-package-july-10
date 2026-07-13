# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Md Aaman
- Trainee ID: Not Provided
- Database Track: PostgreSQL
- Branch: AA2-BB3-CC4 (SUBMISSION.md claims GH3-Q9V-L6T)
- Final Commit: 3e4013b7586d810daa79f539b319ba3c35d2671d

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not installed, so typecheck, lint, build, and visible tests were not executed.
  - PostgreSQL / Docker runtime was not available for this evaluation.
  - Assessment is based on static code review against the planted defects and the initial challenge baseline (`e235676`).

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 0 / 10
- What the trainee changed:
  - No changes to `pages/api/tickets/index.ts`. Git diff from challenge baseline shows only `repositories/ticketRepository.ts` and `SUBMISSION.md` were modified by this trainee.
- What is correct:
  - GET and POST paths still exist and remain functional for happy-path listing/creation.
  - Overdue and statistics handlers already return 405 with `Allow` (those were not the planted Issue 1 target on the main tickets route).
- What is incomplete or incorrect:
  - Unsupported methods on `/api/tickets` still return HTTP 400 instead of 405.
  - No `Allow: GET, POST` header is set on the method-not-allowed path.
  - Internal 500 responses still return `error.message`, which can expose Prisma/SQL/connection details.
  - Error responses are inconsistent with the safer `createApiError` pattern used elsewhere.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)` without `Allow`; catch block uses `message: error instanceof Error ? error.message : "Unexpected error"`
- Submission.md consistency: Inaccurate
  - SUBMISSION.md does not identify HTTP method handling or error sanitization. Claimed bugs focus on `.env`, Docker, Prisma version, and request-body parsing.

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - No changes to `listOverdueTickets` or `pages/api/tickets/overdue.ts`.
- What is correct:
  - Optional priority filter wiring via `validatePriority` remains in place.
  - Secondary sort by `dueDate: "asc"` is already present.
- What is incomplete or incorrect:
  - Filter still uses `dueDate: { gt: now }` (future tickets) instead of due before now (`lt`).
  - Status filter still uses `not: "closed"`, so `resolved` tickets can still appear; `open` / `in_progress` inclusion is not correctly constrained.
  - Ordering uses Prisma enum alphabetical `priority: "asc"` (`critical`, `high`, `low`, `medium`), not business order critical → high → medium → low. `lib/priority.ts` `PRIORITY_ORDER` is unused.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` (`dueDate.gt`, `status.not: "closed"`, `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`)
- Submission.md consistency: Not Mentioned
  - No overdue filtering or priority-ordering bug is identified.

## Issue 3 — Statistics and Zero Normalization

- Status: Not Addressed
- Score: 1 / 15
- What the trainee changed:
  - In `getTicketStatistics`, changed `COUNT("assignedTo")::bigint AS count` to `COUNT("assignedTo")::text AS count`.
- What is correct:
  - Total ticket count via `prisma.ticket.count()` is present.
  - Status grouping uses `COUNT(*)`, which is the right aggregation shape for status.
  - The trainee noticed a type/count-related smell near the priority query.
- What is incomplete or incorrect:
  - Priority counting still uses `COUNT("assignedTo")`, which undercounts rows where `assignedTo` is null; should count tickets (`COUNT(*)`).
  - Casting count to `text` does not fix the aggregation bug and fights the `bigint` typing in `RawGroupedCount`.
  - No zero-normalization for missing status/priority keys.
  - `overdueActive` counts all tickets with `dueDate < now` and does not exclude `resolved` / `closed`.
  - Fixture-specific hardcoding was not introduced, but the planted calculation defects remain.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` priority raw SQL and overdue `count` filter
- Submission.md consistency: Partially Accurate
  - Trainee mentioned BIGINT and `assignedTo`, but the claimed fix (`use TEXT`) and root cause (`because it goes to assginTo`) do not correctly describe or repair the defect.

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None
- Quality of tests: N/A for trainee-authored tests; existing visible tests in scoped files show no `.only` / `.skip` / weakened assertions
- Runtime verification limitations:
  - Dependencies not installed; no package install was performed per evaluation rules.
  - Database runtime unavailable; static review used instead.
  - SUBMISSION.md Commands Run and Tests sections are empty; trainee reported confidence options left as `Low / Medium / High` without selection.

## Code Quality Review

- Error handling: Main tickets route still exposes raw internal error messages; method handling remains incorrect.
- Validation: Existing validators appear intact; trainee did not change validation behavior.
- Query safety: Parameterized Prisma/`$queryRaw` tagged templates remain; no new injection risk introduced. Priority/overdue/statistics query logic remains business-incorrect.
- Readability: Unchanged overall; single-character cast change is small but misleading.
- Minimality of change: Change is minimal, but it does not address the planted root causes.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - Objective note: only substantive application change is an incorrect cast in statistics SQL; planted defects in HTTP handling and overdue logic are untouched.
  - SUBMISSION.md branch name (`GH3-Q9V-L6T`) does not match the evaluated Git branch (`AA2-BB3-CC4`).
  - Final Commit SHA left blank in SUBMISSION.md despite a local commit existing.
  - AI usage confirmation left as unresolved `Yes / No`.
  - No accusation of cheating; these are documentation/integrity inconsistencies only.

## Submission.md Review

- Bugs identified correctly: No. Listed environment/setup issues (DATABASE_URL, Docker, Prisma version, request-body/query confusion, BIGINT→TEXT) rather than the three planted API defects.
- Root causes explained correctly: No. Explanations are vague, environment-focused, or technically incorrect for the planted bugs.
- Claims supported by code: Partially. A repository cast change exists, but claimed `.env` changes and broader bug fixes are not evidenced in scoped application code. `.env` is listed under Files Changed; that is outside the planted-defect fix scope and was not treated as a valid solution here.
- AI usage declared: Incomplete / not clearly answered (`Yes / No` left unresolved).
- Known issues disclosed: Section left empty.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 3 / 20
- Functional correctness of planted issues: 1 / 40
- Testing and verification: 0 / 10
- Code quality and safety: 2 / 10
- Submission quality and engineering judgment: 2 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 8 / 90

## Final Evaluator Summary

The trainee (Md Aaman) did not correctly identify the three planted defects. SUBMISSION.md focuses on local setup problems (database URL, Docker, Prisma tooling) and a misunderstood BIGINT/`assignedTo` issue, rather than HTTP 405/error sanitization, overdue filtering/ordering, or statistics zero-normalization. Only one application-code change exists relative to the challenge baseline: casting the priority count to `text`, which leaves `COUNT("assignedTo")` and the overdue/status gaps unfixed. Issues 1 and 2 are untouched; Issue 3 is effectively not addressed. The strongest signal is that the trainee at least opened the statistics repository query, but the most important gap is failure to diagnose and repair the intentional business-logic bugs. A viva is recommended to confirm whether the trainee understands the intended overdue and statistics behavior versus environment troubleshooting. Ask specifically why `COUNT("assignedTo")` is wrong for priority totals and what the overdue filter and priority sort should be.

## Recommended Viva Question

In `repositories/ticketRepository.ts`, `getTicketStatistics` uses `COUNT("assignedTo")` for priority totals and `listOverdueTickets` uses `dueDate: { gt: now }` with `status: { not: "closed" }` and `orderBy: { priority: "asc" }`. Explain what each of those three choices returns incorrectly for the product requirements, and what the correct filter/count/order should be.
