# Submission

## Trainee Details
Name: Jeraldin PJ
Batch: Arun Tyagi
Database Track: PostgreSQL
Repository:https://github.com/chiranjeev-sehgal/postgres-trainee-package-july-10/tree/NC6-W3Y-G7P
Branch:NC6-W3Y-G7P
Final Commit SHA:4df98397d189ff3cb56afc68ad02eb9d8f35a4c8

## Bugs Identified
function calls were not returning properly
added a gitignore file to ignore node_modules
dueDate was returning the future instead of the past.
active status filter not correct.
priority sorting is reversed.
Test cases are not running 
.env file had incorrect url correct - DATABASE_URL="postgresql://postgres:admin@localhost:5432"
## Root Causes
missing return statements
testcases are not running due to docker not being setup
## Files Changed
index.ts, overdue.ts, statistics.ts, ticketRepository.ts .env
## Tests Added or Updated

## Commands Run

## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
