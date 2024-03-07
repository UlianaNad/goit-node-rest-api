import express from "express";

import validateBody from "../decorators/validateBody.js";

import { signupSchema, signinSchema } from "../schemas/userSchema.js";

import authController from "../controllers/authController.js";

import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import Jimp from "jimp";
const authRouter = express.Router();

authRouter.post(
  "/users/register",
  upload.single("avatar"),
  validateBody(signupSchema),
  authController.signup
);

authRouter.post(
  "/users/login",
  validateBody(signinSchema),
  authController.signin
);

authRouter.get("/users/current", authenticate, authController.getCurrent);

authRouter.post("users/logout", authenticate, authController.signout);

authRouter.patch("/users", authenticate, authController.updateSubscription);

authRouter.patch(
  "/users/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

export default authRouter;
