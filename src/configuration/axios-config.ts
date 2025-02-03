import { useAuthUserStore } from '@/store/index';
import Config, { dispatchError } from '@/configuration/config';
import AuthService from '@/services/auth-service';
import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type Canceler,
} from 'axios';
import type { Swr } from '@/services/shema-to-types';

const TIMEOUT = 5000;
export const OK = 200;
const FORBIDDEN = 403;

const AxiosConfig = {
  axiosSetUp() {
    axios.defaults.baseURL = `${Config.value('rescWebServiceUrl')}/v1`;

    axios.interceptors.request.use(
      // @ts-expect-error
      function (config: AxiosRequestConfig) {
        const store = useAuthUserStore();
        if (store.accessToken) {
          if (AuthService.isTokenExpired(store.accessToken)) {
            setTimeout(function () {
              AuthService.doLogOut();
            }, TIMEOUT);

            return {
              config,
              cancelToken: new axios.CancelToken((cancel: Canceler) => cancel()),
            };
          } else {
            // ts is complaining that config.header might be null
            // todo: add check later ?
            (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${store.accessToken}`;
            (config.headers as AxiosRequestHeaders).Accept = 'application/json';
          }
        }
        return config;
      },
      function (error: Swr) {
        return Promise.reject(error);
      },
    );

    axios.interceptors.response.use(
      function (response: AxiosResponse): AxiosResponse {
        return response;
      },
      function (error: Swr): Promise<never> {
        if (error.response && error.response.status && !isNaN(error.response.status)) {
          dispatchError(error);
          if (error.response.status === FORBIDDEN) {
            setTimeout(function () {
              AuthService.doLogOut();
            }, TIMEOUT);
          }
        } else {
          dispatchError({
            axios: {
              config: { url: error.config.baseURL },
              code: error.code,
              message: error.message,
            },
          });
        }

        return Promise.reject(error);
      },
    );
  },
};

export default AxiosConfig;
