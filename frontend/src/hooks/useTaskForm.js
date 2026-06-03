import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useApiState } from "./useApiState";
import * as taskService from "../services/task.service";
import { handleApiError } from "../utils/handleApiError";

export const useTaskForm = ({ taskId, onDeleteConfirm }) => {
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    content: "",
    priority: "Low",
  });

  const { isLoading, setIsLoading, isSaving, setIsSaving } =
    useApiState(!!taskId);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const res = await taskService.getTaskById(taskId);

        setTask({
          title: res.title,
          content: res.content,
          priority: res.priority,
          _id: res._id,
        });
      } catch (error) {
        handleApiError(error, "Failed to fetch task");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId, setIsLoading]);

  const updateField = (field, value) => {
    setTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveTask = async () => {
    const title = task.title.trim();
    const content = task.content.trim();

    if (!title || !content) {
      toast.error("Please add a title and content");
      return;
    }

    setIsSaving(true);

    try {
      if (taskId) {
        await taskService.updateTask(taskId, task);

        toast.success("Task updated successfully");
      } else {
        await taskService.createTask(task);

        toast.success("Task created successfully");
      }

      navigate("/tasks", { replace: true });
    } catch (error) {
      handleApiError(
        error,
        taskId ? "Failed to update task" : "Failed to create task",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async () => {
    const confirmed = await onDeleteConfirm();

    if (!confirmed) return;

    try {
      await taskService.deleteTask(taskId);

      toast.success("Task deleted successfully");

      navigate("/tasks", { replace: true });
    } catch (error) {
      handleApiError(error, "Failed to delete task");
    }
  };

  return {
    task,
    setTask,
    updateField,

    isLoading,
    isSaving,

    saveTask,
    deleteTask,
  };
};
