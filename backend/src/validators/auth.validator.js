import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long."),

  body("username").trim().notEmpty().withMessage("Username is required."),

  body("email").isEmail().withMessage("Invalid email"),

  body("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters long."),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),

  body("password").notEmpty().withMessage("Password is required"),
];
