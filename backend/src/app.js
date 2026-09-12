import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimiter from "./middlewares/rate.limiter.js";
import { authRequired } from "./middlewares/auth.js";
import { csrfProtection } from "./middlewares/csrf.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
const app = express();
// Set exact proxy hops or CIDRs for the hosting topology.
if (process.env.TRUST_PROXY)
  app.set(
    "trust proxy",
    /^\d+$/.test(process.env.TRUST_PROXY)
      ? Number(process.env.TRUST_PROXY)
      : process.env.TRUST_PROXY,
  );
app.disable("x-powered-by");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res
    .status(connected ? 200 : 503)
    .json({ status: connected ? "ok" : "unavailable" });
});
app.use(csrfProtection);
app.use("/api/users", userRoutes);
app.use("/api/tasks", authRequired, rateLimiter, taskRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);
export default app;
