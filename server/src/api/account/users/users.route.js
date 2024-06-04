import { signinUser, signupUser } from "./users.controller.js";
import Express from "express";

const userRouter = Express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/signin", signinUser);

export default userRouter;//gtx default link1
