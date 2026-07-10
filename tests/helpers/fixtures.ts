import type { Prisma, Priority, Status } from "@prisma/client";
import { DEFAULT_REFERENCE_NOW } from "@/lib/time";

export const FIXTURE_REFERENCE_NOW = DEFAULT_REFERENCE_NOW;

const baseNow = new Date(FIXTURE_REFERENCE_NOW);

function daysFromNow(days: number): string {
  return new Date(baseNow.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

export const ticketFixtures: Prisma.TicketCreateManyInput[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Restore admin export",
    description: "CSV export fails for finance managers.",
    status: "open",
    priority: "critical",
    assignedTo: "alex",
    dueDate: daysFromNow(-5),
    createdAt: daysFromNow(-15),
    updatedAt: daysFromNow(-10)
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Patch intake validation",
    description: "Blank intake notes are slipping into the queue.",
    status: "open",
    priority: "high",
    assignedTo: null,
    dueDate: daysFromNow(-2),
    createdAt: daysFromNow(-14),
    updatedAt: daysFromNow(-8)
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "Retry failed settlement sync",
    description: "Settlement sync needs a safer retry strategy.",
    status: "in_progress",
    priority: "medium",
    assignedTo: "morgan",
    dueDate: daysFromNow(-1),
    createdAt: daysFromNow(-13),
    updatedAt: daysFromNow(-3)
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    title: "Document incident timeline",
    description: "Resolved ticket retained for audit review.",
    status: "resolved",
    priority: "low",
    assignedTo: "casey",
    dueDate: daysFromNow(-4),
    createdAt: daysFromNow(-12),
    updatedAt: daysFromNow(-2)
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    title: "Close storefront rollback",
    description: "Historical closed item with past due date.",
    status: "closed",
    priority: "high",
    assignedTo: null,
    dueDate: daysFromNow(-6),
    createdAt: daysFromNow(-11),
    updatedAt: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    title: "Prepare partner launch",
    description: "Launch checklist still active and future due.",
    status: "open",
    priority: "medium",
    assignedTo: "alex",
    dueDate: daysFromNow(2),
    createdAt: daysFromNow(-10),
    updatedAt: daysFromNow(-1)
  },
  {
    id: "00000000-0000-4000-8000-000000000007",
    title: "Tune cache invalidation",
    description: "Active future-due ticket for same priority ordering checks.",
    status: "in_progress",
    priority: "medium",
    assignedTo: null,
    dueDate: daysFromNow(4),
    createdAt: daysFromNow(-9),
    updatedAt: daysFromNow(-1)
  }
];

export const reducedTicketFixtures: Prisma.TicketCreateManyInput[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    title: "Review billing copy",
    description: "Reduced fixture omits some categories intentionally.",
    status: "open",
    priority: "critical",
    assignedTo: "jordan",
    dueDate: daysFromNow(-1),
    createdAt: daysFromNow(-3),
    updatedAt: daysFromNow(-2)
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    title: "Queue accessibility audit",
    description: "Reduced fixture keeps an active future task.",
    status: "in_progress",
    priority: "high",
    assignedTo: null,
    dueDate: daysFromNow(3),
    createdAt: daysFromNow(-2),
    updatedAt: daysFromNow(-1)
  }
];

export const allStatuses: Status[] = ["open", "in_progress", "resolved", "closed"];
export const allPriorities: Priority[] = ["low", "medium", "high", "critical"];
