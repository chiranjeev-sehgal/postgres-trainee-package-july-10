# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Not Provided (SUBMISSION.md `Name` field is blank; Git author on fix commits is Yudhishter Kumar)
- Trainee ID: Not Provided (branch name `PM7-C4Z-N9H` may be the intended ID; SUBMISSION.md left Branch/Final Commit SHA blank)
- Database Track: PostgreSQL
- Branch: PM7-C4Z-N9H
- Final Commit: 293889faba9d8abdc6b0811032541de2c29f1598

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not present; packages were not installed per instructions.
  - `npm run typecheck`, `npm run lint`, `npm run test:visible`, and `npm run build` were not executed.
  - PostgreSQL runtime verification was unavailable; scoring is based on static review of scoped files and trainee commits against the planted base (`e235676`).

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Not Addressed
- Score: 1 / 10
- What the trainee changed:
  - In `pages/api/tickets/index.ts`, `overdue.ts`, and `statistics.ts`, moved `return` to precede `response.status(...).json(...)` / `createApiError(...)` (style/control-flow cleanup only).
- What is correct:
  - GET and POST paths still exist on the tickets index handler.
  - Unsupported-method responses still use a JSON `{ success: false, error: { code, message } }` shape.
- What is incomplete or incorrect:
  - Unsupported methods on the tickets index still return HTTP **400** with code `METHOD_NOT_ALLOWED` instead of **405**.
  - No `Allow: GET, POST` header is set on the unsupported-method path in `index.ts`.
  - Internal errors still return `error.message` to the client (`message: error instanceof Error ? error.message : "Unexpected error"`), which can expose internal details.
  - The claimed “missing/wrong return” was not the planted defect for method handling or error safety.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method block (~lines 66–75) returns status 400 without `Allow`; catch block (~lines 92–98) forwards raw `error.message`
- Submission.md consistency: Partially Accurate

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - No functional changes to `listOverdueTickets` in `repositories/ticketRepository.ts`.
  - `pages/api/tickets/overdue.ts` only received the same return-style cleanup as Issue 1.
- What is correct:
  - Optional priority query validation remains wired through `validatePriority` in the overdue API handler.
  - Within equal priority, `dueDate: "asc"` would be correct if the rest of the query were fixed.
- What is incomplete or incorrect:
  - `dueDate` filter still uses `gt: now` (future due dates) instead of due before now (`lt`).
  - Status filter is `not: "closed"` only; it still includes `resolved` and does not restrict to `open` / `in_progress`.
  - Ordering uses Prisma enum `priority: "asc"` (alphabetical: critical, high, low, medium), not business order critical → high → medium → low.
  - Existing `PRIORITY_ORDER` in `lib/priority.ts` is unused.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` (`dueDate.gt`, `status.not: "closed"`, `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`)
- Submission.md consistency: Not Mentioned

## Issue 3 — Statistics and Zero Normalization

- Status: Partially Addressed
- Score: 7 / 15
- What the trainee changed:
  - Changed priority aggregation from `COUNT("assignedTo")` to `COUNT(*)` so tickets with null `assignedTo` are included.
  - Added an identity `try/catch` that rethrows, plus inline map parameter type annotations (no behavioral benefit).
- What is correct:
  - Total count via `prisma.ticket.count()` remains correct.
  - Status grouping uses `COUNT(*)` and `GROUP BY status`.
  - Fixing `COUNT("assignedTo")` → `COUNT(*)` correctly addresses a real undercount for null assignees and matches the SUBMISSION.md claim for that bug.
- What is incomplete or incorrect:
  - No zero-normalization for missing status/priority keys (`open` / `in_progress` / `resolved` / `closed` and `low` / `medium` / `high` / `critical`); results are only whatever `GROUP BY` returns.
  - `overdueActive` still counts all tickets with `dueDate < now` and does **not** exclude `resolved` / `closed`.
  - No use of predefined zero-filled objects before merging grouped counts.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` — priority `COUNT(*)` fix; `byStatus`/`byPriority` built only from `Object.fromEntries(...)`; `overdueActive` count without status filter
