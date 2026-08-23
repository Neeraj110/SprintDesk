import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useInitialBoardQuery } from "../../services/api/boardService";
import { useBoardStore } from "../../store/boardStore";
import { useAuthStore } from "../../store/authStore";
import type { Task, ColumnId, Priority } from "../../types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { CreateTaskModal } from "./CreateTaskModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { SkeletonCard } from "../../components/ui/Skeleton";
import { useToast } from "../../hooks/useToast";

export const KanbanBoard: React.FC = () => {
  const { data: initialData, isLoading: isQueryLoading } = useInitialBoardQuery();
  const setInitialData = useBoardStore((s) => s.setInitialData);
  const tasks = useBoardStore((s) => s.tasks);
  const comments = useBoardStore((s) => s.comments);
  const users = useBoardStore((s) => s.users);
  const sprints = useBoardStore((s) => s.sprints);
  const filter = useBoardStore((s) => s.filter);
  const setFilter = useBoardStore((s) => s.setFilter);
  const history = useBoardStore((s) => s.history);
  
  const moveTask = useBoardStore((s) => s.moveTask);
  const addTask = useBoardStore((s) => s.addTask);
  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const addComment = useBoardStore((s) => s.addComment);
  const undoLastAction = useBoardStore((s) => s.undoLastAction);

  const currentUser = useAuthStore((s) => s.user);
  const { addToast } = useToast();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultColumn, setCreateDefaultColumn] = useState<ColumnId>("backlog");
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);

  // Initialize board store when TanStack Query returns initial JSON
  useEffect(() => {
    if (initialData) {
      setInitialData({
        tasks: initialData.tasks.slice(0, 30),
        comments: initialData.comments,
        users: initialData.users,
        sprints: initialData.sprints,
      });
    }
  }, [initialData, setInitialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns: { id: ColumnId; title: string }[] = [
    { id: "backlog", title: "Backlog" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (
      filter.searchQuery &&
      !t.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !t.description?.toLowerCase().includes(filter.searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (filter.priority !== "all" && t.priority !== filter.priority) return false;
    if (filter.assigneeId !== "all" && t.assigneeId !== Number(filter.assigneeId)) return false;
    if (filter.sprintId !== "all" && t.sprintId !== Number(filter.sprintId)) return false;
    return true;
  });

  // Drag and Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    // Check if dragging over a column container or a task inside a column
    const overIsColumn = columns.some((c) => c.id === overId);
    let targetColId: ColumnId | null = null;
    let targetIndex: number | undefined = undefined;

    if (overIsColumn) {
      targetColId = overId as ColumnId;
    } else {
      const overTask = tasks.find((t) => t.id === Number(overId));
      if (overTask) {
        targetColId = overTask.status;
        const colTasks = filteredTasks.filter((t) => t.status === targetColId);
        targetIndex = colTasks.findIndex((t) => t.id === overTask.id);
      }
    }

    const currentTask = tasks.find((t) => t.id === activeId);
    if (targetColId && currentTask && currentTask.status !== targetColId) {
      moveTask(activeId, targetColId, targetIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      const activeId = Number(active.id);
      const overId = over.id;

      const overIsColumn = columns.some((c) => c.id === overId);
      if (overIsColumn) {
        moveTask(activeId, overId as ColumnId);
      } else {
        const overTask = tasks.find((t) => t.id === Number(overId));
        if (overTask) {
          moveTask(activeId, overTask.status);
        }
      }
    }
    setActiveTask(null);
  };

  const handleUndo = () => {
    const success = undoLastAction();
    if (success) {
      addToast({
        title: "Action Undone",
        message: "Restored previous board state.",
        type: "info",
      });
    }
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const openCreateModal = (columnId: ColumnId = "backlog") => {
    setCreateDefaultColumn(columnId);
    setIsCreateModalOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDeleteId) {
      deleteTask(taskToDeleteId);
      addToast({
        title: "Task Deleted",
        message: `Task #${taskToDeleteId} removed from board.`,
        type: "warning",
      });
      setTaskToDeleteId(null);
      if (selectedTask?.id === taskToDeleteId) {
        setIsDrawerOpen(false);
        setSelectedTask(null);
      }
    }
  };

  const priorityFilterOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ];

  const assigneeFilterOptions = [
    { value: "all", label: "All Assignees" },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  const sprintFilterOptions = [
    { value: "all", label: "All Sprints" },
    ...sprints.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Sprint Board
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drag and reorder tasks across sprint workflow columns.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleUndo}>
              ↩ Undo Move ({history.length})
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => openCreateModal("backlog")}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search task title or description..."
            value={filter.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={filter.priority}
            options={priorityFilterOptions}
            onChange={(e) => setFilter({ priority: e.target.value as Priority | "all" })}
          />
          <Select
            value={filter.assigneeId}
            options={assigneeFilterOptions}
            onChange={(e) => setFilter({ assigneeId: e.target.value === "all" ? "all" : Number(e.target.value) })}
          />
          <Select
            value={filter.sprintId}
            options={sprintFilterOptions}
            onChange={(e) => setFilter({ sprintId: e.target.value === "all" ? "all" : Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Board Columns Container */}
      {isQueryLoading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start min-h-[550px] pb-8">
            {columns.map((col) => {
              const colTasks = filteredTasks
                .filter((t) => t.status === col.id)
                .sort((a, b) => a.order - b.order);

              return (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  tasks={colTasks}
                  users={users}
                  comments={comments}
                  onClickDetail={openTaskDetail}
                  onAddTask={openCreateModal}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                user={users.find((u) => u.id === activeTask.assigneeId)}
                commentCount={comments.filter((c) => c.taskId === activeTask.id).length}
                onClickDetail={() => {}}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Details Side Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        users={users}
        comments={comments}
        currentUser={currentUser}
        onUpdateTask={updateTask}
        onDeleteTask={(id) => setTaskToDeleteId(id)}
        onAddComment={addComment}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultColumnId={createDefaultColumn}
        users={users}
        sprints={sprints}
        onCreate={(taskData) => {
          addTask(taskData);
          addToast({
            title: "Task Created",
            message: `Created '${taskData.title}' successfully.`,
            type: "success",
          });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={taskToDeleteId !== null}
        onClose={() => setTaskToDeleteId(null)}
        onConfirm={confirmDeleteTask}
        taskTitle={tasks.find((t) => t.id === taskToDeleteId)?.title}
      />
    </div>
  );
};
