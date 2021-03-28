import { IAxiosMiddleware } from "@lindorm-io/axios";
import { IBasicAuthCredentials } from "./koa";

export interface IAxiosMiddlewareOptions {
  baseUrl?: string;
  basicAuth?: IBasicAuthCredentials;
  bearerAuth?: string;
  middleware?: Array<IAxiosMiddleware>;
  name: string;
}
