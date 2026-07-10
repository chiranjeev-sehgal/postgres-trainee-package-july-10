# Submission

## Trainee Details
Name:Aryan Bhutani
Batch: AI Trainees
Database Track: PostgreSQL
Repository: 
Branch: QF9-D4R-T8K
Final Commit SHA:

## Bugs Identified
1. Observed the body going as a string which was causing the issue of title being undefined after getting const title = validateRequiredString(request.body?.title, "title"); . As a result I was unable to Post new Tickets
## Root Causes
The main issue was body as a string while expecting a json. 
The issue was at line const title = validateRequiredString(request.body?.title, "title");. Observed this first, the issue might also be in the repositories folder where I am creating a ticket.


## Files Changed
index.ts 
 
## Tests Added or Updated
Updated Code: typeof request.body === "string"
    ? JSON.parse(request.body)
    : request.body;
      const title = validateRequiredString(body?.title, "title");

      Added proper body being parsed in Json before passing it to the validation files. 
This could also be changed by explicitly adding proper json.stringify at the create ticket function
 export async function createTicket(data: Prisma.TicketCreateInput): Promise<string> { 
  const ticket = await getPrisma().ticket.create({ data }); 
  return JSON.stringify(ticket);
}
## Commands Run
First added proper console statements using console.log on index.ts file and the validation file which helped me debug this code. After checking on postman when I hit a POST request at http://localhost:3000/api/tickets with body data as {
  "title": "TestTicket",
  "description": "Abcd test description",
  "status": "open",
  "priority": "high",
  "assignedTo": "alex",
  "dueDate":"2026-01-27T12:00:00.000Z"
}
It gave me  success in creating a new ticket POST /api/tickets 201 in 342ms
## AI Usage Confirmation
I confirm that I did not use AI tools during this challenge: Yes 

## Known Remaining Issues
The Due Date is still causing error on post {"timestamp":"2026-07-10T11:30:32.162Z","level":"error","message":"Tickets index handler failed","context":{"method":"POST"},"error":{"name":"Error","message":"dueDate is required"}} Will fix it in next commit
## Final Confidence Level
medium
