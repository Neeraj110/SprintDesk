import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const dummyJsonClient = axios.create({
  baseURL: "https://dummyjson.com",
});


export const jsonPlaceholderClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const authedClient = axios.create({
  baseURL: "https://dummyjson.com",
});

authedClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
