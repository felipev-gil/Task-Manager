import express from "express";
import { authRequired } from "../middlewares/auth.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/auth.validator.js";
import { validate } from "../validators/validateRequest.js";
import { register, login, me } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", authRequired, me);

export default router;
