import { param } from "express-validator";

export const taskIdValidation = [
  param("id").isMongoId().withMessage("Invalid task id"),
];
