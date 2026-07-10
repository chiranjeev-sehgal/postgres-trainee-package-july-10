# Submission

## Trainee Details
Name:
Batch:
Database Track: PostgreSQL
Repository:
Branch:
Final Commit SHA:

## Bugs Identified
commit 7cad1432c731ffe0ec1d83512bbdd689486dfeb1
return is either missing in pages/api/tickets or at wrong place in pages/api/tickets/ folder



## Root Causes
the return statement was missing in pages/api/tickets/index.ts file

## Files Changed
index.ts, overdue.ts, statistics.ts

## Tests Added or Updated
no test were added
## Commands Run
git commit -m "fix the return statement at correct postition in pages/api/tickets"


## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes / No
yes

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
