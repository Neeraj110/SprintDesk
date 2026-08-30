import { mockDataClient } from "./httpClient";
import fallbackMockData from "../../data/mock-data.json";
import type { User, Sprint, Task, Comment, AppNotification } from "../../types";

export interface RawMockData {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: AppNotification[];
}


let cachedData: RawMockData | null = null;

export const fetchInitialMockData = async (): Promise<RawMockData> => {
  if (cachedData) return cachedData;
  try {
    const { data } = await mockDataClient.get<RawMockData>("/mock-data.json");
    cachedData = data;
    return cachedData;
  } catch (err) {
    console.warn("Network fetch for /mock-data.json failed. Using embedded static fallback data.", err);
    cachedData = fallbackMockData as RawMockData;
    return cachedData;
  }
};

export const getUsers = async (): Promise<User[]> => {
  const data = await fetchInitialMockData();
  return data.users;
};

export const getSprints = async (): Promise<Sprint[]> => {
  const data = await fetchInitialMockData();
  return data.sprints;
};

export const getTasks = async (): Promise<Task[]> => {
  const data = await fetchInitialMockData();
  return data.tasks.slice(0, 30);
};

export const getComments = async (): Promise<Comment[]> => {
  const data = await fetchInitialMockData();
  return data.comments;
};

export const getNotifications = async (): Promise<AppNotification[]> => {
  const data = await fetchInitialMockData();
  return data.notifications;
};
