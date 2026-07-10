import type { Priority, Status, Ticket } from "@prisma/client";

export type TicketStatus = Status;
export type TicketPriority = Priority;

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  count?: number;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code: string;
  };
};

export type TicketRecord = Ticket;
