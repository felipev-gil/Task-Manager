import request from "supertest";
import { randomUUID } from "node:crypto";
import { jest } from "@jest/globals";
import app from "../app.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { limitMock } from "./setup.js";

let token, id;
const api = (method, path, body, auth = token) => {
  const req = request(app)
    [method](`/api/tasks${path}`)
    .set("Authorization", `Bearer ${auth}`);
  return body === undefined ? req : req.send(body);
};
const register = async () => {
  const name = randomUUID();
  const res = await request(app)
    .post("/api/users/register")
    .send({
      name: "Test User",
      username: name,
      email: `${name}@example.com`,
      password: "12345678",
    });
  expect(res.status).toBe(201);
  return res.body.token;
};
beforeEach(async () => {
  token = await register();
  const res = await api("post", "", {
    title: "Literal [a].* (notes)",
    content: "Budget $5 + tax?",
    priority: "High",
  });
  id = res.body._id;
});

it.each([
  {},
  { state: null },
  { state: "" },
  { state: "Done" },
  { state: true },
  { state: ["Pending"] },
  { state: 1 },
])("rejects invalid state %j without changing task", async (body) => {
  const res = await api("patch", `/${id}/state`, body);
  expect(res.status).toBe(400);
  expect(res.body.errors[0]).toMatch(/State/);
  expect((await api("get", `/${id}`)).body.state).toBe("Pending");
});
it.each([
  {},
  { archived: null },
  { archived: "true" },
  { archived: "false" },
  { archived: 1 },
  { archived: 0 },
  { archived: [] },
  { archived: {} },
])("rejects invalid archived %j", async (body) => {
  expect((await api("patch", `/${id}/archive`, body)).status).toBe(400);
  expect((await api("get", `/${id}`)).body.archived).toBe(false);
});
it("archives and restores, preserving content and status", async () => {
  await api("patch", `/${id}/state`, { state: "Completed" });
  expect(
    (await api("patch", `/${id}/archive`, { archived: true })).body.archived,
  ).toBe(true);
  expect((await api("get", "")).body).toHaveLength(0);
  expect(
    (await api("get", "/archived")).body.tasks.map((task) => task._id),
  ).toEqual([id]);
  expect(
    (await api("patch", `/${id}/archive`, { archived: false })).body.archived,
  ).toBe(false);
  expect((await api("get", "/archived")).body.totalTasks).toBe(0);
  expect((await api("get", "")).body[0]).toMatchObject({
    state: "Completed",
    content: "Budget $5 + tax?",
  });
});
it.each(["[", ".*", "(notes)", "$5", "+", "?", "LITERAL"])(
  "searches literal text %s",
  async (search) => {
    await api("patch", `/${id}/archive`, { archived: true });
    const other = await api("post", "", {
      title: "Unrelated",
      content: "Other task",
      priority: "Low",
    });
    await api("patch", `/${other.body._id}/archive`, { archived: true });
    const res = await api(
      "get",
      `/archived?search=${encodeURIComponent(search)}`,
    );
    expect(res.status).toBe(200);
    expect(res.body.tasks.map((task) => task._id)).toEqual([id]);
  },
);
it("rejects overly long or repeated search values", async () => {
  expect((await api("get", `/archived?search=${"a".repeat(101)}`)).status).toBe(
    400,
  );
  expect((await api("get", "/archived?search=a&search=b")).status).toBe(400);
});
it.each(["delete", "restore"])(
  "clamps the last archive page after %s",
  async (action) => {
    const task = await Task.findById(id);
    await Task.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        title: `Archived ${i}`,
        content: "Test",
        user: task.user,
        archived: true,
      })),
    );
    await api("patch", `/${id}/archive`, { archived: true });
    const last = (await api("get", "/archived?page=2")).body;
    expect(last.tasks).toHaveLength(1);
    if (action === "delete") await api("delete", `/${last.tasks[0]._id}`);
    else
      await api("patch", `/${last.tasks[0]._id}/archive`, { archived: false });
    const res = (await api("get", "/archived?page=2")).body;
    expect(res).toMatchObject({
      currentPage: 1,
      totalPages: 1,
      totalTasks: 10,
    });
    expect(res.tasks).toHaveLength(10);
  },
);
it("denies another user's read and all update paths", async () => {
  const other = await register();
  for (const [method, path, body] of [
    ["get", `/${id}`],
    ["put", `/${id}`, { title: "Intruder" }],
    ["patch", `/${id}/state`, { state: "Completed" }],
    ["patch", `/${id}/archive`, { archived: true }],
  ])
    expect((await api(method, path, body, other)).status).toBe(404);
  expect((await api("get", `/${id}`)).body).toMatchObject({
    state: "Pending",
    archived: false,
    title: "Literal [a].* (notes)",
  });
  await api("patch", `/${id}/archive`, { archived: true });
  expect(
    (await api("get", "/archived", undefined, other)).body.totalTasks,
  ).toBe(0);
});
it("returns 500 rather than expiring a valid session on database failure", async () => {
  const spy = jest.spyOn(User, "findById").mockImplementationOnce(() => {
    throw new Error("Database unavailable");
  });
  try {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(500);
  } finally {
    spy.mockRestore();
  }
});
it("returns useful rate-limit and limiter outage responses without Upstash", async () => {
  limitMock.mockResolvedValueOnce({ success: false });
  expect((await api("get", "")).status).toBe(429);
  limitMock.mockRejectedValueOnce(new Error("Test limiter unavailable"));
  expect((await api("get", "")).status).toBe(503);
});
it("keeps the current IP limiter policy and does not trust spoofed forwarding headers", async () => {
  expect(app.get("trust proxy")).toBe(false);
  limitMock.mockClear();
  await request(app)
    .get("/api/tasks")
    .set("Authorization", `Bearer ${token}`)
    .set("X-Forwarded-For", "203.0.113.1");
  expect(limitMock).toHaveBeenCalledWith(expect.stringMatching(/^IP:/));
  expect(limitMock).not.toHaveBeenCalledWith("IP:203.0.113.1");
});
