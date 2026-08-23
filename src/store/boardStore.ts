import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Comment, ColumnId, User, Sprint, BoardFilter } from "../types";

interface BoardHistoryItem {
  tasks: Task[];
}

interface BoardState {
  tasks: Task[];
  comments: Comment[];
  users: User[];
  sprints: Sprint[];
  isLoaded: boolean;
  filter: BoardFilter;
  history: BoardHistoryItem[]; // History stack for Undo action bonus
  
  // Actions
  setInitialData: (data: {
    tasks: Task[];
    comments: Comment[];
    users: User[];
    sprints: Sprint[];
  }) => void;
  setFilter: (filter: Partial<BoardFilter>) => void;
  resetFilter: () => void;
  
  addTask: (task: Omit<Task, "id" | "order" | "createdAt" | "completedAt" | "updatedAt">) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  moveTask: (activeId: number, overColumnId: ColumnId, newIndex?: number) => void;
  undoLastAction: () => boolean;

  addComment: (taskId: number, authorId: number, message: string) => void;
}

const initialFilter: BoardFilter = {
  searchQuery: "",
  priority: "all",
  assigneeId: "all",
  sprintId: "all",
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: [],
      comments: [],
      users: [],
      sprints: [],
      isLoaded: false,
      filter: initialFilter,
      history: [],

      setInitialData: (data) => {
        // Only initialize if tasks are empty or store not loaded yet
        if (!get().isLoaded || get().tasks.length === 0) {
          set({
            tasks: data.tasks,
            comments: data.comments,
            users: data.users,
            sprints: data.sprints,
            isLoaded: true,
          });
        }
      },

      setFilter: (newFilter) =>
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        })),

      resetFilter: () => set({ filter: initialFilter }),

      addTask: (taskData) => {
        set((state) => {
          const newId = state.tasks.length > 0 ? Math.max(...state.tasks.map((t) => t.id)) + 1 : 1;
          const sameColTasks = state.tasks.filter((t) => t.status === taskData.status);
          const maxOrder = sameColTasks.length > 0 ? Math.max(...sameColTasks.map((t) => t.order)) : 0;
          const now = new Date().toISOString();

          const newTask: Task = {
            ...taskData,
            id: newId,
            order: maxOrder + 1,
            createdAt: now,
            completedAt: taskData.status === "done" ? now : null,
            updatedAt: now,
          };

          return {
            history: [...state.history.slice(-10), { tasks: state.tasks }],
            tasks: [...state.tasks, newTask],
          };
        });
      },

      updateTask: (id, updates) => {
        set((state) => {
          const now = new Date().toISOString();
          const updatedTasks = state.tasks.map((task) => {
            if (task.id !== id) return task;

            let completedAt = task.completedAt;
            if (updates.status) {
              if (updates.status === "done" && task.status !== "done") {
                completedAt = now;
              } else if (updates.status !== "done") {
                completedAt = null;
              }
            }

            return {
              ...task,
              ...updates,
              completedAt,
              updatedAt: now,
            };
          });

          return {
            history: [...state.history.slice(-10), { tasks: state.tasks }],
            tasks: updatedTasks,
          };
        });
      },

      deleteTask: (id) => {
        set((state) => ({
          history: [...state.history.slice(-10), { tasks: state.tasks }],
          tasks: state.tasks.filter((t) => t.id !== id),
          comments: state.comments.filter((c) => c.taskId !== id),
        }));
      },

      moveTask: (activeId, overColumnId, newIndex) => {
        set((state) => {
          const taskToMove = state.tasks.find((t) => t.id === activeId);
          if (!taskToMove) return state;

          const now = new Date().toISOString();
          const oldTasks = state.tasks;
          const otherTasks = oldTasks.filter((t) => t.id !== activeId);

          const targetColTasks = otherTasks
            .filter((t) => t.status === overColumnId)
            .sort((a, b) => a.order - b.order);

          const updatedTask: Task = {
            ...taskToMove,
            status: overColumnId,
            completedAt:
              overColumnId === "done"
                ? taskToMove.completedAt || now
                : null,
            updatedAt: now,
          };

          const insertIdx =
            newIndex !== undefined ? newIndex : targetColTasks.length;
          targetColTasks.splice(insertIdx, 0, updatedTask);

          // Re-index target column order
          const reorderedTargetCol = targetColTasks.map((t, idx) => ({
            ...t,
            order: idx + 1,
          }));

          const nonTargetTasks = otherTasks.filter((t) => t.status !== overColumnId);

          return {
            history: [...state.history.slice(-10), { tasks: oldTasks }],
            tasks: [...nonTargetTasks, ...reorderedTargetCol],
          };
        });
      },

      undoLastAction: () => {
        const { history } = get();
        if (history.length === 0) return false;

        const lastState = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({
          tasks: lastState.tasks,
          history: newHistory,
        });

        return true;
      },

      addComment: (taskId, authorId, message) => {
        set((state) => {
          const newId =
            state.comments.length > 0
              ? Math.max(...state.comments.map((c) => c.id)) + 1
              : 1;
          const newComment: Comment = {
            id: newId,
            taskId,
            authorId,
            message,
            createdAt: new Date().toISOString(),
          };
          return {
            comments: [...state.comments, newComment],
          };
        });
      },
    }),
    {
      name: "sprintdesk-board-state",
      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
        users: state.users,
        sprints: state.sprints,
        isLoaded: state.isLoaded,
      }),
    }
  )
);
