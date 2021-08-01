import jwt from "jsonwebtoken";
import { SECRET } from "../config";

export const generateToken = async (user) => {
  const token = await jwt.sign(user, SECRET, { expiresIn: 6000 });
  return token;
};
