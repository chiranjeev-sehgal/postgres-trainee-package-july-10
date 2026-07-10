import handler from "@/pages/api/tickets/statistics";
import { setupDatabase, resetDatabase, teardownDatabase } from "@/tests/helpers/database";
import { callApi } from "@/tests/helpers/request";

describe("GET /api/tickets/statistics", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it("returns aggregate ticket statistics", async () => {
    const { response } = await callApi(handler, {
      method: "GET"
    });

    const payload = response._getJSONData() as {
      success: boolean;
      data: {
        total: number;
        byStatus: Record<string, number>;
        byPriority: Record<string, number>;
        overdueActive: number;
      };
    };

    expect(response.statusCode).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data).toEqual({
      total: 7,
      byStatus: {
        open: 3,
        in_progress: 2,
        resolved: 1,
        closed: 1
      },
      byPriority: {
        low: 1,
        medium: 3,
        high: 2,
        critical: 1
      },
      overdueActive: 3
    });
  });
});
