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

commit ad9307d3c9d7fc4ebe8639131dc3490c66f732a7
type missing in returns statement in ticketrepository.ts file

## Root Causes
the return statement was missing in pages/api/tickets/index.ts file
type was missing in returns statement in ticketrepository.ts file


## Files Changed
index.ts, overdue.ts, statistics.ts
ticketRepository.ts

## Tests Added or Updated
no test were added
## Commands Run
git commit -m "fix the return statement at correct postition in pages/api/tickets"
git commit -m "type missing in returns statement in ticketrepository.ts file"

## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes / No
yes

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
