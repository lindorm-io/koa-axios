import { Axios } from "@lindorm-io/axios";
import { IKoaAppContext } from "@lindorm-io/koa";

export interface IKoaAxiosContext extends IKoaAppContext {
  axios: {
    [key: string]: Axios;
  };
}

export interface IBasicAuthCredentials {
  username: string;
  password: string;
}
