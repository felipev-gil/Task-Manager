import "dotenv/config";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
export const createStore = () => {
  if (
    process.env.RATE_LIMIT_STORE === "memory" ||
    process.env.NODE_ENV === "test"
  ) {
    if (process.env.NODE_ENV === "production")
      throw new Error("Production requires Upstash.");
    const buckets = new Map();
    return {
      async limit(key) {
        const now = Date.now();
        for (const [id, bucket] of buckets)
          if (bucket.reset <= now) buckets.delete(id);
        const bucket = buckets.get(key) || { count: 0, reset: now + 60000 };
        bucket.count += 1;
        buckets.set(key, bucket);
        return {
          success: bucket.count <= (key.startsWith("AUTH:") ? 10 : 100),
          reset: bucket.reset,
        };
      },
    };
  }
  const redis = Redis.fromEnv();
  const api = new Ratelimit({
    redis,
    prefix: "task:api",
    limiter: Ratelimit.slidingWindow(100, "1 m"),
  });
  const auth = new Ratelimit({
    redis,
    prefix: "task:auth",
    limiter: Ratelimit.slidingWindow(10, "1 m"),
  });
  return { limit: (key) => (key.startsWith("AUTH:") ? auth : api).limit(key) };
};
