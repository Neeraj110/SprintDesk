import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useNotificationStore } from "../../store/notificationStore";
import { NotificationPanel } from "../../features/notifications/NotificationPanel";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useThemeStore();
  
  const notifications = useNotificationStore((s) => s.notifications);
  const togglePanel = useNotificationStore((s) => s.togglePanel);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border ${
      isActive
        ? "bg-slate-100 text-slate-900 border-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700"
        : "text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Navigation */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 flex items-center justify-center text-white dark:text-slate-200 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              SprintDesk
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClasses}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 00-1 1m-6 0h6" />
              </svg>
              Dashboard
            </NavLink>
            <NavLink to="/board" className={navLinkClasses}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Board
            </NavLink>
            <NavLink to="/analytics" className={navLinkClasses}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </NavLink>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Prominent Theme Switch Button Pill */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-medium cursor-pointer"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          >
            {theme === "light" ? (
              <>
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light Mode</span>
              </>
            )}
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={togglePanel}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
            <NotificationPanel />
          </div>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.image || `https://i.pravatar.cc/150?u=${user.id}`}
                alt={user.firstName || user.username}
                className="w-7 h-7 rounded-md border border-slate-200 dark:border-slate-700 object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                  {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around">
        <NavLink to="/dashboard" className={navLinkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/board" className={navLinkClasses}>
          Board
        </NavLink>
        <NavLink to="/analytics" className={navLinkClasses}>
          Analytics
        </NavLink>
      </div>
    </header>
  );
};
