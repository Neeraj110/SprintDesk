export const FullScreenLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex h-screen w-screen items-center justify-center bg-white dark:bg-surface-dark"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-slate-200" />
    <span className="sr-only">Loading your session…</span>
  </div>
);
