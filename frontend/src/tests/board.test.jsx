import { vi, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTaskBoard } from "../hooks/useTaskBoard";
it("persists a position when reordering within the same column", async () => {
  const updateTaskState = vi.fn().mockResolvedValue({});
  const tasks = [
    { _id: "a", state: "Pending", priority: "Low", position: 100 },
    { _id: "b", state: "Pending", priority: "High", position: 200 },
  ];
  const { result } = renderHook(() => useTaskBoard({ tasks, updateTaskState }));
  await act(async () =>
    result.current.handleDragEnd({
      draggableId: "b",
      source: { droppableId: "Pending", index: 1 },
      destination: { droppableId: "Pending", index: 0 },
    }),
  );
  expect(updateTaskState.mock.calls[0][0]).toBe("b");
  expect(updateTaskState.mock.calls[0][1]).toBe("Pending");
  expect(updateTaskState.mock.calls[0][2]).toBeLessThan(100);
});
