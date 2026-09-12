import express from "express";
import {
  createTaskValidation,
  updateTaskValidation,
  stateValidation,
  archiveValidation,
  archivedQueryValidation,
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
router.get("/", getTasks);
router.get("/archived", archivedQueryValidation, validate, getTasksArchived);
router.get("/:id", taskIdValidation, validate, getTaskById);
router.post("/", createTaskValidation, validate, createTask);
router.put(
  "/:id",
  taskIdValidation,
  updateTaskValidation,
  validate,
  updateTask,
);
router.patch(
  "/:id/state",
  taskIdValidation,
  stateValidation,
  validate,
  updateTaskState,
);
router.patch(
  "/:id/archive",
  taskIdValidation,
  archiveValidation,
  validate,
  archiveTask,
);
router.delete("/:id", taskIdValidation, validate, deleteTask);
export default router;
