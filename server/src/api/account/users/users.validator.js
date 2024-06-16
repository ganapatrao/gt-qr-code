import { body, validationResult } from "express-validator";
import { prepareResponse } from "../../../utils/response-handler.js";
import { validateToken } from "../../../../services/jwt/jwt.service.js";
import { userTokenModel } from "../../../../services/jwt/jwttokwn.model.js";
import { UserModel } from "./users.model.js";
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

export const validateAuthUser = async (req, res, next) => {
  try {
    //Extract the token from the Authorization header
    const token = req.headers["authorization"];

    if (!token) {
      const response = prepareResponse({}, "Unauthorized: No token provided");
      return res.status(401).send(response);
    }

    const decoded = await validateToken(token); //  returns==> { valid: true, userInfo: decoded };

    if (!decoded.valid) {
      const response = prepareResponse({}, "Unauthorized:  Invalid token");
      return res.status(401).send(response);
    }

    const { userId } = decoded.userInfo;
    // Check if the token exists in the UserTokens collection
    const usertokens = await userTokenModel.find({ accessTokens: token });
    if (!usertokens) {
      //* what could be the reason when token is already there and it is already validated how can it fail when we check in DB
      const response = prepareResponse({}, "Unauthorized: invalid token!!");
      res.status(401).send(response);
    }

    // Check if the user exists in the UserModel
    const user = UserModel.find({ userId });
    if (!user) {
      const response = prepareResponse(
        {},
        "The user is no longer active. Please contact admin"
      );
      return res.status(401).send(response);
    }

    //If all check pass, proceed to the next middlewear or route handler
    req.user = {
      userId,
      userName: user.userName,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).send("Internal server error");
  }
};
