import { AxiosError } from "axios";
import { authedClient, setAccessToken } from "./httpClient";
import { refreshAccessToken } from "./authService";
import { useAuthStore } from "../../store/authStore";

export const registerAuthInterceptor = () => {
  authedClient.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      if (error.response?.status !== 401 || !error.config) {
        return Promise.reject(error);
      }

      const {
        refreshToken,
        logout,
        setTokens,
      } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        // Refresh access token
        const tokens = await refreshAccessToken(refreshToken);

        // Save new tokens
        setAccessToken(tokens.accessToken);

        setTokens(
          tokens.accessToken,
          tokens.refreshToken
        );

        // Retry original request
        error.config.headers.Authorization =
          `Bearer ${tokens.accessToken}`;

        return authedClient(error.config);

      } catch (refreshError) {
        logout();

        return Promise.reject(refreshError);
      }
    }
  );
};
