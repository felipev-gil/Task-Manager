import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sessionToken, clearSession } from "../config/session.js";
export const authRequired = async (req, res, next) => {
  const token = sessionToken(req);
  if (!token)
    return res.status(401).json({ message: "Please sign in to continue." });
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    clearSession(res);
    return res
      .status(401)
      .json({ message: "Your session expired. Please sign in again." });
  }
  try {
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      clearSession(res);
      return res.status(401).json({ message: "Please sign in again." });
    }
    next();
  } catch (error) {
    next(error);
  }
};
