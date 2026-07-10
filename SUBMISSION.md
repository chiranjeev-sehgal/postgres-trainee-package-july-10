# Submission

## Trainee Details
Name: Tanya Mishra
Batch: Postgres
Database Track: PostgreSQL
Repository:https://github.com/chiranjeev-sehgal/postgres-trainee-package-july-10.git
Branch: KT3-V8L-Q7F
Final Commit SHA:

## Bugs Identified
 1) Changed DATABASE_URL in .env broke the local Postgres connection.
 2) POST /api/tickets returned a 500 error instead of a 400 (bad input) when someone sent an invalid dueDate.
 3) Older prisma version was used
 4) ticket creation body was returning string it should return in json

## Root Causes
1) The new DATABASE_URL didn't match the username, database name so Prisma couldn't connect.
2) The error-handling code in index.ts only recognized validation errors if the message contained the word "Invalid" (or "required" or "single value").

## Files Changed
1) .env
2) lib/validation.ts"

## Tests Added or Updated

## Commands Run

## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes / No

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
