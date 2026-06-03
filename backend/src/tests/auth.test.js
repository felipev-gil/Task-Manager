import request from "supertest";
import app from "../app.js";

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const email = `felipe${Date.now()}@test.com`;

    const response = await request(app)
      .post("/api/users/register")
      .send({
        name: "Felipe",
        username: `felipe${Date.now()}`,
        email,
        password: "12345678",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it("should login a user", async () => {
    const email = `felipe${Date.now()}@test.com`;

    await request(app)
      .post("/api/users/register")
      .send({
        name: "Felipe",
        username: `felipe${Date.now()}`,
        email,
        password: "12345678",
      });

    const response = await request(app).post("/api/users/login").send({
      email,
      password: "12345678",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.email).toBe(email);
  });

  it("should reject invalid credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "fake@test.com",
      password: "wrong",
    });

    expect(response.statusCode).toBe(400);
  });

  it("should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.statusCode).toBe(401);
  });

  it("should return authenticated user", async () => {
    const email = `john${Date.now()}@test.com`;

    const registerResponse = await request(app)
      .post("/api/users/register")
      .send({
        name: "Felipe",
        username: `felipe${Date.now()}`,
        email,
        password: "12345678",
      });

    const token = registerResponse.body.token;

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(email);
  });
});
