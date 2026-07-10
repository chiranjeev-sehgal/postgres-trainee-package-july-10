-- CreateEnum
CREATE TYPE "Status" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'open',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "assignedTo" TEXT,
    "dueDate" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ticket_status_dueDate_idx" ON "Ticket"("dueDate", "status");

-- CreateIndex
CREATE INDEX "Ticket_priority_dueDate_idx" ON "Ticket"("dueDate", "priority");

-- CreateIndex
CREATE INDEX "Ticket_assignedTo_createdAt_idx" ON "Ticket"("createdAt", "assignedTo");
