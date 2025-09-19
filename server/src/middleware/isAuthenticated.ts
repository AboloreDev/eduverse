import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../utils/catchAsync";
import AppError from "../utils/appError";
import prisma from "../utils/prismaClient";
import { Request, Response, NextFunction } from "express";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.cookies?.accessToken as string;

  if (!token) {
    return next(new AppError("Unauthorized Request: No token provided", 400));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as MyJwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new AppError("Invalid token: user not found", 400));
    }

    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      data: {
        user,
      },
    });
  } catch (error: any) {
    return next(new AppError(`Server Error: ${error.message}`, 500));
  }
});
