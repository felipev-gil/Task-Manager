import express from "express";
import { authRequired } from "../middlewares/auth.js";
import {
  createTaskValidation,
  updateTaskValidation,
} from "../validators/task.validator.js";
import { taskIdValidation } from "../validators/id.validator.js";
import { validate } from "../validators/validateRequest.js";
import {
  getTasks,
  getTasksArchived,
  getTaskById,
  createTask,
  updateTask,
  updateTaskState,
  archiveTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.get("/", authRequired, validate, getTasks);
router.get("/archived", authRequired, validate, getTasksArchived);
router.get("/:id", authRequired, taskIdValidation, validate, getTaskById);
router.post("/", authRequired, createTaskValidation, validate, createTask);
router.put(
  "/:id",
  authRequired,
  taskIdValidation,
  updateTaskValidation,
  validate,
  updateTask,
);
router.patch(
  "/:id/state",
  authRequired,
  taskIdValidation,
  validate,
  updateTaskState,
);
router.patch(
  "/:id/archive",
  authRequired,
  taskIdValidation,
  validate,
  archiveTask,
);
router.delete("/:id", authRequired, taskIdValidation, validate, deleteTask);

export default router;
