import { useMemo } from "react";
import toast from "react-hot-toast";

const columns = {
  Pending: {
    title: "Pending",
  },

  "In Progress": {
    title: "In Progress",
  },

  Completed: {
    title: "Completed",
  },
};

const priorityOrder = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export const useTaskBoard = ({ tasks, updateTaskState }) => {
  const visibleTasks = useMemo(() => {
    return [...tasks].sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );
  }, [tasks]);

  const groupedTasks = useMemo(() => {
    return visibleTasks.reduce((acc, task) => {
      if (!acc[task.state]) {
        acc[task.state] = [];
      }

      acc[task.state].push(task);

      return acc;
    }, {});
  }, [visibleTasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      await updateTaskState(draggableId, destination.droppableId);
    } catch {
      toast.error("Failed to update task state");
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-error/60";

      case "Medium":
        return "bg-warning/60";

      default:
        return "bg-success/60";
    }
  };

  return {
    columns,
    groupedTasks,
    visibleTasks,
    handleDragEnd,
    priorityColor,
  };
};
