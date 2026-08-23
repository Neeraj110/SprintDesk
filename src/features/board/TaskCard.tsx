import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, User } from "../../types";

export interface TaskCardProps {
  task: Task;
  user?: User;
  commentCount: number;
  onClickDetail: (task: Task) => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  user,
  commentCount,
  onClickDetail,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityStyles = {
    high: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/80",
    medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/80",
    low: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80",
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClickDetail(task)}
      className={`group p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-grab active:cursor-grabbing select-none ${
        isOverlay ? "shadow-lg border-slate-400 dark:border-slate-600 scale-102" : ""
      }`}
    >
      {/* Top Header: Priority Badge & Drag Handle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md border ${
            priorityStyles[task.priority] || priorityStyles.low
          }`}
        >
          {task.priority}
        </span>
        <span className="text-slate-300 dark:text-slate-700 group-hover:text-slate-400 text-xs">
          ⠿
        </span>
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {/* Assignee */}
        <div className="flex items-center gap-1.5" title={user?.name || "Assignee"}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              ?
            </div>
          )}
          <span className="text-[11px] text-slate-600 dark:text-slate-400 max-w-[80px] truncate">
            {user?.name?.split(" ")[0] || `User #${task.assigneeId}`}
          </span>
        </div>

        {/* Due Date & Comments */}
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          {commentCount > 0 && (
            <span className="flex items-center gap-1" title="Comments">
              💬 {commentCount}
            </span>
          )}
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                isOverdue
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {task.dueDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
