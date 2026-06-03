import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  let limiterKey;

  if (req.user && req.user._id) {
    limiterKey = `USER:${req.user._id}`;
  } else if (typeof req.ip === "string" && req.ip) {
    limiterKey = `IP:${req.ip}`;
  } else {
    return res.status(403).json({ message: "Rate limiting key unavailable." });
  }

  try {
    const { success } = await ratelimit.limit(limiterKey);
    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
    next();
  } catch (error) {
    console.error("Rate limit middleware error:", error);

    res.status(503).json({
      message:
        "Service temporarily unavailable due to rate limiting backend issues.",
    });
  }
};

export default rateLimiter;
