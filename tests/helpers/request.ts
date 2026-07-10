import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";

type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export async function callApi(
  handler: NextApiHandler,
  options: RequestOptions
): Promise<{
  request: NextApiRequest;
  response: NextApiResponse & {
    _getJSONData: () => unknown;
    _getData: () => string;
  };
}> {
  const { req, res } = createMocks({
    method: options.method,
    query: options.query,
    body: options.body as Record<string, unknown> | undefined
  });

  await handler(req as NextApiRequest, res as unknown as NextApiResponse);

  return {
    request: req as NextApiRequest,
    response: res as NextApiResponse & {
      _getJSONData: () => unknown;
      _getData: () => string;
    }
  };
}
