import { useMemo } from "react";
const columns = {
  Pending: { title: "Pending" },
  "In Progress": { title: "In Progress" },
  Completed: { title: "Completed" },
};
const priorityOrder = { High: 0, Medium: 1, Low: 2 };
const positionOf = (task) => task.position || 0;
export const useTaskBoard = ({ tasks, updateTaskState }) => {
  const visibleTasks = useMemo(
    () =>
      [...tasks].sort(
        (a, b) =>
          positionOf(a) - positionOf(b) ||
          priorityOrder[a.priority] - priorityOrder[b.priority] ||
          a._id.localeCompare(b._id),
      ),
    [tasks],
  );
  const groupedTasks = useMemo(
    () =>
      visibleTasks.reduce((result, task) => {
        (result[task.state] ??= []).push(task);
        return result;
      }, {}),
    [visibleTasks],
  );
  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;
    const target = (groupedTasks[destination.droppableId] || []).filter(
      (task) => task._id !== draggableId,
    );
    const before = target[destination.index - 1];
    const after = target[destination.index];
    const position =
      before && after
        ? (positionOf(before) + positionOf(after)) / 2
        : before
          ? positionOf(before) + 1024
          : after
            ? positionOf(after) - 1024
            : 1024;
    await updateTaskState(draggableId, destination.droppableId, position);
  };
  const priorityColor = (priority) =>
    priority === "High"
      ? "bg-error/60"
      : priority === "Medium"
        ? "bg-warning/60"
        : "bg-success/60";
  return { columns, groupedTasks, visibleTasks, handleDragEnd, priorityColor };
};
