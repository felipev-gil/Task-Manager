import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {
  SESSION_COOKIE,
  cookieOptions,
  clearSession,
} from "../config/session.js";
const respondWithSession = (res, user, status) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
  res.cookie(SESSION_COOKIE, token, cookieOptions());
  res
    .status(status)
    .json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
};
export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({
    $or: [{ username }, { email: normalizedEmail }],
  });
  if (existing) throw new ApiError(409, "Username or email already exists.");
  const user = await User.create({
    name,
    username,
    email: normalizedEmail,
    password,
  });
  respondWithSession(res, user, 201);
});
export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email.trim().toLowerCase(),
  });
  if (!user || !(await user.matchPassword(req.body.password)))
    throw new ApiError(401, "Invalid credentials");
  respondWithSession(res, user, 200);
});
export const logout = (req, res) => {
  clearSession(res);
  res.status(204).end();
};
export const me = (req, res) => res.status(200).json(req.user);
