import { useEffect, useRef } from "react";
import { jsonPlaceholderClient } from "../services/api/httpClient";
import { useNotificationStore } from "../store/notificationStore";
import { useToast } from "./useToast";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export const useNotificationPolling = (enabled: boolean = true) => {
  const addNotificationsFromPosts = useNotificationStore(
    (s) => s.addNotificationsFromPosts
  );
  const isPanelOpen = useNotificationStore((s) => s.isPanelOpen);
  const { addToast } = useToast();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPostsAndNotify = async () => {
    // Skip if tab is hidden
    if (document.hidden) return;

    try {
      const { data } = await jsonPlaceholderClient.get<Post[]>("/posts?_limit=5");
      const added = addNotificationsFromPosts(data);

      if (added.length > 0 && !isPanelOpen) {
        addToast({
          title: `New Notification (${added.length})`,
          message: added[0].title,
          type: "info",
        });
      }
    } catch (err) {
      console.warn("Notification polling failed:", err);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch on mount
    fetchPostsAndNotify();

    const startPolling = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        fetchPostsAndNotify();
      }, 10000); // 10 seconds polling interval
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        // Resume polling & fetch immediately when visible
        fetchPostsAndNotify();
        startPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, isPanelOpen]);
};
