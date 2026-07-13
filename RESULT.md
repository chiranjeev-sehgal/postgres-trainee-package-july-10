# Hackathon Evaluation Result

## Submission Identity

- Trainee ID: Not Provided
- Name: Aryan Bhutani
- Database Track: PostgreSQL
- Branch: QF9-D4R-T8K
- Final Commit: 68e74a2e1ff02fbf02dced483dd4df8b34ac861a

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` is not installed, so `npm run typecheck`, `lint`, `test:visible`, and `build` could not be executed.
  - Runtime PostgreSQL verification was unavailable; assessment is based on static review of scoped files and git history.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Partially Addressed
- Score: 4 / 10
- What the trainee changed:
  - In `pages/api/tickets/index.ts`, added `Allow: GET, POST` and a `405` JSON response for unsupported methods.
  - Added optional string-body `JSON.parse` for POST, but only used the parsed `body` for `title`.
  - Left debug `console.log` calls in the POST path and in `lib/validation.ts`.
- What is correct:
  - Unsupported methods now attempt to return `405` with `METHOD_NOT_ALLOWED`.
  - `Allow` is set to `GET` and `POST`.
  - Response shape remains a consistent `{ success: false, error: { code, message } }` object for the method-not-allowed path.
- What is incomplete or incorrect:
  - The original `400` method-not-allowed response was left immediately after the new `405` response, so headers/body may be written twice.
  - Internal error sanitization was not fixed: `500` still returns `error.message`, which can expose internal details.
  - Body parsing is incomplete and not one of the planted defect categories; `description`, `status`, `priority`, `dueDate`, and `assignedTo` still read `request.body` directly. The trainee’s own known-issue note shows `dueDate is required` remaining after the partial parse.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method block (`setHeader("Allow")` + `status(405)` followed by leftover `status(400)`); catch block still uses `error.message` for `INTERNAL_ERROR`
- Submission.md consistency: Partially Accurate

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - No meaningful fix to overdue filtering or ordering. `pages/api/tickets/overdue.ts` is unchanged. `listOverdueTickets` in `repositories/ticketRepository.ts` retains the planted defects.
- What is correct:
  - Optional priority filter wiring in the overdue route remains present and validates priority.
  - Invalid priority rejection path in the overdue handler remains intact.
- What is incomplete or incorrect:
  - Still uses `dueDate: { gt: now }` instead of due dates before current time (`lt`).
  - Still excludes only `closed`, not `resolved`; does not restrict to `open` / `in_progress`.
  - Still orders by Prisma enum `priority: "asc"` instead of business order `critical > high > medium > low` (existing `PRIORITY_ORDER` in `lib/priority.ts` is unused).
  - Within-priority `dueDate: "asc"` alone cannot compensate for incorrect priority ranking.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` (`dueDate.gt`, `status.not: "closed"`, `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`)
- Submission.md consistency: Not Mentioned

## Issue 3 — Statistics and Zero Normalization

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - Only change in statistics path: `COUNT("assignedTo")::bigint` became `COUNT("assignedTo")::text` in `getTicketStatistics`.
- What is correct:
  - Total ticket count via `prisma.ticket.count()` remains present.
  - Status grouping query still uses `COUNT(*)` and `GROUP BY status`.
- What is incomplete or incorrect:
  - No zero-filled normalization for missing status/priority keys.
  - Priority count still uses `COUNT("assignedTo")` instead of `COUNT(*)`, undercounting tickets with null assignees.
  - Casting count to `::text` while typing rows as `bigint` is incorrect and does not fix aggregation.
  - `overdueActive` still counts all past-due tickets with no exclusion of `resolved` / `closed`.
  - Hardcoded fixture values were not introduced, but the planted calculation bugs remain.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` (raw status/priority aggregates, overdue `count` without status filter, `Object.fromEntries` without zero defaults)
- Submission.md consistency: Not Mentioned

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` missing)
- Typecheck result: Not run (`node_modules` missing)
- Lint result: Not run (`node_modules` missing)
- Build result: Not run (`node_modules` missing)
- Tests added or changed: None observed in scoped visible test files
- Quality of tests: Existing visible tests were left intact; trainee relied on manual Postman checks rather than the provided suite
- Runtime verification limitations:
  - Dependencies not installed; PostgreSQL runtime checks not performed.
  - Static review is sufficient to show Issues 2 and 3 remain broken and Issue 1 is only partly fixed.

## Code Quality Review

- Error handling: Method path improved toward `405`, but duplicate `400` remains; `500` still leaks `error.message` on the tickets index route.
- Validation: Existing validators unchanged aside from debug logging; POST field reads are inconsistent after partial body parse.
- Query safety: Prisma/`$queryRaw` usage remains parameterized; no injection introduced. Overdue/statistics query logic remains incorrect.
- Readability: Formatting noise, commented-out code, and leftover `console.log` statements reduce clarity.
- Minimality of change: Small surface area, but aimed at the wrong primary problem and introduced a harmful statistics cast change.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - Debug `console.log` left in API and validation paths.
  - Incomplete body-parse change claims to fix POST while other fields still use unparsed `request.body`.
  - Residual `400` response after newly added `405`.
  - Statistics `COUNT(... )::text` change looks mistaken relative to `RawGroupedCount` typing.
  - No skipped tests, `test.only`, assertion weakening, hardcoded API payloads, or static fixture arrays replacing DB logic.

## Submission.md Review

- Bugs identified correctly: No for the three planted categories. Trainee focused on request-body string parsing for POST title validation.
- Root causes explained correctly: Partially for a local POST symptom; not for method/status handling, overdue query, or statistics normalization.
- Claims supported by code: Partially. Body parse for `title` exists; claimed success conflicts with acknowledged remaining `dueDate` failures and with other fields still reading `request.body`. Suggested `createTicket` `JSON.stringify` alternative was not applied in repository code.
- AI usage declared: Yes — stated no AI tools were used.
- Known issues disclosed: Yes — remaining `dueDate is required` on POST is acknowledged.
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 3 / 20
- Functional correctness of planted issues: 4 / 40
- Testing and verification: 2 / 10
- Code quality and safety: 3 / 10
- Submission quality and engineering judgment: 5 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 17 / 90

## Final Evaluator Summary

The trainee identified one POST body-parsing symptom and did not correctly identify the three planted defect categories (HTTP method/error safety, overdue filtering/ordering, and statistics zero normalization). Only Issue 1 was partially touched by adding `405` and an `Allow` header; the leftover `400` response and unsanitized `500` error messages mean that issue is incomplete. Issues 2 and 3 remain fully broken in `listOverdueTickets` and `getTicketStatistics`, including inverted due-date comparison, incomplete status filtering, wrong priority ordering, missing zero-fill, incorrect priority counting, and unfiltered overdue stats. The strongest part of the submission is honest disclosure of AI non-use and a remaining due-date failure. The most important gap is missing the planted repository query defects entirely. A viva is recommended to confirm whether the trainee can reason about the actual overdue and statistics bugs versus the body-parse detour.

## Recommended Viva Question

In `listOverdueTickets`, why is `dueDate: { gt: now }` with `status: { not: "closed" }` and `orderBy: { priority: "asc" }` incorrect for “active overdue tickets ordered critical → high → medium → low, then oldest due date,” and how would you fix each part without hardcoding fixture titles?
