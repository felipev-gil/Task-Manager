import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useApiState } from "./useApiState";
import * as taskService from "../services/task.service";
import { handleApiError } from "../utils/handleApiError";

export const useTaskForm = ({ taskId, onDeleteConfirm }) => {
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", content: "", priority: "Low" });
  const [attempt, setAttempt] = useState(0);
  const busy = useRef(false);
  const { isLoading, setIsLoading, isSaving, setIsSaving, error, setError } =
    useApiState(!!taskId);
  useEffect(() => {
    if (!taskId) return;
    let active = true;
    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await taskService.getTaskById(taskId);
        if (active)
          setTask({
            title: res.title,
            content: res.content,
            priority: res.priority,
            state: res.state,
          });
      } catch (error) {
        if (active)
          setError(
            error.response?.status === 404
              ? "Task not found."
              : error.response?.status === 429
                ? "Too many requests. Please wait a moment, then retry."
                : "Could not load this task. Please try again.",
          );
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchTask();
    return () => {
      active = false;
    };
  }, [taskId, attempt, setIsLoading, setError]);
  const updateField = (field, value) =>
    setTask((prev) => ({ ...prev, [field]: value }));
  const saveTask = async () => {
    if (busy.current || isLoading || error) return;
    const title = task.title.trim();
    const content = task.content.trim();
    if (!title || !content)
      return toast.error("Please add a title and content");
    busy.current = true;
    setIsSaving(true);
    try {
      if (taskId)
        await taskService.updateTask(taskId, { ...task, title, content });
      else await taskService.createTask({ ...task, title, content });
      toast.success(
        taskId ? "Task updated successfully" : "Task created successfully",
      );
      navigate("/tasks", { replace: true });
    } catch (error) {
      handleApiError(error, "Could not save the task. Please try again.");
    } finally {
      busy.current = false;
      setIsSaving(false);
    }
  };
  const deleteTask = async () => {
    if (busy.current) return;
    busy.current = true;
    setIsSaving(true);
    try {
      if (!(await onDeleteConfirm())) return;
      await taskService.deleteTask(taskId);
      toast.success("Task deleted successfully");
      navigate("/tasks", { replace: true });
    } catch (error) {
      handleApiError(error, "Failed to delete task");
    } finally {
      busy.current = false;
      setIsSaving(false);
    }
  };
  return {
    task,
    updateField,
    isLoading,
    isSaving,
    error,
    retry: () => setAttempt((value) => value + 1),
    saveTask,
    deleteTask,
  };
};
