import { AxiosMiddleware } from "@lindorm-io/axios";
import { BasicAuthCredentials } from "./koa";

export interface IAxiosMiddlewareOptions {
  baseUrl?: string;
  basicAuth?: BasicAuthCredentials;
  middleware?: Array<AxiosMiddleware>;
  keyName: string;
}
