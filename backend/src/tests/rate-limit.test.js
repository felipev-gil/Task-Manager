import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createRateLimiter } from "../middlewares/rate.limiter.js";
describe("Rate limiting", () => {
  it("keys authenticated requests by user and returns Retry-After on 429", async () => {
    const limit = jest
      .fn()
      .mockResolvedValue({ success: false, reset: Date.now() + 60000 });
    const app = express();
    app.use((req, res, next) => {
      req.user = { _id: "alice" };
      next();
    });
    app.use(createRateLimiter({ limit }));
    app.get("/", (req, res) => res.sendStatus(200));
    const response = await request(app).get("/");
    expect(limit).toHaveBeenCalledWith("API:USER:alice");
    expect(response.status).toBe(429);
    expect(Number(response.headers["retry-after"])).toBeGreaterThan(0);
  });
  it("uses IP for auth attempts and fails closed during store outages", async () => {
    const limit = jest.fn().mockRejectedValue(new Error("offline"));
    const app = express();
    app.use(createRateLimiter({ limit }, "AUTH"));
    expect((await request(app).get("/")).status).toBe(503);
    expect(limit.mock.calls[0][0]).toMatch(/^AUTH:IP:/);
  });
});
