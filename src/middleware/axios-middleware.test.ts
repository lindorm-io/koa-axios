import MockDate from "mockdate";
import { IAxiosMiddlewareOptions } from "../types";
import { logger } from "../test";
import { axiosMiddleware } from "./axios-middleware";
import { Axios } from "@lindorm-io/axios";

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("axiosMiddleware", () => {
  let options: IAxiosMiddlewareOptions;
  let ctx: any;

  beforeEach(() => {
    options = {
      baseUrl: "https://lindorm.io/",
      basicAuth: {
        username: "username",
        password: "password",
      },
      middleware: [{ request: jest.fn() }],
      name: "Client",
    };
    ctx = {
      logger,
      metadata: {
        correlationId: "6be482f0-943b-4b64-8c9c-4c7f2efcf50c",
      },
      metadataHeaders: {
        "X-Correlation-ID": "6be482f0-943b-4b64-8c9c-4c7f2efcf50c",
      },
      token: {
        bearer: { token: "jwt.jwt.jwt" },
      },
    };
  });

  test("should create axios client on context", async () => {
    await expect(axiosMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.axios.Client).toStrictEqual(expect.any(Axios));
    expect(ctx.axios.Client.middleware.length).toBe(2);
    expect(ctx.axios.Client.auth).toMatchSnapshot();
    expect(ctx.metrics.axios).toBe(0);
  });
});
