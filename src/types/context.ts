import { Axios } from "@lindorm-io/axios";
import { KoaContext } from "@lindorm-io/koa";

export interface AxiosContext extends KoaContext {
  client: {
    [key: string]: Axios;
  };
  token: { bearer?: { token?: string } };
}
