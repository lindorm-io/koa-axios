import MockDate from "mockdate";
import { Axios } from "@lindorm-io/axios";
import { axiosMiddleware } from "./axios-middleware";
import { logger } from "../test";
import { MetadataHeader } from "@lindorm-io/koa";

MockDate.set("2020-01-01T08:00:00.000Z");

const next = jest.fn();

describe("axiosMiddleware", () => {
  let middlewareOptions: any;
  let options: any;
  let ctx: any;

  beforeEach(() => {
    middlewareOptions = {
      baseUrl: "https://lindorm.io",
      basicAuth: {
        username: "username",
        password: "password",
      },
      middleware: [{ request: jest.fn() }],
      clientName: "axiosClient",
    };
    options = {
      baseUrl: "data.baseUrl",
    };
    ctx = {
      axios: {},
      data: {
        baseUrl: "https://path.lindorm.io",
      },
      logger,
      metadata: { correlationId: "6be482f0-943b-4b64-8c9c-4c7f2efcf50c" },
      getMetadataHeaders: () => ({
        [MetadataHeader.CORRELATION_ID]: "6be482f0-943b-4b64-8c9c-4c7f2efcf50c",
        [MetadataHeader.REQUEST_ID]: "2aefc7f5-416f-4870-9e9c-ae2ed2b7d9bb",
      }),
      metrics: {},
      token: { bearerToken: { token: "jwt.jwt.jwt" } },
    };
  });

  test("should create axios client on context", async () => {
    await expect(
      axiosMiddleware(middlewareOptions)()(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.axios.axiosClient).toStrictEqual(expect.any(Axios));
    expect(ctx.axios.axiosClient.baseUrl).toBe("https://lindorm.io");
    expect(ctx.axios.axiosClient.middleware.length).toBe(4);
    expect(ctx.metrics.axios).toBe(0);
  });

  test("should use path to set base url", async () => {
    await expect(
      axiosMiddleware(middlewareOptions)(options)(ctx, next),
    ).resolves.toBeUndefined();

    expect(ctx.axios.axiosClient.baseUrl).toBe("https://path.lindorm.io");
  });
});
