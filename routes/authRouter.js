import express from "express";

import validateBody from "../decorators/validateBody.js";

import { signupSchema, signinSchema } from "../schemas/userSchema.js";

import authController from "../controllers/authController.js";

import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(signupSchema), authController.signup);

authRouter.post("/signin", validateBody(signinSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

export default authRouter;
