import { Axios, IAxiosRequest } from "@lindorm-io/axios";
import { IAxiosMiddlewareOptions, IKoaAxiosContext } from "../types";
import { DefaultState, Middleware } from "koa";

export const axiosMiddleware =
  (options: IAxiosMiddlewareOptions): Middleware<DefaultState, IKoaAxiosContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    const metadataMiddleware = {
      request: async (request: IAxiosRequest): Promise<IAxiosRequest> => ({
        ...request,
        headers: {
          ...request.headers,
          ...ctx.metadataHeaders,
        },
      }),
    };

    ctx.axios = {
      ...(ctx.axios || {}),
      [options.name]: new Axios({
        auth: {
          basic: options.basicAuth,
          bearer: ctx.token?.bearer?.token,
        },
        baseUrl: options.baseUrl,
        logger: ctx.logger,
        middleware: [metadataMiddleware, ...(options.middleware || [])],
        name: options.name,
      }),
    };

    const end = Date.now() - start;

    ctx.metrics = {
      ...(ctx.metrics || {}),
      axios: ctx.metrics?.axios ? ctx.metrics.axios + end : end,
    };

    await next();
  };
