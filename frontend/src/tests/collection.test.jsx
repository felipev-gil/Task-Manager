import { vi, it, expect } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useTaskCollection } from "../hooks/useTasks";
import * as service from "../services/task.service";
vi.mock("../services/task.service", () => ({
  getTasks: vi.fn(),
  getArchivedTasks: vi.fn(),
  updateTaskState: vi.fn(),
  deleteTask: vi.fn(),
  archiveTask: vi.fn(),
}));
vi.mock("../utils/handleApiError", () => ({ handleApiError: vi.fn() }));
it("rolls back a failed optimistic task movement", async () => {
  service.getTasks.mockResolvedValue([
    { _id: "a", state: "Pending", position: 1 },
  ]);
  service.updateTaskState.mockRejectedValue(new Error("offline"));
  const { result } = renderHook(() => useTaskCollection({}));
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await act(async () => result.current.updateTaskState("a", "Completed", 2));
  expect(result.current.tasks[0]).toMatchObject({
    state: "Pending",
    position: 1,
  });
});
it("re-fetches pagination after deleting the last archived task", async () => {
  service.getArchivedTasks
    .mockResolvedValueOnce({
      tasks: [{ _id: "a" }],
      totalPages: 2,
      currentPage: 1,
    })
    .mockResolvedValue({ tasks: [], totalPages: 1, currentPage: 1 });
  service.deleteTask.mockResolvedValue({});
  const { result } = renderHook(() => useTaskCollection({ archived: true }));
  await waitFor(() => expect(result.current.tasks).toHaveLength(1));
  await act(async () => result.current.deleteTask("a"));
  await waitFor(() => expect(result.current.totalPages).toBe(1));
});
