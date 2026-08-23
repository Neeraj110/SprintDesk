import React, { useState } from "react";
import { useNotificationStore } from "../../store/notificationStore";

export const NotificationPanel: React.FC = () => {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const isPanelOpen = useNotificationStore((s) => s.isPanelOpen);
  const setPanelOpen = useNotificationStore((s) => s.setPanelOpen);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (!isPanelOpen) return null;

  const totalPages = Math.ceil(notifications.length / pageSize) || 1;
  const paginatedItems = notifications.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-scale-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setPanelOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-400">
            No notifications available.
          </div>
        ) : (
          paginatedItems.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-4 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                !item.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`text-xs font-semibold ${
                    !item.read
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.title}
                </h4>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {item.message}
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 block">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 rounded border dark:border-slate-700 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 rounded border dark:border-slate-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
