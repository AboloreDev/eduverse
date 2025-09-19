import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";

dotenv.config();

export const generateTokenAndSetCookie = (
  res: Response,
  userId: string,
  userRole: any
) => {
  const accessToken = jwt.sign(
    { userId, userRole },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1hr",
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });

  return accessToken;
};
