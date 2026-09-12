import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import { client, registerClient } from "./helpers.js";
describe("Session authentication", () => {
  it("registers with an HttpOnly cookie and a hashed password, without returning the token", async () => {
    const { user, response } = await registerClient();
    expect(response.headers["set-cookie"][0]).toContain("HttpOnly");
    expect(response.headers["set-cookie"][0]).toContain("SameSite=Lax");
    expect(response.body.token).toBeUndefined();
    expect(response.body.password).toBeUndefined();
    const stored = await User.findOne({ email: user.email });
    expect(stored.password).not.toBe(user.password);
    expect(await stored.matchPassword(user.password)).toBe(true);
  });
  it("logs in, reads the profile, and logs out", async () => {
    const { user } = await registerClient();
    const api = client();
    expect((await api.post("/api/users/login").send(user)).status).toBe(200);
    const me = await api.get("/api/users/me");
    expect(me.body.email).toBe(user.email);
    expect(me.body.password).toBeUndefined();
    expect((await api.post("/api/users/logout")).status).toBe(204);
    expect((await api.get("/api/users/me")).status).toBe(401);
  });
  it("rejects invalid credentials and unauthenticated requests", async () => {
    expect(
      (
        await client()
          .post("/api/users/login")
          .send({ email: "nobody@test.com", password: "wrong" })
      ).status,
    ).toBe(401);
    expect((await request(app).get("/api/tasks")).status).toBe(401);
  });
  it("rejects duplicate registration and malformed input", async () => {
    const { user } = await registerClient();
    expect((await client().post("/api/users/register").send(user)).status).toBe(
      409,
    );
    expect(
      (
        await client()
          .post("/api/users/register")
          .send({ ...user, password: "short" })
      ).status,
    ).toBe(400);
  });
  it("rejects expired cookies", async () => {
    const token = jwt.sign(
      { id: "507f1f77bcf86cd799439011" },
      process.env.JWT_SECRET,
      { expiresIn: -1 },
    );
    const res = await request(app)
      .get("/api/users/me")
      .set("Cookie", "task_session=" + token);
    expect(res.status).toBe(401);
    expect(res.headers["set-cookie"][0]).toContain("Expires=Thu, 01 Jan 1970");
  });
  it("blocks cross-origin and missing-Origin mutations", async () => {
    expect((await request(app).post("/api/users/logout")).status).toBe(403);
    expect(
      (
        await request(app)
          .post("/api/users/login")
          .set("Origin", "https://evil.example")
      ).status,
    ).toBe(403);
  });
});
