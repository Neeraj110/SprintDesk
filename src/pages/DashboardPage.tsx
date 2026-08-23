import React from "react";
import { useNavigate } from "react-router-dom";
import { useBoardStore } from "../store/boardStore";
import { useInitialBoardQuery } from "../services/api/boardService";
import { Button } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import type { Task } from "../types";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: initialData } = useInitialBoardQuery();
  const tasks = useBoardStore((s) => s.tasks);
  const users = useBoardStore((s) => s.users);
  const setInitialData = useBoardStore((s) => s.setInitialData);

  React.useEffect(() => {
    if (initialData && tasks.length === 0) {
      setInitialData({
        tasks: initialData.tasks.slice(0, 30),
        comments: initialData.comments,
        users: initialData.users,
        sprints: initialData.sprints,
      });
    }
  }, [initialData, tasks.length, setInitialData]);

  // Metrics
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const review = tasks.filter((t) => t.status === "review").length;
  const done = tasks.filter((t) => t.status === "done").length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  // Columns for DataTable
  const columns = [
    {
      key: "id",
      header: "Task ID",
      render: (t: Task) => (
        <span className="font-mono text-xs font-medium text-slate-500">
          TASK-{t.id}
        </span>
      ),
      sortable: true,
    },
    {
      key: "title",
      header: "Title",
      render: (t: Task) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {t.title}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (t: Task) => {
        const badgeColors = {
          backlog: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
          "in-progress": "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          review: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        };
        return (
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md border ${badgeColors[t.status]}`}>
            {t.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "priority",
      header: "Priority",
      render: (t: Task) => {
        const priorityColors = {
          high: "text-rose-600 dark:text-rose-400 font-medium",
          medium: "text-amber-600 dark:text-amber-400 font-medium",
          low: "text-emerald-600 dark:text-emerald-400",
        };
        return (
          <span className={`text-xs uppercase ${priorityColors[t.priority]}`}>
            {t.priority}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "assigneeId",
      header: "Assignee",
      render: (t: Task) => {
        const user = users.find((u) => u.id === t.assigneeId);
        return (
          <div className="flex items-center gap-2">
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700" />
            )}
            <span className="text-xs text-slate-700 dark:text-slate-300">{user?.name || `User #${t.assigneeId}`}</span>
          </div>
        );
      },
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (t: Task) => (
        <span className="text-xs text-slate-500 font-mono">
          {t.dueDate || "-"}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Executive Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-[11px] font-mono font-medium">
              Sprint #3 Active
            </span>
            <span className="text-xs text-slate-400 font-mono">Aug 17 – Aug 28, 2026</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sprint Management Overview
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Track real-time sprint status, task allocations, and execution velocity.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="primary"
            onClick={() => navigate("/board")}
          >
            Kanban Board →
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/analytics")}
          >
            Analytics
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">30 loaded</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{total}</p>
          <p className="text-xs text-slate-500">First 30 sprint backlog items</p>
        </div>

        {/* Card 2: Active Tasks */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Tasks</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{inProgress + review}</p>
          <p className="text-xs text-slate-500">{inProgress} In Progress, {review} Review</p>
        </div>

        {/* Card 3: Completed Tasks */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Tasks</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{done}</p>
          <p className="text-xs text-slate-500">Verified and done</p>
        </div>

        {/* Card 4: Completion Rate */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">{completionRate}%</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{completionRate}%</p>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Summary Table */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Task Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filtered and sortable overview of active sprint items.
            </p>
          </div>
        </div>

        <DataTable
          data={tasks}
          columns={columns}
          pageSize={6}
          searchPlaceholder="Search task title, status..."
          searchField={(t) => `${t.title} ${t.status} ${t.priority}`}
        />
      </div>
    </div>
  );
};
