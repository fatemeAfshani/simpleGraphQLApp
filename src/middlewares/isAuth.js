import jwt from "jsonwebtoken";
import { SECRET } from "../config";
import User from "../models/User";

const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  const userData = jwt.verify(token, SECRET);
  if (!userData) {
    req.isAuth = false;
    return next();
  }
  const user = await User.findById(userData.id);
  if (!user) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.user = user;
  return next();
};

export default isAuth;
