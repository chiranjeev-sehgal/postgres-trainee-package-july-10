# Submission

## Trainee Details
Name:Omar Khan
Batch: 
Database Track: PostgreSQL
Repository:
Branch:
Final Commit SHA:

## Bugs Identified
in ticketRepository.ts - COUNT(assignedTo) will not work because assignedTo is nullable, so we use COUNT(*) instead
and in the same file - we changed gt to lt as - only those tickets whose dueDate is less than the current time are considered overdue
 status was changed to not closed - as only thse tics that are not closed are considered active, so we only count those tickets that are not closed
        
## Root Causes
in ticketRepository.ts - COUNT(assignedTo) will not work because assignedTo is nullable, so we use COUNT(*) instead
and in the same file - we changed gt to lt as - only those tickets whose dueDate is less than the current time are considered overdue
 status was changed to not closed - as only thse tics that are not closed are considered active, so we only count those tickets that are not closed
        
## Files Changed
ticketRepository.ts
## Tests Added or Updated

## Commands Run
npm install , npm run prisma:migrate
## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes / No

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
