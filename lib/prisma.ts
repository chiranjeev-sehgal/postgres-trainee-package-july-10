import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __debuggingOlympicsPrisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.__debuggingOlympicsPrisma) {
    global.__debuggingOlympicsPrisma = new PrismaClient();
  }

  return global.__debuggingOlympicsPrisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (global.__debuggingOlympicsPrisma) {
    await global.__debuggingOlympicsPrisma.$disconnect();
    global.__debuggingOlympicsPrisma = undefined;
  }
}
