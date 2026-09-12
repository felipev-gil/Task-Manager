import { createStore } from "../config/upstash.js";
export const createRateLimiter =
  (store, scope = "API") =>
  async (req, res, next) => {
    const identity =
      scope === "AUTH"
        ? "IP:" + req.ip
        : req.user?._id
          ? "USER:" + req.user._id
          : "IP:" + req.ip;
    try {
      const { success, reset } = await store.limit(scope + ":" + identity);
      if (!success) {
        res.set(
          "Retry-After",
          String(Math.max(1, Math.ceil((reset - Date.now()) / 1000))),
        );
        return res
          .status(429)
          .json({
            message: "Too many requests. Please wait a minute and retry.",
          });
      }
      next();
    } catch (error) {
      console.error("Rate-limit store unavailable:", error.message);
      res
        .status(503)
        .json({ message: "Service temporarily unavailable. Please retry." });
    }
  };
let store;
export const resetRateLimitStore = () => {
  store = undefined;
};
const lazyStore = { limit: (key) => (store ??= createStore()).limit(key) };
export const authRateLimiter = createRateLimiter(lazyStore, "AUTH");
export default createRateLimiter(lazyStore);
