import type { Prisma, Priority, Status, Ticket } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getControlledNow } from "@/lib/time";

export type ListTicketFilters = {
  status?: Status;
  priority?: Priority;
  assignedTo?: string;
};

type RawGroupedCount = {
  key: string;
  count: bigint;
};

export async function listTickets(filters: ListTicketFilters): Promise<Ticket[]> {
  const prisma = getPrisma();
  const where: Prisma.TicketWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.assignedTo) {
    where.assignedTo = filters.assignedTo;
  }

  return prisma.ticket.findMany({
    where,
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function createTicket(data: Prisma.TicketCreateInput): Promise<Ticket> {
  return getPrisma().ticket.create({ data });
}

export async function listOverdueTickets(priority?: Priority): Promise<Ticket[]> {
  const prisma = getPrisma();
  const now = getControlledNow();

  return prisma.ticket.findMany({
    where: {
      dueDate: {
        lt: now   // only those tickets whose dueDate is less than the current time are considered overdue
      },
      status: {
        not: "closed"
      },
      ...(priority ? { priority } : {})
    },
    orderBy: [
      {
        priority: "asc"
      },
      {
        dueDate: "asc"
      }
    ]
  });
}

export async function getTicketStatistics(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  overdueActive: number;
}> {
  const prisma = getPrisma();
  const now = getControlledNow();

  const [total, statusCounts, priorityCounts, overdueActive] = await Promise.all([
    prisma.ticket.count(),
    prisma.$queryRaw<RawGroupedCount[]>`
      SELECT status::text AS key, COUNT(*)::bigint AS count
      FROM "Ticket"
      GROUP BY status
    `,
    prisma.$queryRaw<RawGroupedCount[]>`
      SELECT priority::text AS key, COUNT(*)::bigint AS count 
      FROM "Ticket"
      GROUP BY priority
    `,  // COUNT(*) AS COUNT(assignedTo) will not work because assignedTo is nullable, so we use COUNT(*) instead
    prisma.ticket.count({
      where: {
        dueDate: {
          lt: now
        },
        status: {
          not: "closed"  // only thse tics that are not closed are considered active, so we only count those tickets that are not closed
        }
      }
    })
  ]);

  return {
    total,
    byStatus: Object.fromEntries(statusCounts.map((row) => [row.key, Number(row.count)])),
    byPriority: Object.fromEntries(priorityCounts.map((row) => [row.key, Number(row.count)])),
    overdueActive
  };
}
