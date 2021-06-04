import { Axios, AxiosMiddleware, axiosBasicAuthMiddleware, axiosBearerAuthMiddleware } from "@lindorm-io/axios";
import { Middleware } from "@lindorm-io/koa";
import { IAxiosMiddlewareOptions, AxiosContext } from "../types";

export const axiosMiddleware =
  (options: IAxiosMiddlewareOptions): Middleware<AxiosContext> =>
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

    ctx.axios[options.keyName] = new Axios({
      baseUrl: options.baseUrl,
      logger: ctx.logger,
      middleware: [...middleware, ...(options.middleware || [])],
      name: options.keyName,
    });

    ctx.metrics.axios = (ctx.metrics.axios || 0) + (Date.now() - start);

    await next();
  };
