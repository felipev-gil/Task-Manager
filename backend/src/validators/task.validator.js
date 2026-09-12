import { body, query } from "express-validator";

export const stateValidation = [
  body("state")
    .custom(
      (value) =>
        typeof value === "string" &&
        ["Pending", "In Progress", "Completed"].includes(value),
    )
    .withMessage(
      "State is required and must be Pending, In Progress, or Completed.",
    ),
];

export const archiveValidation = [
  body("archived")
    .custom((value) => typeof value === "boolean")
    .withMessage("Archived is required and must be a boolean (true or false)."),
];

export const archivedSearchValidation = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search must be text.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Search must be at most 100 characters."),
];

export const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title too long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content required")
    .bail()
    .isLength({ max: 300 })
    .withMessage("Content too long"),

  body("priority")
    .notEmpty()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority."),

  body("state")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid state."),
];

export const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("Title must be between 1 and 50 characters."),

  body("content")
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 300 })
    .withMessage("Content must be between 1 and 300 characters."),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority."),

  body("state")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid state."),
];
