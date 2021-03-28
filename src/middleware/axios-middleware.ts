import { Axios, IAxiosRequest } from "@lindorm-io/axios";
import { IAxiosMiddlewareOptions, IKoaAxiosContext } from "../types";
import { getMetaHeaders, TNext } from "@lindorm-io/koa";

export const axiosMiddleware = (options: IAxiosMiddlewareOptions) => async (
  ctx: IKoaAxiosContext,
  next: TNext,
): Promise<void> => {
  const start = Date.now();

  const headerMiddleware = {
    request: async (request: IAxiosRequest): Promise<IAxiosRequest> => ({
      ...request,
      headers: {
        ...request.headers,
        ...getMetaHeaders(ctx.metadata),
      },
    }),
  };

  ctx.axios = {
    ...(ctx.axios || {}),
    [options.name]: new Axios({
      baseUrl: options.baseUrl,
      basicAuth: options.basicAuth,
      bearerAuth: options.bearerAuth,
      logger: ctx.logger,
      middleware: [headerMiddleware, ...(options.middleware || [])],
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
