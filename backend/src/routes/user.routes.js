import express from "express";
import { authRequired } from "../middlewares/auth.js";
import rateLimiter, { authRateLimiter } from "../middlewares/rate.limiter.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";
import { validate } from "../validators/validateRequest.js";
import { register, login, logout, me } from "../controllers/user.controller.js";
const router = express.Router();
router.post(
  "/register",
  authRateLimiter,
  registerValidation,
  validate,
  register,
);
router.post("/login", authRateLimiter, loginValidation, validate, login);
router.post("/logout", logout);
router.get("/me", authRequired, rateLimiter, me);
export default router;
