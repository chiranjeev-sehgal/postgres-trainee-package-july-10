# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Jeraldin PJ
- Trainee ID: Not Provided
- Database Track: PostgreSQL
- Branch: NC6-W3Y-G7P
- Final Commit: 60b8a0c15f443282b8fe38dcf3736b4e2880a764

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
  - PostgreSQL/runtime verification was unavailable; scoring is based on static code review against expected behavior and the challenge baseline (`4e4c0dd`).

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 1 / 10
- What the trainee changed:
  - Cosmetic `return` placement on POST success, unsupported-method response, and internal-error response in `pages/api/tickets/index.ts`.
  - Similar `return` additions in `overdue.ts` and `statistics.ts`.
- What is correct:
  - GET and POST paths still exist and respond for supported methods.
  - Validation errors continue to map to HTTP 400 via existing handlers.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400, not 405.
  - No `Allow: GET, POST` header on the tickets index route.
  - Internal errors still return `error.message`, which can expose internal/Prisma details.
  - The planted method-handling and error-sanitization defects were not fixed.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)` without `Allow`; catch block returns `message: error instanceof Error ? error.message : "Unexpected error"`
- Submission.md consistency: Partially Accurate
  - Trainee claimed “missing return statements” / “function calls were not returning properly,” which does not match the actual planted defect and does not produce the required 405 / Allow / sanitized-error behavior.

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Partially Addressed
- Score: 9 / 15
- What the trainee changed:
  - In `listOverdueTickets`, changed `dueDate` from `gt: now` to `lt: now`.
  - Changed status filter from `not: "closed"` to `notIn: ["resolved", "closed"]`.
- What is correct:
  - Overdue means `dueDate` before current controlled time.
  - Active overdue set includes open / in_progress and excludes resolved / closed.
  - Optional priority filter is preserved.
  - Within-priority `dueDate: "asc"` secondary sort is present.
- What is incomplete or incorrect:
  - Priority ordering remains `orderBy: [{ priority: "asc" }, ...]`.
  - With the Prisma/PostgreSQL enum declaration order (`low`, `medium`, `high`, `critical`), ascending enum order is the reverse of the required business order (`critical`, `high`, `medium`, `low`).
  - `lib/priority.ts` defines `PRIORITY_ORDER` but is unused.
  - Trainee noted “priority sorting is reversed” in SUBMISSION.md but did not change ordering logic.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` where clause (`lt` + `notIn`) is correct; `orderBy.priority: "asc"` is incorrect for business priority rank
- Submission.md consistency: Partially Accurate
  - Correctly identified dueDate direction and active-status filter issues; claimed reversed priority sorting but left ordering unfixed.

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 11 / 15
- What the trainee changed:
  - Priority aggregate fixed from `COUNT("assignedTo")` to `COUNT(*)`.
  - `overdueActive` count now excludes `resolved` and `closed`.
- What is correct:
  - Total count via `prisma.ticket.count()`.
  - Status grouping uses `COUNT(*)` / `GROUP BY status`.
  - Priority grouping now counts all tickets, not only those with `assignedTo`.
  - Overdue active count uses `dueDate < now` and excludes resolved/closed.
  - No fixture-hardcoded statistics values.
- What is incomplete or incorrect:
  - Results are built with `Object.fromEntries(...)` from grouped rows only.
  - Missing statuses or priorities with zero tickets are omitted; no zero-filled normalization for expected keys (`open`, `in_progress`, `resolved`, `closed` and `low`, `medium`, `high`, `critical`).
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` return maps grouped rows directly without initializing full key sets
- Submission.md consistency: Not Mentioned
  - SUBMISSION.md does not clearly describe the `COUNT("assignedTo")` bug, overdueActive filter fix, or zero-normalization requirement.

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None (visible tests unchanged vs challenge baseline)
- Quality of tests: Stock visible suite retained; no trainee-authored regression tests
- Runtime verification limitations:
  - Dependencies not installed; Docker/PostgreSQL not verified in this evaluation.
  - Trainee reported tests not running due to Docker and left Commands Run empty.

## Code Quality Review

- Error handling: Overdue/statistics sanitize 500s; tickets index still leaks raw `error.message` on internal failures. Method handling on index remains incorrect (400, no Allow).
- Validation: Existing validation helpers reused; no validation regressions observed in scoped files.
- Query safety: Prisma/`$queryRaw` usage remains parameterized/static SQL; no string-concatenated user input observed.
- Readability: Changes are small and localized.
- Minimality of change: Mostly minimal; also added `.gitignore` and a large `package-lock.json` outside the planted-issue scope.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - SUBMISSION.md claims priority sorting was a bug but ordering code was not fixed.
  - SUBMISSION.md documents a local `DATABASE_URL` with credentials (`postgresql://postgres:admin@localhost:5432`).
  - Commands Run / Tests Added sections are empty while implying environment blockers.
  - Final Confidence Level left as unresolved “Low / Medium / High”.
  - No skipped/`only` tests or weakened assertions detected in scoped test files.

## Submission.md Review

- Bugs identified correctly: Partial — dueDate direction and active status filter identified; priority reverse identified but unfixed; HTTP method/error safety misframed as missing returns; statistics/zero-normalization poorly documented.
- Root causes explained correctly: Weak — “missing return statements” and “docker not being setup” do not explain the planted defects.
- Claims supported by code: Partial — dueDate/status/COUNT/overdueActive changes are present; return-statement narrative and priority-sort claim are not supported as complete fixes.
- AI usage declared: Yes (stated no AI tools used)
- Known issues disclosed: Effectively empty / not useful
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 11 / 20
- Functional correctness of planted issues: 21 / 40
- Testing and verification: 2 / 10
- Code quality and safety: 6 / 10
- Submission quality and engineering judgment: 5 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 45 / 90

## Final Evaluator Summary

The trainee correctly identified and fixed the core overdue date/status filter bugs and two statistics defects (`COUNT(*)` and overdueActive status exclusion). Issue 1 was not meaningfully addressed: the tickets index still returns 400 without an Allow header and still exposes internal error messages. Priority business ordering was recognized in writing but left as Prisma enum `asc`, which does not match critical→high→medium→low. Zero-key normalization for statistics was not implemented. The strongest part of the submission is the focused repository query fixes for overdue filtering and priority counting. The most important gap is incomplete overdue ordering plus untouched HTTP method/error-safety requirements, combined with a weak and partially inaccurate SUBMISSION.md. A viva is recommended to confirm whether the trainee understands enum ordering versus business priority ranking and the remaining HTTP/error-contract requirements.

## Recommended Viva Question

In `listOverdueTickets`, you keep `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`. Given the Prisma `Priority` enum order `low, medium, high, critical`, what result order does `priority: "asc"` produce, and how would you implement the required business order `critical → high → medium → low` without hardcoding fixture titles?
