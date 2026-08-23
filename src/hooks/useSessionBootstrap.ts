import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { refreshAccessToken, fetchCurrentUser } from "../services/api/authService";
import { setAccessToken } from "../services/api/httpClient";

// Runs once on app mount. If a refresh token survived a page reload,
// silently exchange it for a new access token and restore the session.
// Otherwise, stop showing the full-screen loader and send user to /login.
export const useSessionBootstrap = () => {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const bootstrap = async () => {
      if (!refreshToken) {
        setInitializing(false);
        return;
      }

      try {
        const tokens = await refreshAccessToken(refreshToken);
        setAccessToken(tokens.accessToken);
        setTokens(tokens.accessToken, tokens.refreshToken);

        const user = await fetchCurrentUser(tokens.accessToken);
        setUser(user);
      } catch {
        logout();
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
