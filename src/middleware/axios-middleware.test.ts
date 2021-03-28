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
      name: "Client",
    };
    ctx = {
      logger,
      metadata: {
        correlationId: "correlationId",
      },
    };
  });

  test("should create axios client on context", async () => {
    await expect(axiosMiddleware(options)(ctx, next)).resolves.toBe(undefined);

    expect(ctx.axios.Client).toStrictEqual(expect.any(Axios));
    expect(ctx.metrics.axios).toBe(0);
  });
});
