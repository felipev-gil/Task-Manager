import request from "supertest";
import { randomUUID } from "node:crypto";
import app from "../app.js";
export const client = () => {
  const agent = request.agent(app);
  return {
    get: (path) => agent.get(path),
    post: (path) => agent.post(path).set("Origin", process.env.CORS_ORIGIN),
    put: (path) => agent.put(path).set("Origin", process.env.CORS_ORIGIN),
    patch: (path) => agent.patch(path).set("Origin", process.env.CORS_ORIGIN),
    delete: (path) => agent.delete(path).set("Origin", process.env.CORS_ORIGIN),
  };
};
export const registerClient = async () => {
  const api = client();
  const id = randomUUID();
  const user = {
    name: "Test User",
    username: id,
    email: id + "@test.com",
    password: "test-password-123",
  };
  const response = await api.post("/api/users/register").send(user);
  if (response.status !== 201) throw new Error(JSON.stringify(response.body));
  return { api, user, response };
};
export const createTask = async (api, overrides = {}) => {
  const res = await api
    .post("/api/tasks")
    .send({
      title: "A task",
      content: "Task content",
      priority: "Low",
      ...overrides,
    });
  if (res.status !== 201) throw new Error(JSON.stringify(res.body));
  return res.body;
};
