import type { NextApiRequest, NextApiResponse } from "next";
import type { ApiErrorResponse, ApiSuccessResponse, TicketRecord } from "@/types/api";
import { logger } from "@/lib/logger";
import { createApiError, extractSingleQueryParam, validatePriority } from "@/lib/validation";
import { listOverdueTickets } from "@/repositories/ticketRepository";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ApiSuccessResponse<TicketRecord[]> | ApiErrorResponse>
): Promise<void> {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    createApiError(response, 405, "METHOD_NOT_ALLOWED", "Method not allowed");
    return;
  }

  try {
    const priorityParam = extractSingleQueryParam(request.query.priority, "priority");
    const priority = priorityParam ? validatePriority(priorityParam) : undefined;
    const tickets = await listOverdueTickets(priority);

    response.status(200).json({
      success: true,
      data: tickets,
      count: tickets.length
    });
  } catch (error) {
    logger.error("Overdue handler failed", error);

    if (error instanceof Error && error.message.includes("Invalid")) {
      createApiError(response, 400, "VALIDATION_ERROR", error.message);
      return;
    }

    if (error instanceof Error && error.message.includes("single value")) {
      createApiError(response, 400, "VALIDATION_ERROR", error.message);
      return;
    }

    createApiError(response, 500, "INTERNAL_ERROR", "Internal server error");
  }
}
