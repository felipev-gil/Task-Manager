import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRequired = async (req, res, next) => {
  let token;
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User associated with token not found." });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token." });
  }
};
