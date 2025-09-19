import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";

dotenv.config();

export const generateRefreshToken = (
  res: Response,
  userId: string,
  userRole: any
) => {
  const refreshToken = jwt.sign(
    { userId, userRole },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return refreshToken;
};
