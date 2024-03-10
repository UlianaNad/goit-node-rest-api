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
import ElasticEmail from "@elasticemail/elasticemail-client";
import { nanoid } from "nanoid";

const avatarsDir = path.resolve("public", "avatars");

const { JWT_SECRET, ELASTICEMAIL_API_KEY, BASE_URL, ELASTICEMAIL_FROM } =
  process.env;
const defaultClient = ElasticEmail.ApiClient.instance;

const { apikey } = defaultClient.authentications;
apikey.apiKey = ELASTICEMAIL_API_KEY;
const api = new ElasticEmail.EmailsApi();

const callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log("API called successfully.");
  }
};

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email is already in use!");
  }

  const verificationCode = nanoid();
  const avatar = gravatar.url(email);
  const newUser = await authServices.signup({
    ...req.body,
    avatar,
    verificationCode,
  });

  const emailToSend = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient("visaxep171@fashlend.com")],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email!</a> )`,
        }),
      ],
      Subject: `Verify email`,
      From: ELASTICEMAIL_FROM,
    },
  });

  api.emailsPost(emailToSend, callback);

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

  if (!user.verify) {
    throw HttpError(401, "Email is not verified!");
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

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await userServices.findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, "User is not found!");
  }
  await userServices.updateUser(
    { _id: user._id },
    { verify: true, verificationCode: "" }
  );

  res.json({ message: "Verification is successful!" });
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
  verify: ctrlWrapper(verify),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
