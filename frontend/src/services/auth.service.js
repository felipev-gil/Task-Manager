import api from "../utils/axios";

export const login = async (userData) => {
  const res = await api.post("/users/login", userData);

  return res.data;
};

export const register = async (userData) => {
  const res = await api.post("/users/register", userData);

  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/users/me");

  return res.data;
};
