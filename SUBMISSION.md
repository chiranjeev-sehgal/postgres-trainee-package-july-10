# Submission

## Trainee Details
Name: Pulkit
Batch: Aakash Sir
Database Track: PostgreSQL
Repository: https://github.com/chiranjeev-sehgal/postgres-trainee-package-july-10/tree/LN4-Z7Q-H2V
Branch:LN4-Z7Q-H2V
Final Commit SHA:

## Bugs Identified
1. changed count("assigned_to") to COUNT(*) in line 86 of file ticketRepository.ts to get all tickets as one ticket wasnt assigned to anyone so it wasnt being counted using "assigned_to"
2. added status: { notIn: ["closed","resolved"] } in line 95 of ticketRepository.ts in order to get only those tickets which are not closed and not resolved yet and are overdue.
3. changed gt: now to lt: now in line 51 of ticketRepository.ts in order to get correct overdue ticket count.
4. changed { not : closed } to { notIn: ["closed","resolved"] }  in line 96  in ticektRepository.ts to get tickets which are not closed or resolved.

## Root Causes

## Files Changed
ticketRepository.ts

## Tests Added or Updated

## Commands Run
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
npm run prisma:seed
npm run build

## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes

## Known Remaining Issues

## Final Confidence Level
High
