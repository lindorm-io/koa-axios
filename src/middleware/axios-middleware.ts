import { Axios, AxiosMiddleware, axiosBasicAuthMiddleware, axiosBearerAuthMiddleware } from "@lindorm-io/axios";
import { AxiosBasicCredentials } from "axios";
import { AxiosContext } from "../types";
import { Middleware } from "@lindorm-io/koa";
import { get } from "lodash";

interface MiddlewareOptions {
  baseUrl?: string;
  basicAuth?: AxiosBasicCredentials;
  clientName: string;
  middleware?: Array<AxiosMiddleware>;
}

export interface AxiosMiddlewareOptions {
  baseUrl?: string;
}

export const axiosMiddleware =
  (middlewareOptions: MiddlewareOptions) =>
  (options: AxiosMiddlewareOptions = {}): Middleware<AxiosContext> =>
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

    if (middlewareOptions.basicAuth) {
      middleware.push(axiosBasicAuthMiddleware(middlewareOptions.basicAuth));
    }
    if (ctx.token?.bearer?.token) {
      middleware.push(axiosBearerAuthMiddleware(ctx.token?.bearer?.token));
    }

    const baseUrl = options?.baseUrl ? get(ctx, options.baseUrl) : middlewareOptions.baseUrl;

    ctx.axios[middlewareOptions.clientName] = new Axios({
      baseUrl,
      logger: ctx.logger,
      middleware: [...middleware, ...(middlewareOptions.middleware || [])],
      name: middlewareOptions.clientName,
    });

    ctx.metrics.axios = (ctx.metrics.axios || 0) + (Date.now() - start);

    await next();
  };
