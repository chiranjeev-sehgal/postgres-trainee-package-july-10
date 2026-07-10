import type { NextApiRequest, NextApiResponse } from "next";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  TicketRecord,
} from "@/types/api";
import { logger } from "@/lib/logger";
import {
  createApiError,
  extractSingleQueryParam,
  validateIsoDate,
  validatePriority,
  validateRequiredString,
  validateStatus,
} from "@/lib/validation";
import { createTicket, listTickets } from "@/repositories/ticketRepository";

type TicketListResponse = ApiSuccessResponse<TicketRecord[]>;
type TicketCreateResponse = ApiSuccessResponse<TicketRecord>;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<
    TicketListResponse | TicketCreateResponse | ApiErrorResponse
  >,
): Promise<void> {
  try {
    if (request.method === "GET") {
      const statusParam = extractSingleQueryParam(
        request.query.status,
        "status",
      );
      const priorityParam = extractSingleQueryParam(
        request.query.priority,
        "priority",
      );
      const assignedTo = extractSingleQueryParam(
        request.query.assignedTo,
        "assignedTo",
      );

      const tickets = await listTickets({
        status: statusParam ? validateStatus(statusParam) : undefined,
        priority: priorityParam ? validatePriority(priorityParam) : undefined,
        assignedTo,
      });

      response.status(200).json({
        success: true,
        data: tickets,
        count: tickets.length,
      });
      return;
    }

    if (request.method === "POST") {
      console.log(request.body);
console.log(typeof request.body);
      const body =
  typeof request.body === "string"
    ? JSON.parse(request.body)
    : request.body;
      const title = validateRequiredString(body?.title, "title");
      

      // const title = validateRequiredString(request.body?.title, "title");
      const description = validateRequiredString(
        request.body?.description,
        "description",
      );
      const status = validateStatus(
        validateRequiredString(request.body?.status, "status"),
      );
      const priority = validatePriority(
        validateRequiredString(request.body?.priority, "priority"),
      );
      const dueDate = validateIsoDate(request.body?.dueDate, "dueDate");
      const assignedTo =
        typeof request.body?.assignedTo === "string" &&
        request.body.assignedTo.trim() !== ""
          ? request.body.assignedTo.trim()
          : null;

      const ticket = await createTicket({
        title,
        description,
        status,
        priority,
        dueDate: new Date(dueDate),
        assignedTo,
      });

      response.status(201).json({
        success: true,
        data: ticket,
      });
      return;
    }

    // logger.warn("Unsupported method on tickets index", {
    //   method: request.method,
    // });
    logger.warn("Unsupported method on tickets index", {
  method: request.method
});

response.setHeader("Allow", ["GET", "POST"]);

response.status(405).json({
  success: false,
  error: {
    code: "METHOD_NOT_ALLOWED",
    message: "Unsupported method"
  }
});
    response.status(400).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Unsupported method",
      },
    });
  } catch (error) {
    logger.error("Tickets index handler failed", error, {
      method: request.method,
    });

    if (error instanceof Error && error.message.includes("Invalid")) {
      createApiError(response, 400, "VALIDATION_ERROR", error.message);
      return;
    }

    if (error instanceof Error && error.message.includes("required")) {
      createApiError(response, 400, "VALIDATION_ERROR", error.message);
      return;
    }

    if (error instanceof Error && error.message.includes("single value")) {
      createApiError(response, 400, "VALIDATION_ERROR", error.message);
      return;
    }

    response.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Unexpected error",
      },
    });
  }
}
