import api from "../utils/axios";
export const login = async (userData) =>
  (await api.post("/users/login", userData)).data;
export const register = async (userData) =>
  (await api.post("/users/register", userData)).data;
export const getMe = async () => (await api.get("/users/me")).data;
export const logout = () => api.post("/users/logout");
