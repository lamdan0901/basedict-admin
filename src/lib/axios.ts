import axios, { AxiosError, AxiosResponse } from "axios";
import QueryString from "qs";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { getCookie } from "@/lib/cookies";
import { useAppStore } from "@/store/useAppStore";
import { getRefreshToken, setTokenServer } from "@/service/auth";

type IRequestCb = (token: string) => void;

let isRefreshing = false;
const refreshSubscribers: IRequestCb[] = [];

const subscribeTokenRefresh = (cb: IRequestCb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};

// Create separate instances for auth and data APIs
const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
});

const axiosData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DATA_BASE_URL,
  // paramsSerializer: {
  //   serialize: (params) => {
  //     return QueryString.stringify(params, {
  //       arrayFormat: "indices",
  //       allowDots: true,
  //     });
  //   },
  // },
});

// Shared interceptor for both instances
const sharedInterceptor = (config: any) => {
  const token = getCookie(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Add interceptors to both instances
axiosAuth.interceptors.request.use(sharedInterceptor);
axiosData.interceptors.request.use(sharedInterceptor);

const responseInterceptor = async (error: any) => {
  const { config } = error;
  const originalRequest = config;
  const oldRefreshToken = getCookie(REFRESH_TOKEN);

  if (error.response?.status === 401) {
    if (!oldRefreshToken) {
      useAppStore.getState().clearProfile();
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const data = await getRefreshToken(oldRefreshToken);
        setTokenServer(data);

        if (originalRequest.headers) {
          originalRequest.headers.authorization = `Bearer ${data.access_token}`;
          onRefreshed(data.access_token);
          return axios(originalRequest);
        }
      } catch (error) {
        useAppStore.getState().clearProfile();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((newToken: string) => {
        if (originalRequest.headers) {
          originalRequest.headers.authorization = `Bearer ${newToken}`;
        }
        resolve(axios(originalRequest));
      });
    });
  }

  if (axios.isAxiosError(error)) {
    if (error.code === AxiosError.ERR_NETWORK) {
      return Promise.reject("ERR_NETWORK_MSG");
    }
  }

  return Promise.reject(error.response?.data?.message as string);
};

// Shared response interceptor for both instances
axiosAuth.interceptors.response.use((res) => res, responseInterceptor);
axiosData.interceptors.response.use((res) => res, responseInterceptor);

export { axiosAuth, axiosData };
