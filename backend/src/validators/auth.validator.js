import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be at least 3 characters long."),

  body("username")
    .isString()
    .bail()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be 1–50 characters."),

  body("email")
    .isString()
    .bail()
    .trim()
    .isEmail()
    .isLength({ max: 254 })
    .withMessage("Invalid email"),

  body("password")
    .isString()
    .bail()
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must be at most 72 bytes.")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters long."),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),

  body("password").notEmpty().withMessage("Password is required"),
];
