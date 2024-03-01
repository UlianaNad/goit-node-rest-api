import * as authServices from "../services/authServices.js";
import * as userServices from "../services/userServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email is already in use!");
  }

  const newUser = await authServices.signup(req.body);

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
  res.json({
    token,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};