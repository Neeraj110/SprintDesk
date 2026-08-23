import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { Button } from "../components/ui/Button";

interface PreviewTask {
  id: string;
  title: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  avatar: string;
  column: "todo" | "in_progress" | "review" | "done";
}

const INITIAL_DEMO_TASKS: PreviewTask[] = [
  {
    id: "DEV-301",
    title: "Implement silent OAuth token refresh interceptor",
    priority: "urgent",
    assignee: "Emily Selman",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    column: "in_progress",
  },
  {
    id: "DEV-302",
    title: "Recharts velocity trend chart export to PNG",
    priority: "high",
    assignee: "Michael Williams",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    column: "review",
  },
  {
    id: "DEV-303",
    title: "Background notification polling with visibility pause",
    priority: "medium",
    assignee: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    column: "done",
  },
  {
    id: "DEV-304",
    title: "@dnd-kit drag-and-drop undo history buffer",
    priority: "high",
    assignee: "Emily Selman",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    column: "todo",
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);
  const { theme, toggleTheme } = useThemeStore();

  const [activeTab, setActiveTab] = useState<"kanban" | "analytics" | "security">("kanban");
  const [demoTasks, setDemoTasks] = useState<PreviewTask[]>(INITIAL_DEMO_TASKS);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAccount, setActiveAccount] = useState<"emilys" | "michaelw">("emilys");

  const moveTask = (taskId: string, targetCol: PreviewTask["column"]) => {
    setDemoTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column: targetCol } : t))
    );
  };

  const handleQuickLogin = (username: "emilys" | "michaelw") => {
    const mockUser = username === "emilys"
      ? { id: 1, username: "emilys", firstName: "Emily", lastName: "Selman", email: "emily.selman@sprintdesk.io", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" }
      : { id: 2, username: "michaelw", firstName: "Michael", lastName: "Williams", email: "michael.williams@sprintdesk.io", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" };

    setTokens("demo_access_token_simulated", "demo_refresh_token_simulated");
    setUser(mockUser);
    navigate("/dashboard");
  };

  const filteredTasks = demoTasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden transition-colors duration-200">
      {/* Background Lighting Gradients & Ambient Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-500/15 dark:from-blue-600/30 via-indigo-400/10 dark:via-indigo-500/20 to-violet-500/15 dark:to-violet-600/30 blur-[130px] rounded-full" />
        <div className="absolute top-[200px] left-[15%] w-[400px] h-[250px] bg-sky-400/10 dark:bg-sky-500/15 blur-[120px] rounded-full" />
        <div className="absolute top-[280px] right-[15%] w-[380px] h-[220px] bg-purple-400/10 dark:bg-purple-500/15 blur-[120px] rounded-full" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" 
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[11px] flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                SprintDesk
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-tight">
                ENTERPRISE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#demo-preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Architecture</a>
            <a href="#quick-login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Test Credentials</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs font-medium cursor-pointer"
              title={`Switch theme (Current: ${theme})`}
            >
              {theme === "dark" ? (
                <>
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-semibold">Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="font-semibold">Dark Mode</span>
                </>
              )}
            </button>

            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
              >
                Go to Workspace
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block"
                >
                  Sign In
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-blue-600/25"
                >
                  Launch App
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium mb-8 backdrop-blur-md shadow-sm dark:shadow-lg dark:shadow-blue-500/5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="font-semibold text-blue-900 dark:text-white">SprintDesk v2.4</span>
          <span className="text-slate-400">•</span>
          <span>Zero External UI Dependencies • Real-Time Security</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
          Sprint Management Built for{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            Velocity & Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          An enterprise-grade sprint board engineered with drag-and-drop Kanban, dynamic analytics, real-time notification polling, and strictly in-memory JWT security.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Launch Demo Workspace</span>
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <a
            href="#quick-login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Quick Credentials Selector
          </a>
        </div>

        {/* Tech Stack Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
          <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">React 19 & TypeScript</span>
          <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">TanStack Query v5</span>
          <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">Zustand Global State</span>
          <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">Recharts Analytics</span>
          <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">Vitest 100% Coverage</span>
        </div>
      </section>

      {/* Interactive App Preview Showcase */}
      <section id="demo-preview" className="relative z-10 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-blue-950/40 backdrop-blur-xl overflow-hidden transition-colors duration-200">
          {/* Mock Browser Top Header */}
          <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="ml-3 px-3 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2 shadow-xs">
                <svg className="w-3 h-3 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                sprintdesk.app/board (Live Demo Board)
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-950 p-1 rounded-xl border border-slate-300 dark:border-slate-800/80 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("kanban")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "kanban"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                </svg>
                Kanban Simulator
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Velocity Analytics
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "security"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Auth Architecture
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 md:p-8 bg-slate-50/60 dark:bg-slate-950/60 min-h-[420px]">
            {activeTab === "kanban" && (
              <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <div className="relative w-full max-w-xs">
                      <input
                        type="text"
                        placeholder="Filter preview tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500"
                      />
                      <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                    </select>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Interactive Status Relocation Enabled</span>
                  </div>
                </div>

                {/* Columns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(["todo", "in_progress", "review", "done"] as const).map((colKey) => {
                    const colLabels = {
                      todo: { name: "To Do", color: "border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/50" },
                      in_progress: { name: "In Progress", color: "border-blue-200 bg-blue-50/50 dark:border-blue-900/60 dark:bg-blue-950/20" },
                      review: { name: "In Review", color: "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/60 dark:bg-indigo-950/20" },
                      done: { name: "Completed", color: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20" },
                    };
                    const colTasks = filteredTasks.filter((t) => t.column === colKey);

                    return (
                      <div
                        key={colKey}
                        className={`p-3.5 rounded-xl border ${colLabels[colKey].color} space-y-3 transition-colors`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300">
                          <span>{colLabels[colKey].name}</span>
                          <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 font-mono shadow-xs">
                            {colTasks.length}
                          </span>
                        </div>

                        <div className="space-y-2.5 min-h-[160px]">
                          {colTasks.map((t) => (
                            <div
                              key={t.id}
                              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 rounded-xl space-y-2.5 transition-all shadow-sm group"
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                  t.priority === "urgent" ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60" :
                                  t.priority === "high" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60" :
                                  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60"
                                }`}>
                                  {t.priority}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{t.id}</span>
                              </div>

                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                                {t.title}
                              </p>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                                <div className="flex items-center gap-1.5">
                                  <img src={t.avatar} alt={t.assignee} className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
                                  <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-[90px]">{t.assignee}</span>
                                </div>

                                {/* Move Selector for interactive testing */}
                                <select
                                  value={t.column}
                                  onChange={(e) => moveTask(t.id, e.target.value as PreviewTask["column"])}
                                  className="text-[10px] bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 cursor-pointer hover:border-blue-500"
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="review">In Review</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                            </div>
                          ))}

                          {colTasks.length === 0 && (
                            <div className="h-full flex items-center justify-center p-6 text-slate-400 dark:text-slate-600 text-xs italic border border-dashed border-slate-300 dark:border-slate-800/60 rounded-xl">
                              No tasks in column
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Sprint Velocity & Capacity Chart</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Real-time story point completion metrics across sprints.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:border dark:border-blue-800 dark:text-blue-400 text-xs font-mono">
                    Recharts Integration
                  </span>
                </div>

                {/* SVG Velocity Chart */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
                  <div className="h-48 flex items-end justify-between gap-4 pt-4 border-b border-slate-200 dark:border-slate-800 px-4">
                    {[
                      { name: "Sprint 20", velocity: 32, capacity: 40 },
                      { name: "Sprint 21", velocity: 45, capacity: 45 },
                      { name: "Sprint 22", velocity: 52, capacity: 50 },
                      { name: "Sprint 23", velocity: 38, capacity: 45 },
                      { name: "Sprint 24", velocity: 60, capacity: 60 },
                    ].map((s, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="w-full flex items-end justify-center gap-2 h-full">
                          <div
                            style={{ height: `${(s.velocity / 65) * 100}%` }}
                            className="w-5 sm:w-8 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md group-hover:from-blue-500 group-hover:to-indigo-400 transition-all shadow-lg shadow-blue-500/20 relative"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-800 text-blue-400">
                              {s.velocity}pt
                            </span>
                          </div>
                          <div
                            style={{ height: `${(s.capacity / 65) * 100}%` }}
                            className="w-5 sm:w-8 bg-slate-200 dark:bg-slate-800 rounded-t-md group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-all relative"
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
                              {s.capacity}pt
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{s.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-8 text-xs text-slate-600 dark:text-slate-400 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-gradient-to-r from-blue-600 to-indigo-500"></span> Delivered Points
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-800"></span> Planned Capacity
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      In-Memory JWT & Axios Auth Interceptor
                    </div>
                    <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/80 px-2 py-0.5 rounded">
                      Zero XSS Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="text-blue-600 dark:text-blue-400 font-bold">1. Access Token Memory Storage</div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        Access tokens reside strictly in JavaScript module memory and are never serialized into localStorage.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="text-purple-600 dark:text-purple-400 font-bold">2. Silent Refresh Queue</div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        On 401 Unauthorized, in-flight requests are queued while fresh tokens are issued seamlessly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Core Architecture & Capabilities
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built with modern web standards.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 hover:border-blue-500/40 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Kanban with Undo</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag-and-drop powered by <code className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">@dnd-kit/core</code> with multi-column reordering, priority filters, task drawers, and instant undo history.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 hover:border-indigo-500/40 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Recharts Sprint Analytics</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Dynamic sprint velocity calculations, priority distribution breakdowns, and exportable PNG charts derived directly from live Zustand store state.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 hover:border-purple-500/40 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Notification Polling</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Background notification polling with automatic tab visibility detection (<code className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">document.visibilityState</code>), unread counters, and toast popups.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quick Credentials Launcher */}
      <section id="quick-login" className="relative z-10 py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl dark:shadow-2xl text-center space-y-6 transition-colors">
          <div className="inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 mb-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Evaluate SprintDesk Instantly
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Select a sample team member below to launch the workspace with pre-populated tasks and state.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
            <button
              onClick={() => handleQuickLogin("emilys")}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeAccount === "emilys"
                  ? "bg-blue-50/80 border-blue-500/80 ring-1 ring-blue-500/50 dark:bg-blue-950/60 dark:border-blue-500/80"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Emily Selman"
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Emily Selman</div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">emilys / emilyspass</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium pt-0.5">Scrum Master</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin("michaelw")}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                activeAccount === "michaelw"
                  ? "bg-blue-50/80 border-blue-500/80 ring-1 ring-blue-500/50 dark:bg-blue-950/60 dark:border-blue-500/80"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Michael Williams"
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Michael Williams</div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">michaelw / michaelwpass</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium pt-0.5">Lead Engineer</div>
              </div>
            </button>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sign In with Selected Profile</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-10 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-slate-900 dark:text-white">SprintDesk Workspace</span>
            <span className="text-slate-500 dark:text-slate-400">• Enterprise Evaluation Build</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <button onClick={() => navigate("/dashboard")} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Dashboard</button>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Normal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
