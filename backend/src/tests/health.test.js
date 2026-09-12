import request from "supertest";
import app from "../app.js";
it("keeps health checks available when login attempts are rate limited", async () => {
  for (let index = 0; index < 10; index++) {
    expect((await request(app).post("/api/users/login").set("Origin", process.env.CORS_ORIGIN).send({})).status).toBe(400);
  }
  const limited = await request(app).post("/api/users/login").set("Origin", process.env.CORS_ORIGIN).send({});
  expect(limited.status).toBe(429);
  const health = await request(app).get("/api/health");
  expect(health.status).toBe(200);
  expect(health.body.status).toBe("ok");
});
