# Hackathon Evaluation Result

## Submission Identity

- Trainee Name: Tanya Mishra
- Trainee ID: Not Provided
- Database Track: PostgreSQL
- Branch: KT3-V8L-Q7F
- Final Commit: 88905d0b3e374b477646af6ad6b0ea2ef9025be2

## Evaluation Confidence

- Confidence: High
- Evidence Used:
  - Source code review
  - SUBMISSION.md
  - Tests
  - Git history
  - Build/typecheck/lint
- Verification Limitations:
  - `node_modules` was not present, so typecheck, lint, build, and visible tests were not executed.
  - Runtime PostgreSQL verification was unavailable for the same reason.
  - Evaluation relies on static review of scoped files and git diff against the challenge baseline.

## Issue 1 — HTTP Method Handling and Error Safety

- Status: Partially Addressed
- Score: 2 / 10
- What the trainee changed:
  - Only code change in scoped files: `lib/validation.ts` — empty `dueDate` error message changed from `` `${fieldName} is required` `` to `` `Invalid ${fieldName} is required` ``.
  - No changes to `pages/api/tickets/index.ts` method handling or error sanitization.
- What is correct:
  - Trainee partially noticed that index error handling keys off substrings in error messages (`Invalid` / `required` / `single value`).
  - GET and POST paths themselves remain structurally present.
- What is incomplete or incorrect:
  - Unsupported methods still return HTTP 400 with `METHOD_NOT_ALLOWED`, not 405.
  - No `Allow: GET, POST` header is set on the tickets index route.
  - Internal errors still expose `error.message` in the 500 JSON body (unsafe exposure risk).
  - The validation tweak does not fix invalid ISO dates: message `"dueDate must be a valid ISO date"` still fails the substring checks and remains a 500.
  - Empty `dueDate` already matched `"required"` before the change, so the edit is largely a non-fix / superficial workaround.
- Evidence:
  - file: `pages/api/tickets/index.ts`
  - relevant function or logic: unsupported-method branch returns `status(400)`; catch block returns raw `error.message` on 500; validation substring matching unchanged
  - file: `lib/validation.ts`
  - relevant function or logic: `validateIsoDate` message prefix change only
- Submission.md consistency: Partially Accurate

## Issue 2 — Overdue Filtering and Priority Ordering

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - No changes to `pages/api/tickets/overdue.ts` or `repositories/ticketRepository.ts` `listOverdueTickets`.
- What is correct:
  - Optional priority filter wiring and invalid-priority rejection path in the overdue handler remain available via `validatePriority`.
- What is incomplete or incorrect:
  - Query still uses `dueDate: { gt: now }` (future tickets) instead of before now (`lt`).
  - Status filter excludes only `closed`, not `resolved`; active overdue should include open/in_progress and exclude resolved/closed.
  - Ordering uses Prisma enum `priority: "asc"` (alphabetical), not business order critical → high → medium → low; `lib/priority.ts` `PRIORITY_ORDER` is unused.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `listOverdueTickets` — `dueDate.gt`, `status.not: "closed"`, `orderBy: [{ priority: "asc" }, { dueDate: "asc" }]`
- Submission.md consistency: Not Mentioned

## Issue 3 — Statistics and Zero Normalization

- Status: Not Addressed
- Score: 0 / 15
- What the trainee changed:
  - No changes to `pages/api/tickets/statistics.ts` or `getTicketStatistics`.
- What is correct:
  - Total count via `prisma.ticket.count()` is present.
  - Status grouping uses `COUNT(*)` which is directionally correct for present keys.
- What is incomplete or incorrect:
  - No zero-filled normalization for all expected status keys (`open`, `in_progress`, `resolved`, `closed`).
  - No zero-filled normalization for all expected priority keys (`low`, `medium`, `high`, `critical`).
  - Priority aggregation uses `COUNT("assignedTo")`, which undercounts tickets with null assignees.
  - `overdueActive` counts all tickets with `dueDate < now` and does not exclude `resolved`/`closed`.
- Evidence:
  - file: `repositories/ticketRepository.ts`
  - relevant function or logic: `getTicketStatistics` — raw GROUP BY without zero fill; `COUNT("assignedTo")`; overdue count without status exclusion
