import { describe, it, expect, beforeEach } from "vitest";
import { useBoardStore } from "../store/boardStore";
import type { Task } from "../types";

const sampleTask: Task = {
  id: 1,
  title: "Test Task",
  description: "Task description",
  status: "backlog",
  priority: "high",
  assigneeId: 1,
  dueDate: "2026-08-30",
  sprintId: 3,
  order: 1,
  createdAt: "2026-08-20T10:00:00Z",
  completedAt: null,
  updatedAt: "2026-08-20T10:00:00Z",
};

describe("Zustand Board Store", () => {
  beforeEach(() => {
    useBoardStore.setState({
      tasks: [sampleTask],
      comments: [],
      users: [],
      sprints: [],
      isLoaded: true,
      history: [],
    });
  });

  it("should add a new task to the store", () => {
    useBoardStore.getState().addTask({
      title: "New Created Task",
      description: "Desc",
      status: "in-progress",
      priority: "medium",
      assigneeId: 2,
      dueDate: "2026-08-25",
      sprintId: 3,
    });

    const tasks = useBoardStore.getState().tasks;
    expect(tasks.length).toBe(2);
    expect(tasks[1].title).toBe("New Created Task");
    expect(tasks[1].status).toBe("in-progress");
  });

  it("should move a task to another column", () => {
    useBoardStore.getState().moveTask(1, "done");

    const tasks = useBoardStore.getState().tasks;
    const movedTask = tasks.find((t) => t.id === 1);
    expect(movedTask).toBeDefined();
    expect(movedTask?.status).toBe("done");
    expect(movedTask?.completedAt).not.toBeNull();
  });

  it("should delete a task from the store", () => {
    useBoardStore.getState().deleteTask(1);

    const tasks = useBoardStore.getState().tasks;
    expect(tasks.length).toBe(0);
  });

  it("should undo the last action", () => {
    // Perform a move
    useBoardStore.getState().moveTask(1, "in-progress");
    expect(useBoardStore.getState().tasks[0].status).toBe("in-progress");

    // Perform undo
    const success = useBoardStore.getState().undoLastAction();
    expect(success).toBe(true);
    expect(useBoardStore.getState().tasks[0].status).toBe("backlog");
  });
});
