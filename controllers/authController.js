import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { updateSubscriptionSchema } from "../schemas/userSchema.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import Jimp from "jimp";
const avatarsDir = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email is already in use!");
  }
  // const { path: oldPath, filename } = req.file;
  // const newPath = path.join(contactDir, filename);

  // await fs.rename(oldPath, newPath);

  //const avatar = path.join("avatars", filename);
  const avatar = gravatar.url(email);
  const newUser = await authServices.signup({ ...req.body, avatar });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email is invalid");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is invalid!");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.setToken(user._id, token);

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, username } = req.user;

  res.json({
    email,
    username,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.setToken(_id);

  res.status(204).json({
    message: "No Content!",
  });
};

const validSubscriptionValues = ["starter", "pro", "business"];

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  if (!validSubscriptionValues.includes(subscription)) {
    return next(new HttpError(400, "Invalid subscription value"));
  }

  try {
    const { error } = updateSubscriptionSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const updatedUser = await userServices.updateSubscriptionByFilter(
      { _id },
      { subscription }
    );

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    console.log(req);
    const { path: oldPath, filename } = req.file;

    Jimp.read(oldPath, (err, img) => {
      if (err) throw err;
      img.resize(250, 250).write(`${avatarsDir}\\${filename}`);
      fs.rm(oldPath);
    });
    const avatar = path.join("avatars", filename);

    await authServices.setAvatar(_id, avatar);
    return res.json({ avatar });
  } catch (error) {
    next(error);
  }
};
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
