# Submission

## Trainee Details
Name: Arimardan Pandey Saurabh
Batch: Python (Aakash Sir)
Database Track: PostgreSQL
Repository:
Branch:
Final Commit SHA:

## Bugs Identified
- very first problem i have identified the prisma is used here is older version ... i guess on around november 20 the prisma updated their version and made siginificant chnages and their initial setup steps due to which .generate file is not created and throwing error
- The tests could not start PostgreSQL because Docker was not available.
- `listOverdueTickets` was using the wrong date comparison and sorting order.
- Priority counts were wrong because the SQL query counted only rows with `assignedTo` instead of all tickets.
- `overdueActive` did not ignore tickets that were already `closed`.
- `tsconfig.json` had a bad TypeScript setting (`ignoreDeprecations`).
- Prisma config had a missing type warning because Prisma does not ship types for that helper.

## Root Causes
- The test setup expects Docker/Testcontainers, but the local environment did not have a working container runtime.
- The ticket repository logic was not matching the test expectations for overdue tickets and priority counts.
- The SQL query used the wrong COUNT expression.
- TypeScript configuration had an invalid option for the current compiler.
- Prisma configuration code needs a type declaration that is not provided by default.

## Files Changed
- `prisma.config.ts`
- `repositories/ticketRepository.ts`
- `tsconfig.json`
- `tests/helpers/testContainer.ts`

## Tests Added or Updated
No new tests were added. I worked with the existing visible tests and fixed code to match their behavior.

## Commands Run
- `npm run typecheck` — checked TypeScript errors and fixed them.
- `npm run lint` — checked code style.
- `npm test` — ran the visible tests; they still need Docker to run successfully.
- `npm run prisma:generate` — generated Prisma client types.
- `npm run prisma:migrate` and `npm run prisma:seed` — recommended for preparing the database before running tests.

## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge:: Yes

## Known Remaining Issues
- The visible test suite still needs a working Docker runtime. If Docker is not running, tests will fail.
- A better fix would be adding a Prisma config type declaration file to remove `// @ts-ignore` from `prisma.config.ts`.

## Final Confidence Level
Medium
