# Submission

## Trainee Details
Name: medha bhardwaj
Batch: 
Database Track: PostgreSQL
Repository:
Branch: GH3-Q9V-L6T
Final Commit SHA:

## Bugs Identified 
3

line 51,testrepository.ts
since the function is overduetickets so its due date should be less than now not greater than now as the ticekts are overdue
so it was gt: now earlier now it lt

line 86, same file
doint count(assignedto) which is specific col name will not return null values so if we do count(*) it will return null values aswell

line 95, same file
added status not closed otherwise it will count the closed tickets as well so assing the status not closed will exclude them

## Root Causes

## Files Changed
testrepository.ts

## Tests Added or Updated

## Commands Run

## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes / No

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
