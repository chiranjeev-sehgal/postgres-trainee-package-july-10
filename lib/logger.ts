type LogLevel = "info" | "warn" | "error";

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name?: string;
    message?: string;
    code?: string;
  };
};

function write(entry: LogEntry): void {
  const sink = entry.level === "error" ? console.error : console.log;
  sink(JSON.stringify(entry));
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    write({
      timestamp: new Date().toISOString(),
      level: "info",
      message,
      context
    });
  },
  warn(message: string, context?: Record<string, unknown>) {
    write({
      timestamp: new Date().toISOString(),
      level: "warn",
      message,
      context
    });
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const knownError =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message
          }
        : undefined;

    write({
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      context,
      error: knownError
    });
  }
};
