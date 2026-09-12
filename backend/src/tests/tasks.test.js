import { registerClient, createTask } from "./helpers.js";
describe("Task API", () => {
  it("creates, reads, edits, persists board position, archives and deletes", async () => {
    const { api } = await registerClient();
    const task = await createTask(api);
    expect((await api.get("/api/tasks")).body).toHaveLength(1);
    expect(
      (await api.put("/api/tasks/" + task._id).send({ title: "Updated" })).body
        .title,
    ).toBe("Updated");
    expect(
      (
        await api
          .patch("/api/tasks/" + task._id + "/state")
          .send({ state: "Completed", position: 12.5 })
      ).status,
    ).toBe(200);
    const reloaded = await api.get("/api/tasks/" + task._id);
    expect(reloaded.body).toMatchObject({ state: "Completed", position: 12.5 });
    await api.patch("/api/tasks/" + task._id + "/state").send({ state: "Completed", position: 0 });
    expect((await api.get("/api/tasks")).body[0].position).toBe(0);
    expect(
      (
        await api
          .patch("/api/tasks/" + task._id + "/archive")
          .send({ archived: true })
      ).status,
    ).toBe(200);
    expect((await api.get("/api/tasks")).body).toHaveLength(0);
    expect((await api.get("/api/tasks/archived")).body.totalTasks).toBe(1);
    expect((await api.delete("/api/tasks/" + task._id)).status).toBe(200);
    expect((await api.get("/api/tasks/" + task._id)).status).toBe(404);
  });
  it("prevents a second user from reading, editing, moving, archiving or deleting a task", async () => {
    const { api } = await registerClient();
    const task = await createTask(api);
    const { api: stranger } = await registerClient();
    expect((await stranger.get("/api/tasks")).body).toEqual([]);
    expect((await stranger.get("/api/tasks/" + task._id)).status).toBe(404);
    expect(
      (await stranger.put("/api/tasks/" + task._id).send({ title: "Stolen" }))
        .status,
    ).toBe(404);
    expect(
      (
        await stranger
          .patch("/api/tasks/" + task._id + "/state")
          .send({ state: "Completed" })
      ).status,
    ).toBe(404);
    expect(
      (
        await stranger
          .patch("/api/tasks/" + task._id + "/archive")
          .send({ archived: true })
      ).status,
    ).toBe(404);
    expect((await stranger.delete("/api/tasks/" + task._id)).status).toBe(404);
  });
  it("returns 400 for invalid IDs, state, archive flag, position and query parameters", async () => {
    const { api } = await registerClient();
    const task = await createTask(api);
    expect((await api.get("/api/tasks/not-an-id")).status).toBe(400);
    for (const body of [
      {},
      { state: "Unknown" },
      { state: "Pending", position: "1" },
    ]) {
      expect(
        (await api.patch("/api/tasks/" + task._id + "/state").send(body))
          .status,
      ).toBe(400);
    }
    for (const body of [{}, { archived: "false" }, { archived: null }]) {
      expect(
        (await api.patch("/api/tasks/" + task._id + "/archive").send(body))
          .status,
      ).toBe(400);
    }
    expect((await api.get("/api/tasks/archived?limit=999")).status).toBe(400);
    expect((await api.get("/api/tasks/archived?search[x]=bad")).status).toBe(
      400,
    );
  });
  it("treats search as literal text and clamps an empty last page after deletion", async () => {
    const { api } = await registerClient();
    const task = await createTask(api, { title: "Literal [bracket]" });
    await api
      .patch("/api/tasks/" + task._id + "/archive")
      .send({ archived: true });
    const result = await api.get(
      "/api/tasks/archived?search=%5B&page=20&limit=1",
    );
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      currentPage: 1,
      totalPages: 1,
      totalTasks: 1,
    });
    await api.delete("/api/tasks/" + task._id);
    expect((await api.get("/api/tasks/archived?page=20")).body).toMatchObject({
      currentPage: 1,
      totalTasks: 0,
    });
  });
});
