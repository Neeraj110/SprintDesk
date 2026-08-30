import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { setAccessToken } from "../services/api/httpClient";

interface AuthState {
  user: User | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean; 
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setInitializing: (value: boolean) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, 
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true,

      setTokens: (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        set({ refreshToken, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      setInitializing: (value) => set({ isInitializing: value }),

      logout: () => {
        setAccessToken(null);
        set({ user: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "sprintdesk-auth",
      partialize: (state) => ({
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
