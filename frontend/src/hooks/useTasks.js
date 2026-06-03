import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useApiState } from "./useApiState";
import * as taskService from "../services/task.service";
import { handleApiError } from "../utils/handleApiError";

export const useTaskCollection = ({ archived = false, search = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isLoading, setIsLoading, isRateLimited, setIsRateLimited } =
    useApiState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (archived) {
          const res = await taskService.getArchivedTasks({
            page,
            limit: 10,
            search,
          });

          setTasks(res.tasks);
          setTotalPages(res.totalPages);
        } else {
          const res = await taskService.getTasks();

          setTasks(res);
        }

        setIsRateLimited(false);
      } catch (error) {
        handleApiError(error, "Failed to fetch tasks");

        if (error.response?.status === 429) {
          setIsRateLimited(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [archived, search, page, setIsLoading, setIsRateLimited]);

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);

      setTasks((prev) => prev.filter((task) => task._id !== id));

      toast.success("Task deleted successfully");
    } catch (error) {
      handleApiError(error, "Failed to delete task");
    }
  };

  const archiveTask = async (id, archivedValue = true) => {
    try {
      await taskService.archiveTask(id, archivedValue);

      setTasks((prev) => prev.filter((task) => task._id !== id));

      toast.success(
        archivedValue
          ? "Task archived successfully"
          : "Task unarchived successfully",
      );
    } catch (error) {
      handleApiError(
        error,
        archivedValue ? "Failed to archive task" : "Failed to unarchive task",
      );
    }
  };

  const updateTaskState = async (taskId, newState) => {
    const previousTasks = [...tasks];

    const updatedTasks = tasks.map((task) =>
      task._id === taskId
        ? {
            ...task,
            state: newState,
          }
        : task,
    );

    setTasks(updatedTasks);

    try {
      await taskService.updateTaskState(taskId, newState);
    } catch (error) {
      setTasks(previousTasks);

      handleApiError(error, "Could not move the task");
    }
  };

  return {
    tasks,

    isLoading,
    isRateLimited,

    page,
    setPage,
    totalPages,

    deleteTask,
    archiveTask,
    updateTaskState,
  };
};
