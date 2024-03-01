import bcryptjs from "bcryptjs";
import User from "../models/User.js";

export const signup = async (data) => {
  const { password } = data;
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt);

  return User.create({ ...data, password: hashPassword });
};
