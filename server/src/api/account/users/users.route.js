import { getprofile, signinUser, signupUser } from "./users.controller.js";
import { validateSignUp, validateAuthUser } from "./users.validator.js";

import Express from "express";

const userRouter = Express.Router();

userRouter.post("/signup", validateSignUp, signupUser);
userRouter.post("/signin", signinUser);
userRouter.get("/", validateAuthUser, getprofile);

export default userRouter; //gtx default link1
