import express from "express";
import { authRequired } from "../middleware/auth.js";

import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskState,
  archiveTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", authRequired, getAllTasks);
router.get("/:id", authRequired, getTaskById);
router.post("/", authRequired, createTask);
router.put("/:id", authRequired, updateTask);
router.patch("/:id/status", authRequired, updateTaskState);
router.patch("/:id/archive", authRequired, archiveTask);
router.delete("/:id", authRequired, deleteTask);

export default router;
