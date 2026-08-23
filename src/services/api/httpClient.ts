import axios from "axios";

// Access token lives ONLY in memory (never localStorage) — cleared on refresh/tab close.
// Refresh token is persisted via the auth store's localStorage-simulated storage.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const dummyJsonClient = axios.create({
  baseURL: "https://dummyjson.com",
});

export const mockDataClient = axios.create({
  baseURL: "", // served from /public, e.g. /mock-data.json
});

export const jsonPlaceholderClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// The interceptor lives on dummyJsonClient's "protected" instance pattern:
// any client that needs Bearer auth should use `authedClient`.
export const authedClient = axios.create({
  baseURL: "https://dummyjson.com",
});

authedClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
