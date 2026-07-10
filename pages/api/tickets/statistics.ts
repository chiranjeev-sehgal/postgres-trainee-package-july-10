import type { NextApiRequest, NextApiResponse } from "next";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { logger } from "@/lib/logger";
import { createApiError } from "@/lib/validation";
import { getTicketStatistics } from "@/repositories/ticketRepository";

type StatisticsResponse = ApiSuccessResponse<{
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  overdueActive: number;
}>;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<StatisticsResponse | ApiErrorResponse>
): Promise<void> {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return createApiError(response, 405, "METHOD_NOT_ALLOWED", "Method not allowed");
  }

  try {
    const stats = await getTicketStatistics();
    return response.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error("Statistics handler failed", error);
    return createApiError(response, 500, "INTERNAL_ERROR", "Internal server error");
  }
}
