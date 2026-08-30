import { dummyJsonClient } from "./httpClient";
import type { LoginPayload, User } from "../../types";

interface DummyJsonAuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export const login = async (
  payload: LoginPayload
): Promise<DummyJsonAuthResponse> => {
  const { data } = await dummyJsonClient.post<DummyJsonAuthResponse>(
    "/auth/login",
    {
      username: payload.username,
      password: payload.password,
      expiresInMins: 1,
    }
  );
  return data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const { data } = await dummyJsonClient.post("/auth/refresh", {
    refreshToken,
    expiresInMins: 1,
  });
  return data;
};

export const fetchCurrentUser = async (accessToken: string): Promise<User> => {
  const { data } = await dummyJsonClient.get<User>("/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};
