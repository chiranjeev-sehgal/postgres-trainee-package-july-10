import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";
import { GenericContainer, type StartedTestContainer, Wait } from "testcontainers";
import { disconnectPrisma } from "@/lib/prisma";
import { FIXTURE_REFERENCE_NOW } from "@/tests/helpers/fixtures";

let container: StartedTestContainer | undefined;
const runtimeDir = path.join(process.cwd(), ".tmp");
const stateFile = path.join(runtimeDir, "test-db-state.json");

function projectBin(binName: string): string {
  return `${process.cwd()}/node_modules/.bin/${binName}`;
}

function runPrismaCommand(args: string[]): void {
  execFileSync(projectBin("prisma"), args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "inherit"
  });
}

async function runPrismaCommandWithRetry(args: string[]): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      runPrismaCommand(args);
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  throw lastError;
}

async function canConnect(databaseUrl: string): Promise<boolean> {
  const client = new Client({
    connectionString: databaseUrl
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function startTestContainer(): Promise<void> {
  if (existsSync(stateFile)) {
    const state = JSON.parse(readFileSync(stateFile, "utf8")) as {
      databaseUrl: string;
      referenceNow: string;
    };
    if (await canConnect(state.databaseUrl)) {
      process.env.DATABASE_URL = state.databaseUrl;
      process.env.REFERENCE_NOW = state.referenceNow;
      await disconnectPrisma();
      return;
    }

    rmSync(stateFile, { force: true });
  }

  if (container) {
    return;
  }

  container = await new GenericContainer("postgres:16-alpine")
    .withEnvironment({
      POSTGRES_DB: "debugging_olympics_test",
      POSTGRES_USER: "postgres_debugger",
      POSTGRES_PASSWORD: "postgres_debugger_local_only"
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage("database system is ready to accept connections"))
    .start();

  process.env.DATABASE_URL = `postgresql://postgres_debugger:postgres_debugger_local_only@${container.getHost()}:${container.getMappedPort(
    5432
  )}/debugging_olympics_test`;
  process.env.REFERENCE_NOW = FIXTURE_REFERENCE_NOW;

  await disconnectPrisma();
  await runPrismaCommandWithRetry(["migrate", "deploy", "--schema", "prisma/schema.prisma"]);

  mkdirSync(runtimeDir, { recursive: true });
  writeFileSync(
    stateFile,
    JSON.stringify(
      {
        databaseUrl: process.env.DATABASE_URL,
        referenceNow: process.env.REFERENCE_NOW
      },
      null,
      2
    )
  );
}

export async function stopTestContainer(): Promise<void> {
  await disconnectPrisma();

  if (container) {
    await container.stop();
    container = undefined;
  }

  rmSync(stateFile, { force: true });
}
