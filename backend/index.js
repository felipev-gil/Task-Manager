import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    for (const key of ["MONGO_URI", "JWT_SECRET", "CORS_ORIGIN"]) {
      if (!process.env[key])
        throw new Error(`Missing required variable: ${key}`);
    }
    if (process.env.JWT_SECRET.length < 32)
      throw new Error("JWT_SECRET must be at least 32 characters.");
    if (
      process.env.NODE_ENV === "production" &&
      (process.env.RATE_LIMIT_STORE === "memory" ||
        !process.env.UPSTASH_REDIS_REST_URL ||
        !process.env.UPSTASH_REDIS_REST_TOKEN)
    ) {
      throw new Error(
        "Production requires Upstash credentials and RATE_LIMIT_STORE=upstash.",
      );
    }
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running successfully on port: ${PORT}`);
    });
  } catch (error) {
    console.error("FATAL ERROR: Server startup failed.", error);
    process.exit(1);
  }
};

startServer();
