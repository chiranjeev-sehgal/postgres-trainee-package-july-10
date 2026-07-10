// Use the type of the fixtures array instead of importing Prisma types
import { disconnectPrisma, getPrisma } from "@/lib/prisma";
import { ticketFixtures } from "@/tests/helpers/fixtures";
import { startTestContainer } from "@/tests/helpers/testContainer";

export async function setupDatabase(): Promise<void> {
  await startTestContainer();
}

export async function resetDatabase(
  fixtures: typeof ticketFixtures = ticketFixtures
): Promise<void> {
  const prisma = getPrisma();
  await prisma.ticket.deleteMany();
  if (fixtures.length > 0) {
    await prisma.ticket.createMany({
      data: fixtures
    });
  }
}

export async function clearDatabase(): Promise<void> {
  await getPrisma().ticket.deleteMany();
}

export async function teardownDatabase(): Promise<void> {
  await disconnectPrisma();
}
