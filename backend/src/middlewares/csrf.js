// All cookie-authenticated mutations, including login/logout, must have the frontend Origin.
export const csrfProtection = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (
    req.get("origin") !== (process.env.CORS_ORIGIN || "http://localhost:5173")
  ) {
    return res.status(403).json({ message: "Request origin is not allowed." });
  }
  next();
};
