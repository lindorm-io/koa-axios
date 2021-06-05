import { Axios, AxiosMiddleware, axiosBasicAuthMiddleware, axiosBearerAuthMiddleware } from "@lindorm-io/axios";
import { AxiosBasicCredentials } from "axios";
import { AxiosContext } from "../types";
import { Middleware } from "@lindorm-io/koa";

interface Options {
  baseUrl?: string;
  basicAuth?: AxiosBasicCredentials;
  clientName: string;
  middleware?: Array<AxiosMiddleware>;
}

export const axiosMiddleware =
  (options: Options): Middleware<AxiosContext> =>
  async (ctx, next): Promise<void> => {
    const start = Date.now();

    const metadataMiddleware: AxiosMiddleware = {
      request: async (request) => ({
        ...request,
        headers: {
          ...request.headers,
          ...ctx.metadataHeaders,
        },
      }),
    };

    const middleware = [metadataMiddleware];

    if (options.basicAuth) {
      middleware.push(axiosBasicAuthMiddleware(options.basicAuth));
    }
    if (ctx.token?.bearer?.token) {
      middleware.push(axiosBearerAuthMiddleware(ctx.token?.bearer?.token));
    }

    ctx.client[options.clientName] = new Axios({
      baseUrl: options.baseUrl,
      logger: ctx.logger,
      middleware: [...middleware, ...(options.middleware || [])],
      name: options.clientName,
    });

    ctx.metrics.axios = (ctx.metrics.axios || 0) + (Date.now() - start);

    await next();
  };
