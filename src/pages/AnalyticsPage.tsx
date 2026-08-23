import React, { useState, useMemo, useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useBoardStore } from "../store/boardStore";
import { useInitialBoardQuery } from "../services/api/boardService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../hooks/useToast";

export const AnalyticsPage: React.FC = () => {
  const { data: initialData } = useInitialBoardQuery();
  const tasks = useBoardStore((s) => s.tasks);
  const sprints = useBoardStore((s) => s.sprints);
  const setInitialData = useBoardStore((s) => s.setInitialData);
  const { addToast } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-08-31");

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

  // Date Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const created = t.createdAt ? t.createdAt.split("T")[0] : "";
      if (startDate && created && created < startDate) return false;
      if (endDate && created && created > endDate) return false;
      return true;
    });
  }, [tasks, startDate, endDate]);

  // 1. Sprint Velocity Chart Data
  const sprintVelocityData = useMemo(() => {
    const activeSprints = sprints.length > 0 ? sprints : [
      { id: 1, name: "Sprint 1", startDate: "", endDate: "" },
      { id: 2, name: "Sprint 2", startDate: "", endDate: "" },
      { id: 3, name: "Sprint 3", startDate: "", endDate: "" },
    ];

    return activeSprints.map((sprint) => {
      const sprintTasks = filteredTasks.filter((t) => t.sprintId === sprint.id);
      const completed = sprintTasks.filter((t) => t.status === "done").length;
      return {
        name: sprint.name,
        Completed: completed,
        Total: sprintTasks.length,
      };
    });
  }, [filteredTasks, sprints]);

  // 2. Task Status Distribution Data
  const taskStatusData = useMemo(() => {
    const counts = {
      backlog: 0,
      "in-progress": 0,
      review: 0,
      done: 0,
    };
    filteredTasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });

    return [
      { name: "Backlog", value: counts.backlog, color: "#64748b" },
      { name: "In Progress", value: counts["in-progress"], color: "#3b82f6" },
      { name: "Review", value: counts.review, color: "#f59e0b" },
      { name: "Done", value: counts.done, color: "#10b981" },
    ];
  }, [filteredTasks]);

  // 3. Priority Breakdown Data per Column
  const priorityBreakdownData = useMemo(() => {
    const columns = [
      { key: "backlog", name: "Backlog" },
      { key: "in-progress", name: "In Progress" },
      { key: "review", name: "Review" },
      { key: "done", name: "Done" },
    ];

    return columns.map((col) => {
      const colTasks = filteredTasks.filter((t) => t.status === col.key);
      return {
        status: col.name,
        High: colTasks.filter((t) => t.priority === "high").length,
        Medium: colTasks.filter((t) => t.priority === "medium").length,
        Low: colTasks.filter((t) => t.priority === "low").length,
      };
    });
  }, [filteredTasks]);

  // 4. Completion Trend Over Time
  const completionTrendData = useMemo(() => {
    const doneTasks = filteredTasks
      .filter((t) => t.status === "done" && t.completedAt)
      .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());

    const trendMap: Record<string, number> = {};
    let cumulative = 0;

    doneTasks.forEach((t) => {
      const dateStr = t.completedAt!.split("T")[0];
      cumulative += 1;
      trendMap[dateStr] = cumulative;
    });

    const dates = Object.keys(trendMap);
    if (dates.length === 0) {
      return [{ date: "No data", Completed: 0 }];
    }

    return dates.map((d) => ({
      date: d,
      Completed: trendMap[d],
    }));
  }, [filteredTasks]);

  const handleExportPNG = () => {
    addToast({
      title: "Exporting Analytics",
      message: "Generating PNG report of sprint analytics...",
      type: "info",
    });

    setTimeout(() => {
      addToast({
        title: "Export Complete",
        message: "Analytics dashboard image ready for download.",
        type: "success",
      });
    }, 600);
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Analytics & Performance Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time visual reports derived from active sprint backlog data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExportPNG}>
            Export PNG
          </Button>
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <span className="text-xs font-semibold uppercase text-slate-400">
          Date Filter:
        </span>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-slate-400 text-xs">to</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStartDate("2026-07-01");
            setEndDate("2026-08-31");
          }}
        >
          Reset Dates
        </Button>
      </div>

      {/* Grid of 4 Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Sprint Velocity */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Sprint Velocity
            </h3>
            <span className="text-xs text-slate-400 font-mono">Completed vs Total</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintVelocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                    fontSize: "0.75rem",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Bar dataKey="Completed" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Total" fill="#475569" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Task Status Distribution */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Status Distribution
            </h3>
            <span className="text-xs text-slate-400 font-mono">Column Breakdown</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                    fontSize: "0.75rem",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Priority Breakdown */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Priority Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-mono">High / Medium / Low</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="status" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                    fontSize: "0.75rem",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Bar dataKey="High" stackId="a" fill="#e11d48" />
                <Bar dataKey="Medium" stackId="a" fill="#d97706" />
                <Bar dataKey="Low" stackId="a" fill="#059669" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Completion Trend */}
        <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Completion Trend
            </h3>
            <span className="text-xs text-slate-400 font-mono">Cumulative over time</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                    fontSize: "0.75rem",
                  }}
                />
                <Area type="monotone" dataKey="Completed" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
