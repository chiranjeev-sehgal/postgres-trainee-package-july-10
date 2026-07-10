import { getPrisma, disconnectPrisma } from "@/lib/prisma";
import { ticketFixtures } from "@/tests/helpers/fixtures";

async function main(): Promise<void> {
  const prisma = getPrisma();
  await prisma.ticket.deleteMany();
  await prisma.ticket.createMany({
    data: ticketFixtures
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectPrisma();
  });