- Submission.md consistency: Not Mentioned

## Test and Verification Review

- Visible tests executed: No
- Visible test result: Not run (`node_modules` absent)
- Typecheck result: Not run
- Lint result: Not run
- Build result: Not run
- Tests added or changed: None (visible tests unchanged; git diff shows no test file edits)
- Quality of tests: N/A for trainee-authored tests; baseline visible tests remain intact with meaningful assertions and no `.only`/`.skip`
- Runtime verification limitations:
  - Dependencies not installed; PostgreSQL runtime and Jest suite not executed.
  - Static analysis of repository queries is sufficient to conclude Issues 2 and 3 remain broken against the stated expected behavior.

## Code Quality Review

- Error handling: Still brittle substring matching; 500 responses can leak internal messages; method handling incorrect on tickets index.
- Validation: Existing validators remain; `validateIsoDate` tweak is a symptom-oriented message edit, not a robust mapping of validation failures to 400.
- Query safety: Prisma/`$queryRaw` remain parameterized; no SQL injection introduced. Overdue/statistics business logic still incorrect.
- Readability: Unchanged; original structure preserved.
- Minimality of change: Extremely minimal (one error-string edit) — too minimal relative to planted defects.
- Hardcoding detected: No
- Static database bypass detected: No
- Test manipulation detected: No
- Integrity flags:
  - SUBMISSION.md claims `.env` and Prisma-version / response-format fixes that are not evidenced in scoped application diffs.
  - AI usage left as unresolved `Yes / No`.
  - Final Commit SHA left blank in SUBMISSION.md despite commits existing on the branch.
  - No evidence of skipped/weakened tests or fixture hardcoding in API responses.

## Submission.md Review

- Bugs identified correctly: Partially — noted invalid `dueDate` producing 500 vs 400 and substring-based error handling; did not identify the three planted categories (405/Allow/sanitization, overdue filter/order, statistics/zero-fill). Listed environment/Prisma/version/JSON-shape items that are outside or unsupported by the code diff.
- Root causes explained correctly: Partially for validation message matching; inaccurate/incomplete overall.
- Claims supported by code: Weak — only `lib/validation.ts` (and SUBMISSION.md) appear in the challenge-relevant git diff; claimed `.env` / Prisma / JSON body fixes are not supported by scoped code changes.
- AI usage declared: No (placeholder left as `Yes / No`)
- Known issues disclosed: No (section empty)
- Documentation quality: Weak

## Preliminary Scoring

- Issue identification and root-cause understanding: 5 / 20
- Functional correctness of planted issues: 2 / 40
- Testing and verification: 1 / 10
- Code quality and safety: 3 / 10
- Submission quality and engineering judgment: 4 / 10
- Git discipline placeholder: Not Scored Here
- Completion-time placeholder: Not Scored Here

- Preliminary Technical Score: 15 / 90

## Final Evaluator Summary

The trainee (Tanya Mishra, PostgreSQL track) did not correctly identify or fix the three planted defect categories. The only application code change is a superficial rewrite of the empty-`dueDate` validation message; HTTP 405/Allow handling, error sanitization, overdue `dueDate`/`status`/priority ordering, and statistics zero-normalization remain broken as in the baseline. SUBMISSION.md partially describes a validation-error symptom and an accurate note about substring matching, but also claims environment and packaging fixes unsupported by the scoped diff, and leaves AI disclosure and verification commands incomplete. The strongest aspect is that the change set is small and does not manipulate tests or hardcode API results. The most important gap is failure to inspect and correct the repository query and route defects that the challenge targeted. A viva is recommended to distinguish environment troubleshooting from actual planted-bug diagnosis.

## Recommended Viva Question

In `pages/api/tickets/index.ts`, validation errors are detected with `error.message.includes("Invalid"|"required"|"single value")`. You changed `validateIsoDate` so a missing dueDate throws `Invalid dueDate is required` — explain what status code an invalid but non-empty dueDate such as `"not-a-date"` still produces, and how you would fix method handling (405 + Allow) and error sanitization without relying on brittle message substrings.
