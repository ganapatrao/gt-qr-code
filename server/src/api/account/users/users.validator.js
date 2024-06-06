import { body, validationResult } from "express-validator";
export const validateSignUp = [
  //This ensures the userName field is not empty.
  //If userName is empty, it will add an error with the message "Username should not be empty".
  body("userName")
    .notEmpty()
    .withMessage("User name should not be empty")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(
      "Username should not contain any number or special characters"
    ),
  body("email")
    .notEmpty()
    .withMessage("Email should not be empty")
    .isEmail()
    .withMessage("Email should be valid"),
  body("password")
    .notEmpty()
    .withMessage("Password should not be empty")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters"),

  // Middleware to handle validation result
  (req, res, next) => {
    const errors = validationResult(req); // Collects validation errors from the request
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next(); // If no errors, proceed to the next middleware/controller
  },
];
