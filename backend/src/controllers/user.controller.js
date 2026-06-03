import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ username }, { email: normalizedEmail }],
  });

  if (existingUser?.username === username) {
    throw new ApiError(400, "Username already exists");
  }

  if (existingUser?.email === normalizedEmail) {
    throw new ApiError(400, "Email already exists");
  }

  const user = await User.create({
    name,
    username,
    email: normalizedEmail,
    password,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});
