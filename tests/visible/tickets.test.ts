import handler from "@/pages/api/tickets/pages";
import { setupDatabase, resetDatabase, teardownDatabase } from "@/tests/helpers/database";
import { callApi } from "@/tests/helpers/request";

describe("GET and POST /api/tickets", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it("returns all tickets sorted by createdAt descending", async () => {
    const { response } = await callApi(handler, {
      method: "GET"
    });

    expect(response.statusCode).toBe(200);
    const payload = response._getJSONData() as {
      success: boolean;
      count: number;
      data: Array<{ title: string }>;
    };
    expect(payload.success).toBe(true);
    expect(payload.count).toBe(7);
    expect(payload.data.map((ticket) => ticket.title)).toEqual([
      "Tune cache invalidation",
      "Prepare partner launch",
      "Close storefront rollback",
      "Document incident timeline",
      "Retry failed settlement sync",
      "Patch intake validation",
      "Restore admin export"
    ]);
  });

  it("filters by status", async () => {
    const { response } = await callApi(handler, {
      method: "GET",
      query: {
        status: "open"
      }
    });

    const payload = response._getJSONData() as {
      count: number;
      data: Array<{ status: string }>;
    };
    expect(response.statusCode).toBe(200);
    expect(payload.count).toBe(3);
    expect(payload.data.every((ticket) => ticket.status === "open")).toBe(true);
  });

  it("filters by priority", async () => {
    const { response } = await callApi(handler, {
      method: "GET",
      query: {
        priority: "medium"
      }
    });

    const payload = response._getJSONData() as {
      count: number;
      data: Array<{ priority: string }>;
    };
    expect(response.statusCode).toBe(200);
    expect(payload.count).toBe(3);
    expect(payload.data.every((ticket) => ticket.priority === "medium")).toBe(true);
  });

  it("filters by assignee", async () => {
    const { response } = await callApi(handler, {
      method: "GET",
      query: {
        assignedTo: "alex"
      }
    });

    const payload = response._getJSONData() as {
      count: number;
      data: Array<{ assignedTo: string }>;
    };
    expect(response.statusCode).toBe(200);
    expect(payload.count).toBe(2);
    expect(payload.data.every((ticket) => ticket.assignedTo === "alex")).toBe(true);
  });

  it("creates a ticket", async () => {
    const { response } = await callApi(handler, {
      method: "POST",
      body: {
        title: "Audit webhook retries",
        description: "Follow up on repeated webhook failures.",
        status: "open",
        priority: "low",
        dueDate: "2026-02-03T12:00:00.000Z",
        assignedTo: "riley"
      }
    });

    const payload = response._getJSONData() as {
      success: boolean;
      data: { title: string; assignedTo: string };
    };
    expect(response.statusCode).toBe(201);
    expect(payload.success).toBe(true);
    expect(payload.data.title).toBe("Audit webhook retries");
    expect(payload.data.assignedTo).toBe("riley");
  });

  it("rejects invalid POST input", async () => {
    const { response } = await callApi(handler, {
      method: "POST",
      body: {
        title: "   ",
        description: "Missing meaningful title.",
        status: "open",
        priority: "low",
        dueDate: "2026-02-03T12:00:00.000Z"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response._getJSONData()).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "title is required"
      }
    });
  });
});
