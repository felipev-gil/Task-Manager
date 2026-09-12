import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useApiState } from "./useApiState";
import * as taskService from "../services/task.service";
import { handleApiError } from "../utils/handleApiError";

export const useTaskCollection = ({ archived = false, search = "" }) => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [revision, setRevision] = useState(0);
  const [pendingIds, setPendingIds] = useState([]);
  const pending = useRef(new Set());
  const {
    isLoading,
    setIsLoading,
    isRateLimited,
    setIsRateLimited,
    error,
    setError,
  } = useApiState(true);
  const retry = () => setRevision((value) => value + 1);

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      setIsRateLimited(false);
      try {
        const res = archived
          ? await taskService.getArchivedTasks({ page, limit: 10, search })
          : await taskService.getTasks();
        if (!active) return;
        setTasks(archived ? res.tasks : res);
        if (archived) {
          setTotalPages(res.totalPages);
          setPage(res.currentPage);
        }
      } catch (error) {
        if (!active) return;
        setError("Could not load tasks. Please try again.");
        setIsRateLimited(error.response?.status === 429);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchTasks();
    // Old searches must not replace newer results or clear their loading state.
    return () => {
      active = false;
    };
  }, [
    archived,
    search,
    page,
    revision,
    setIsLoading,
    setIsRateLimited,
    setError,
  ]);

  const mutate = async (id, operation, successMessage) => {
    if (pending.current.has(id)) return;
    pending.current.add(id);
    setPendingIds([...pending.current]);
    try {
      await operation();
      setTasks((prev) => prev.filter((task) => task._id !== id));
      if (archived) retry(); // Refill the page and let the API clamp an empty last page.
      toast.success(successMessage);
    } catch (error) {
      handleApiError(error, "Could not change the task. Please try again.");
    } finally {
      pending.current.delete(id);
      setPendingIds([...pending.current]);
    }
  };

  const deleteTask = (id) =>
    mutate(id, () => taskService.deleteTask(id), "Task deleted successfully");
  const archiveTask = (id, value = true) =>
    mutate(
      id,
      () => taskService.archiveTask(id, value),
      value ? "Task archived successfully" : "Task restored successfully",
    );

  const updateTaskState = async (id, state) => {
    const previous = tasks.find((task) => task._id === id);
    if (!previous || previous.state === state || pending.current.has(id))
      return;
    pending.current.add(id);
    setPendingIds([...pending.current]);
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, state } : task)),
    );
    try {
      await taskService.updateTaskState(id, state);
    } catch (error) {
      // Preserve changes to other tasks while restoring this task's status.
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, state: previous.state } : task,
        ),
      );
      handleApiError(
        error,
        "Could not move the task. Its previous status has been restored.",
      );
    } finally {
      pending.current.delete(id);
      setPendingIds([...pending.current]);
    }
  };

  return {
    tasks,
    isLoading,
    isRateLimited,
    error,
    retry,
    pendingIds,
    page,
    setPage,
    totalPages,
    deleteTask,
    archiveTask,
    updateTaskState,
  };
};
