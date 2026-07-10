# Submission

## Trainee Details
Name: Md Aaman
Batch:AI tranieers
Database Track: PostgreSQL
Repository: postgres
Branch: GH3-Q9V-L6T
Final Commit SHA: 

## Bugs Identified
# 1 database url error 
# 2 test case failed 
# 3 used older prisma 
# 4 there is some sort of undefined in query param passing the params 
# 5 there is BIGINT in repository we should use the TEXT

## Root Causes

# 1 the password needed - put our local url 
# 2 need docker to run test cases 
# 3 due to use of older prisma it shows error where we import the prisma client
# 4  in request body tittle is passed as string but there be in json this cause the undefined
# 5 because it goes to assginTo 


## Files Changed
# .env


## Tests Added or Updated

## Commands Run



## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes / No

## Known Remaining Issues

## Final Confidence Level
Low / Medium / High
