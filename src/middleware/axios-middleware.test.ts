import MockDate from "mockdate";
import { Axios } from "@lindorm-io/axios";
import { axiosMiddleware } from "./axios-middleware";
import { logger } from "../test";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("axiosMiddleware", () => {
  let options: any;
  let ctx: any;

  beforeEach(() => {
    options = {
      baseUrl: "https://lindorm.io/",
      basicAuth: {
        username: "username",
        password: "password",
      },
      middleware: [{ request: jest.fn() }],
      clientName: "axiosClient",
    };
    ctx = {
      client: {},
      logger,
      metadata: { correlationId: "6be482f0-943b-4b64-8c9c-4c7f2efcf50c" },
      metadataHeaders: { "X-Correlation-ID": "6be482f0-943b-4b64-8c9c-4c7f2efcf50c" },
      metrics: {},
      token: { bearer: { token: "jwt.jwt.jwt" } },
    };
  });

  test("should create axios client on context", async () => {
    await expect(axiosMiddleware(options)(ctx, next)).resolves.toBeUndefined();

    expect(ctx.client.axiosClient).toStrictEqual(expect.any(Axios));
    expect(ctx.client.axiosClient.middleware.length).toBe(4);
    expect(ctx.metrics.axios).toBe(0);
  });
});
