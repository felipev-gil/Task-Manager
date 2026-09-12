export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.code === 11000)
    return res
      .status(409)
      .json({ message: "Username or email already exists." });
  if (error.name === "ValidationError" || error.name === "CastError")
    return res.status(400).json({ message: "Invalid request data." });
  const status = error.statusCode || error.status || 500;
  if (status >= 500 && process.env.NODE_ENV !== "test") console.error(error);
  res
    .status(status)
    .json({
      success: false,
      message:
        status >= 500 ? "Server error. Please try again later." : error.message,
    });
};
