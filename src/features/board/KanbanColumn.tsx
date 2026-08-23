import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, ColumnId, User, Comment } from "../../types";
import { TaskCard } from "./TaskCard";

export interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  users: User[];
  comments: Comment[];
  onClickDetail: (task: Task) => void;
  onAddTask: (columnId: ColumnId) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  users,
  comments,
  onClickDetail,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const taskIds = tasks.map((t) => t.id);

  const columnAccents = {
    backlog: "bg-slate-400 dark:bg-slate-500",
    "in-progress": "bg-blue-500 dark:bg-blue-400",
    review: "bg-amber-500 dark:bg-amber-400",
    done: "bg-emerald-500 dark:bg-emerald-400",
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-[270px] w-full rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3 transition-colors ${
        isOver ? "bg-slate-200/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700" : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${columnAccents[id]}`} />
          <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {title}
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Add task to column"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[150px] pr-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => {
            const user = users.find((u) => u.id === task.assigneeId);
            const taskComments = comments.filter((c) => c.taskId === task.id);
            return (
              <TaskCard
                key={task.id}
                task={task}
                user={user}
                commentCount={taskComments.length}
                onClickDetail={onClickDetail}
              />
            );
          })}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-28 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};
