import type { NextApiResponse } from "next";
import type { Priority, Status } from "@prisma/client";
import type { ApiErrorResponse } from "@/types/api";

const STATUSES: Status[] = ["open", "in_progress", "resolved", "closed"];
const PRIORITIES: Priority[] = ["low", "medium", "high", "critical"];

export function createApiError(
  response: NextApiResponse<ApiErrorResponse>,
  statusCode: number,
  code: string,
  message: string
): void {
  response.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

export function extractSingleQueryParam(
  value: string | string[] | undefined,
  fieldName: string
): string | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (Array.isArray(value)) {
    throw new Error(`${fieldName} must be a single value`);
  }

  return value;
}

export function validateStatus(value: string): Status {
  if (STATUSES.includes(value as Status)) {
    return value as Status;
  }

  throw new Error("Invalid status value");
}

export function validatePriority(value: string): Priority {
  if (PRIORITIES.includes(value as Priority)) {
    return value as Priority;
  }

  throw new Error("Invalid priority value");
}

export function validateRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

export function validateIsoDate(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid ISO date`);
  }

  return date.toISOString();
}
