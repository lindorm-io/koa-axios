import { Axios } from "@lindorm-io/axios";
import { KoaContext } from "@lindorm-io/koa";

export interface AxiosContext extends KoaContext {
  axios: {
    [key: string]: Axios;
  };
  token: { bearer?: { token?: string } };
}

export interface BasicAuthCredentials {
  username: string;
  password: string;
}
