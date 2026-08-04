import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(
  payload,
  env.JWT_SECRET,
  {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  }
);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};