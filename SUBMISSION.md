# Submission

## Trainee Details
Name:Aditya Mishra
Batch: Akash Sir
Database Track: PostgreSQL
Repository:https://github.com/chiranjeev-sehgal/postgres-trainee-package-july-10
Branch:RM8-V2C-J6W
Final Commit SHA:

## Bugs Identified
- Imporved the indexing by changing it to have more prominent or dividing column in the start
CREATE INDEX "Ticket_status_dueDate_idx" ON "Ticket"("dueDate", "status");
Instead of 
CREATE INDEX "Ticket_status_dueDate_idx" ON "Ticket"("status", "dueDate");

Removed Last Index crTicket_createdAt_idx and tried fitting it using the previous index by swapping 
CREATE INDEX "Ticket_assignedTo_createdAt_idx" ON "Ticket"("createdAt", "assignedTo");
the order

- Changed datatype of assignedTo on line 86 of ticketRepository from bigInt to Text since assignedTo is String.

- Changed assignedTo on line 30 page.ts , earlier it was left blank. Did so as the listTicket function required it as param.

- changed gt to lt since we need less than due date line 51 , ticketRepository

- Added status: {
        not: "closed"
      }
      In tickeRepository to check for status

## Root Causes

## Files Changed
- pages/api/tickets/index.ts
- repositories/ticketRepository.ts
- prisma/migrations/migrations.sql


## Tests Added or Updated

## Commands Run
- prisma commands to populate database.
- npm run dev to open website and built to check the pages


## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes 

## Known Remaining Issues

There is issue with parsing of data due to which post method give error, unable to resolve it.

## Final Confidence Level
Medium
