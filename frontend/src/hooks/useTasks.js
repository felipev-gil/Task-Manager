import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as taskService from "../services/task.service";
import { handleApiError } from "../utils/handleApiError";

export const useTaskCollection = ({ archived = false, search = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const moving = useRef(false);
  const retry = () => {
    setIsLoading(true);
    setRevision((n) => n + 1);
  };
  useEffect(() => {
    const controller = new AbortController();
    const fetchTasks = async () => {
      try {
        if (archived) {
          const res = await taskService.getArchivedTasks(
            { page, limit: 10, search },
            controller.signal,
          );
          if (controller.signal.aborted) return;
          setTasks(res.tasks);
          setTotalPages(res.totalPages);
          setPage(res.currentPage);
        } else {
          const res = await taskService.getTasks(controller.signal);
          if (controller.signal.aborted) return;
          setTasks(res);
        }
        setError(null);
        setIsRateLimited(false);
      } catch (failure) {
        if (controller.signal.aborted) return;
        setError("Couldn't load tasks. Please retry.");
        setIsRateLimited(failure.response?.status === 429);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    fetchTasks();
    return () => controller.abort();
  }, [archived, search, page, revision]);
  const removeFromCollection = (id) => {
    setTasks((prev) => prev.filter((task) => task._id !== id));
    if (archived) retry();
  };
  const deleteTask = async (id) => {
    if (moving.current) return;
    try {
      await taskService.deleteTask(id);
      removeFromCollection(id);
      toast.success("Task deleted successfully");
    } catch (failure) {
      handleApiError(failure, "Failed to delete task");
    }
  };
  const archiveTask = async (id, archivedValue = true) => {
    if (moving.current) return;
    try {
      await taskService.archiveTask(id, archivedValue);
      removeFromCollection(id);
      toast.success(
        archivedValue ? "Task archived successfully" : "Task restored",
      );
    } catch (failure) {
      handleApiError(failure, "Failed to change archive status");
    }
  };
  const updateTaskState = async (taskId, state, position) => {
    if (moving.current) return;
    moving.current = true;
    setIsMoving(true);
    const previous = tasks.find((task) => task._id === taskId);
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, state, position } : task,
      ),
    );
    try {
      const updated = await taskService.updateTaskState(
        taskId,
        state,
        position,
      );
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updated : task)),
      );
    } catch (failure) {
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? previous : task)),
      );
      handleApiError(failure, "Could not move the task");
    } finally {
      moving.current = false;
      setIsMoving(false);
    }
  };
  return {
    tasks,
    isLoading,
    isRateLimited,
    error,
    retry,
    isMoving,
    page,
    setPage,
    totalPages,
    deleteTask,
    archiveTask,
    updateTaskState,
  };
};
