import React, { useState } from "react";
import type { Priority, ColumnId, User, Sprint } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultColumnId?: ColumnId;
  users: User[];
  sprints: Sprint[];
  onCreate: (taskData: {
    title: string;
    description: string;
    status: ColumnId;
    priority: Priority;
    assigneeId: number;
    dueDate: string;
    sprintId: number;
  }) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultColumnId = "backlog",
  users,
  sprints,
  onCreate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ColumnId>(defaultColumnId);
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState<number>(users[0]?.id || 1);
  const [sprintId, setSprintId] = useState<number>(sprints[sprints.length - 1]?.id || 3);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      dueDate,
      sprintId,
    });

    setTitle("");
    setDescription("");
    onClose();
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

  const sprintOptions = sprints.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Sprint Task"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement user permissions"
          required
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
            placeholder="Add task requirements..."
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
          <Select
            label="Sprint"
            value={sprintId}
            options={sprintOptions}
            onChange={(e) => setSprintId(Number(e.target.value))}
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </form>
    </Modal>
  );
};
