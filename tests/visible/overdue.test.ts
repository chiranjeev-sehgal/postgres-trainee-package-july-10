import handler from "@/pages/api/tickets/overdue";
import { setupDatabase, resetDatabase, teardownDatabase } from "@/tests/helpers/database";
import { callApi } from "@/tests/helpers/request";

describe("GET /api/tickets/overdue", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it("returns overdue active tickets", async () => {
    const { response } = await callApi(handler, {
      method: "GET"
    });

    const payload = response._getJSONData() as {
      count: number;
      data: Array<{ title: string }>;
    };

    expect(response.statusCode).toBe(200);
    expect(payload.count).toBe(3);
    expect(payload.data.map((ticket) => ticket.title)).toEqual([
      "Restore admin export",
      "Patch intake validation",
      "Retry failed settlement sync"
    ]);
  });

  it("filters overdue tickets by priority", async () => {
    const { response } = await callApi(handler, {
      method: "GET",
      query: {
        priority: "critical"
      }
    });

    const payload = response._getJSONData() as {
      count: number;
      data: Array<{ priority: string }>;
    };

    expect(response.statusCode).toBe(200);
    expect(payload.count).toBe(1);
    expect(payload.data[0]?.priority).toBe("critical");
  });
});
