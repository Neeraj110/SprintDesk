import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";

export const AuthenticatedLayout: React.FC = () => {
  // Start simulated real-time notification polling (Task 05)
  useNotificationPolling(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />
      <main className="flex-1 pb-12">
        <Outlet />
      </main>
    </div>
  );
};
