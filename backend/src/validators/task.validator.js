import { body, query } from "express-validator";

export const stateValidation = [
  body("state")
    .isString()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid state."),
  body("position")
    .optional()
    .custom(
      (value) =>
        typeof value === "number" &&
        Number.isFinite(value) &&
        Math.abs(value) <= 1e15,
    )
    .withMessage("Invalid position."),
];
export const archiveValidation = [
  body("archived")
    .custom((value) => typeof value === "boolean")
    .withMessage("Archived must be a boolean."),
];
export const archivedQueryValidation = [
  query()
    .custom((value) =>
      Object.keys(value).every((key) =>
        ["page", "limit", "search"].includes(key),
      ),
    )
    .withMessage("Unknown query parameter."),
  query("page")
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage("Invalid page."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50."),
  query("search")
    .optional()
    .isString()
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
