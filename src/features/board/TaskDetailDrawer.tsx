import React, { useState, useEffect } from "react";
import type { Task, User, Comment, Priority, ColumnId } from "../../types";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  comments: Comment[];
  currentUser: User | null;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
  onAddComment: (taskId: number, authorId: number, message: string) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  users,
  comments,
  currentUser,
  onUpdateTask,
  onDeleteTask,
  onAddComment,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ColumnId>("backlog");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState<number>(1);
  const [dueDate, setDueDate] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId);
      setDueDate(task.dueDate || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);

  const handleSave = () => {
    onUpdateTask(task.id, {
      title,
      description,
      status,
      priority,
      assigneeId,
      dueDate,
    });
    onClose();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const authorId = currentUser ? currentUser.id : 1;
    onAddComment(task.id, authorId, newComment.trim());
    setNewComment("");
  };

  const statusOptions = [
    { value: "backlog", label: "Backlog" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const userOptions = users.map((u) => ({
    value: u.id,
    label: u.name,
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                TASK-{task.id}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                Sprint #{task.sprintId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                title="Delete Task"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-5">
            <Input
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add task details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Column Status"
                value={status}
                options={statusOptions}
                onChange={(e) => setStatus(e.target.value as ColumnId)}
              />
              <Select
                label="Priority"
                value={priority}
                options={priorityOptions}
                onChange={(e) => setPriority(e.target.value as Priority)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Assignee"
                value={assigneeId}
                options={userOptions}
                onChange={(e) => setAssigneeId(Number(e.target.value))}
              />
              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Comments Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                Comments ({taskComments.length})
              </h4>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {taskComments.map((c) => {
                  const author = users.find((u) => u.id === c.authorId);
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span>{author?.name || `User #${c.authorId}`}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {c.message}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="text-xs"
                />
                <Button type="submit" size="sm" variant="secondary">
                  Post
                </Button>
              </form>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
