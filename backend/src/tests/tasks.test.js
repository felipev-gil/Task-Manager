import request from "supertest";
import app from "../app.js";

describe("Task Routes", () => {
  const createUserAndGetToken = async () => {
    const email = `test${Date.now()}@test.com`;

    const response = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        username: `user${Date.now()}`,
        email,
        password: "12345678",
      });

    return response.body.token;
  };

  it("should return user tasks", async () => {
    const token = await createUserAndGetToken();

    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task",
        content: "Content",
        priority: "Low",
      });

    const response = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a task", async () => {
    const token = await createUserAndGetToken();

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My Task",
        content: "Task Content",
        priority: "Low",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("My Task");
  });

  it("should update task state", async () => {
    const token = await createUserAndGetToken();

    const createdTask = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task",
        content: "Content",
        priority: "Low",
      });

    const response = await request(app)
      .patch(`/api/tasks/${createdTask.body._id}/state`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        state: "In Progress",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.state).toBe("In Progress");
  });

  it("should delete task", async () => {
    const token = await createUserAndGetToken();

    const createdTask = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task",
        content: "Content",
        priority: "Low",
      });

    const response = await request(app)
      .delete(`/api/tasks/${createdTask.body._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it("should not allow another user to delete the task", async () => {
    const token1 = await createUserAndGetToken();
    const token2 = await createUserAndGetToken();

    const createdTask = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token1}`)
      .send({
        title: "Task",
        content: "Content",
        priority: "Low",
      });

    const response = await request(app)
      .delete(`/api/tasks/${createdTask.body._id}`)
      .set("Authorization", `Bearer ${token2}`);

    expect(response.statusCode).toBe(404);
  });
});
