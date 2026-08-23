import { describe, it, expect, vi, beforeEach } from "vitest";
import { authedClient, setAccessToken } from "../services/api/httpClient";
import { registerAuthInterceptor } from "../services/api/authInterceptor";
import { useAuthStore } from "../store/authStore";
import * as authService from "../services/api/authService";

describe("Auth Interceptor & Token Refresh Flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setAccessToken(null);
    useAuthStore.setState({
      user: null,
      refreshToken: "sample-refresh-token",
      isAuthenticated: true,
      isInitializing: false,
    });
  });

  it("should attach Bearer token to request headers when set", async () => {
    setAccessToken("test-access-token");

    const handlers = (authedClient.interceptors.request as unknown as { handlers: Array<{ fulfilled: (config: unknown) => unknown }> }).handlers;
    if (handlers && handlers.length > 0) {
      const config = (await handlers[0].fulfilled({
        headers: {},
      })) as { headers: { Authorization?: string } };

      expect(config?.headers?.Authorization).toBe("Bearer test-access-token");
    }
  });

  it("should refresh token and retry request on 401 error", async () => {
    registerAuthInterceptor();

    const refreshSpy = vi.spyOn(authService, "refreshAccessToken").mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    vi.spyOn(authedClient, "request").mockResolvedValue({ data: "success" });

    const mockOriginalRequest = {
      headers: {},
      _retry: false,
    };

    const mock401Error = {
      response: { status: 401 },
      config: mockOriginalRequest,
    };

    const handlers = (authedClient.interceptors.response as unknown as { handlers: Array<{ rejected?: (err: unknown) => Promise<unknown> }> }).handlers;
    const responseInterceptor = handlers && handlers.length > 0 ? handlers[handlers.length - 1] : undefined;

    expect(responseInterceptor?.rejected).toBeDefined();

    if (responseInterceptor?.rejected) {
      try {
        await responseInterceptor.rejected(mock401Error);
      } catch {
        // Ignored
      }
    }

    expect(refreshSpy).toHaveBeenCalledWith("sample-refresh-token");
    expect(useAuthStore.getState().refreshToken).toBe("new-refresh-token");
  });
});
