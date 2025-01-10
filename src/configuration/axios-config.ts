import { useAuthUserStore } from '@/store/index';
import Config from '@/configuration/config';
import AuthService from '@/services/auth-service';

// import PushNotification from '@/utils/push-notification';
import { toast } from 'vue3-toastify';
import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type Canceler,
} from 'axios';
import type { Swr } from '@/services/shema-to-types';

const TIMEOUT = 5000;
export const OK = 200;
const CREATED = 201;
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
            toast('Your session has expired. You will be redirected to the Login page.', {
              type: 'error',
            });
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
        if (response && response.status === CREATED) {
          toast('Record saved successfully.', {
            type: 'success',
          });
        }
        return response;
      },
      function (error: Swr): Promise<never> {
        if (error.response && error.response.status && !isNaN(error.response.status)) {
          if (error.response.status === FORBIDDEN) {
            toast(
              'You do not have permission to access this resource. You will be redirected to the Login page.',
              {
                type: 'error',
              },
            );
            setTimeout(function () {
              AuthService.doLogOut();
            }, TIMEOUT);
          } else {
            let errorMsg = '';
            if (error.response.data.detail && error.response.status) {
              errorMsg = `Status: ${error.response.status}, ${error.response.data.detail}`;
            } else {
              errorMsg = error.message;
            }
            toast(errorMsg, {
              type: 'error',
            });
          }
        }

        return Promise.reject(error);
      },
    );
  },
  handleError(error: Swr) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
      console.log(error);
    }
  },
};

export default AxiosConfig;
