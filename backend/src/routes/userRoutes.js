import express from "express";
import { authRequired } from "../middleware/auth.js";
import { register, login, me } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);

export default router;