- Submission.md consistency: Partially Accurate

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent; no test commands reported in SUBMISSION.md)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None (SUBMISSION.md: “no test were added”; visible test files unchanged vs challenge baseline for assertions)
- Quality of tests: N/A for trainee-authored tests; stock visible tests remain intact (no `skip` / `only` / weakened assertions found in scoped test files)
- Runtime verification limitations: Dependencies not installed; PostgreSQL not exercised; evaluation is static only

## Code Quality Review

- Error handling: Index handler still leaks internal `error.message` on 500; overdue/statistics handlers correctly sanitize 500 messages, but that was pre-existing. Trainee added a no-op `catch { throw error }` in statistics repository code.
- Validation: Existing validators unchanged and still used for status/priority/required fields.
- Query safety: Raw SQL remains parameterized template literals (acceptable); overdue/statistics query predicates remain logically wrong.
- Readability: Changes are small and readable; the try/catch rethrow adds noise.
- Minimality of change: Mostly minimal, but the only substantive fix is the priority `COUNT(*)` change; return reshuffling and type annotations do not fix planted issues.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - SUBMISSION.md AI field is ambiguous (“Yes / No” prompt answered with “yes”).
  - Trainee ID, Name, Branch, and Final Commit SHA fields in SUBMISSION.md were left blank despite filled Git history.
  - No evidence of hardcoded API responses, fixture arrays replacing DB logic, skipped tests, or assertion weakening in scoped files.
  - Package-lock was introduced in a fix commit (`7cad143`); unrelated to planted API defects but increases noise in the submission history.

## Submission.md Review

- Bugs identified correctly: Partially — correctly noted `COUNT("assignedTo")` undercounting null assignees; incorrectly framed “return placement” and “type missing” as primary bugs; did not identify overdue `gt`/status/order bugs, 405/`Allow`, error sanitization, zero-fill, or overdueActive status filtering.
- Root causes explained correctly: Partially — assignee count explanation is accurate; return/type explanations do not match the planted HTTP/statistics defects.
- Claims supported by code: Partially — `COUNT(*)` change is present; return reshuffling is present but does not achieve claimed method/error correctness; “type missing” claim does not map to a real planted defect.
- AI usage declared: Ambiguous (“yes” without clear Yes/No selection)
- Known issues disclosed: None listed (section blank) despite multiple remaining defects
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 7 / 20
- Functional correctness of planted issues: 8 / 40
- Testing and verification: 1 / 10
- Code quality and safety: 4 / 10
- Submission quality and engineering judgment: 3 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 23 / 90

## Final Evaluator Summary

The trainee correctly identified one real statistics defect (`COUNT("assignedTo")` skipping null assignees) and fixed it with `COUNT(*)`, which is the strongest part of the submission. The three planted categories were otherwise largely missed: HTTP method handling still returns 400 without an `Allow` header and still exposes internal error messages; overdue filtering/ordering was never changed and remains inverted/incomplete; statistics still lack zero-key normalization and active-overdue status filtering. SUBMISSION.md is incomplete (blank name/ID/branch/SHA), weak on verification, and overstates the significance of return-statement and type-annotation changes. A viva is recommended to confirm whether the trainee understands the remaining overdue and HTTP-contract defects versus coincidental style edits. Ask specifically about the overdue query predicates and priority ordering in `listOverdueTickets`.

## Recommended Viva Question

In `repositories/ticketRepository.ts` `listOverdueTickets`, the code filters with `dueDate: { gt: now }`, `status: { not: "closed" }`, and `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`. Explain what tickets that query returns today, what it should return for overdue active tickets, and how you would implement critical → high → medium → low ordering without relying on alphabetical enum sort.
