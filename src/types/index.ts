// ---- Auth & User Types ----
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  image?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ---- Sprints ----
export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

// ---- Board & Tasks ----
export type ColumnId = "backlog" | "in-progress" | "review" | "done";

export type Priority = "low" | "medium" | "high";

export interface Comment {
  id: number;
  taskId: number;
  authorId: number;
  message: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: ColumnId;
  priority: Priority;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  order: number;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  taskIds: number[];
}

export interface BoardFilter {
  searchQuery: string;
  priority: Priority | "all";
  assigneeId: number | "all";
  sprintId: number | "all";
}

// ---- Notifications ----
export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: "task" | "review" | "system";
  read: boolean;
  createdAt: string;
}

// ---- Analytics ----
export interface SprintVelocity {
  sprintName: string;
  completedTasks: number;
  totalTasks: number;
}

export interface TaskStatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface PriorityBreakdown {
  status: string;
  low: number;
  medium: number;
  high: number;
}

export interface CompletionTrend {
  date: string;
  completedCount: number;
}
