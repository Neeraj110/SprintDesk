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
  const res = await fetch("/mock-data.json");
  if (!res.ok) {
    throw new Error(`Failed to fetch mock data: ${res.statusText}`);
  }
  const data: RawMockData = await res.json();
  cachedData = data;
  return data;
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
  // Requirement 02: "Fetch the first 30 tasks from mock-data.json"
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
