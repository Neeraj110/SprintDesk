import { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { authedClient, setAccessToken } from "./httpClient";
import { refreshAccessToken } from "./authService";
import { useAuthStore } from "../../store/authStore";

// Extend axios config so we can mark a request as "already retried once".
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// Attach the response interceptor once, e.g. from main.tsx / App bootstrap.
export const registerAuthInterceptor = () => {
  authedClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableConfig;

      const isUnauthorized = error.response?.status === 401;
      if (!isUnauthorized || !originalRequest || originalRequest._retry) {
        return Promise.reject(error);
      }

      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until the in-flight refresh resolves.
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(authedClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshAccessToken(refreshToken);

        setAccessToken(accessToken);
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);
        flushQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authedClient(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
