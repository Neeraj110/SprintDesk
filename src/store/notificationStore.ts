import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppNotification } from "../types";

interface NotificationState {
  notifications: AppNotification[];
  seenPostIds: number[];
  isPanelOpen: boolean;
  
  // Actions
  setInitialNotifications: (initial: AppNotification[]) => void;
  addNotificationsFromPosts: (posts: Array<{ id: number; title: string; body: string }>) => AppNotification[];
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      seenPostIds: [],
      isPanelOpen: false,

      setInitialNotifications: (initial) => {
        if (get().notifications.length === 0) {
          set({ notifications: initial });
        }
      },

      addNotificationsFromPosts: (posts) => {
        const { seenPostIds, notifications } = get();
        const newNotifications: AppNotification[] = [];
        const newSeenIds: number[] = [...seenPostIds];

        posts.forEach((post) => {
          if (!newSeenIds.includes(post.id)) {
            newSeenIds.push(post.id);

            // Avoid duplicating existing IDs
            const existingId = notifications.find((n) => n.id === post.id);
            if (!existingId) {
              const item: AppNotification = {
                id: post.id,
                title: post.title.slice(0, 30) + "...",
                message: post.body.slice(0, 80) + "...",
                type: "system",
                read: false,
                createdAt: new Date().toISOString(),
              };
              newNotifications.push(item);
            }
          }
        });

        if (newNotifications.length > 0) {
          set((state) => ({
            seenPostIds: newSeenIds,
            notifications: [...newNotifications, ...state.notifications],
          }));
        }

        return newNotifications;
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

      setPanelOpen: (open) => set({ isPanelOpen: open }),
    }),
    {
      name: "sprintdesk-notifications",
      partialize: (state) => ({
        notifications: state.notifications,
        seenPostIds: state.seenPostIds,
      }),
    }
  )
);
