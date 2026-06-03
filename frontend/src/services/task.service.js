import api from "../utils/axios";

export const getTasks = async () => {
  const res = await api.get("/tasks");
  return res.data;
};

export const getArchivedTasks = async (params) => {
  const res = await api.get("/tasks/archived", {
    params,
  });
  return res.data;
};

export const getTaskById = async (id) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await api.post("/tasks", taskData);
  return res.data;
};

export const updateTask = async (id, taskData) => {
  const res = await api.put(`/tasks/${id}`, taskData);
  return res.data;
};

export const updateTaskState = async (id, state) => {
  const res = await api.patch(`/tasks/${id}/state`, { state });
  return res.data;
};

export const archiveTask = async (id, archived) => {
  const res = await api.patch(`/tasks/${id}/archive`, { archived });
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
