import { NextFunction, Request, Response } from "express";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTRENAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../constants/statusCodes";
import prisma from "../utils/prismaClient";
import { compareValue, hashPassword } from "../utils/hashedPassword";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { loginSchema, registerUserSchema } from "../schemas/auth.schema";
import { catchAsyncError } from "../utils/catchAsync";
import AppError from "../utils/appError";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const registerUser = catchAsyncError(async (req, res, next) => {
  const request = registerUserSchema.parse(req.body);

  if (!request) return next(new AppError("All fields are required", 400));

  const existingUser = await prisma.user.findUnique({
    where: { email: request.email },
  });

  if (existingUser) return next(new AppError("Email already exits", 400));

  const hashedPassword = await hashPassword(request.password, 12);
  const otp = generateVerificationCode();

  try {
    const user = await prisma.user.create({
      data: {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        password: hashedPassword,
      },
    });

    const accessToken = generateTokenAndSetCookie(res, user.id, user.role);
    const refreshToken = generateRefreshToken(res, user.id, user.role);

    res.status(OK).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    return next(new AppError(`Registration failed: ${error.message}`, 500));
  }
});

export const refreshToken = catchAsyncError(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return next(new AppError("No refresh token", 400));

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as MyJwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return next(new AppError("User not found", 400));

    const newAccessToken = generateTokenAndSetCookie(res, user.id, user.role);

    res.status(OK).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        },
        newAccessToken,
      },
    });
  } catch (error: any) {
    return next(new AppError(`Refresh failed: ${error.message}`, 500));
  }
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const request = loginSchema.parse(req.body);

  try {
    if (!request) return next(new AppError("All fields are required", 400));

    const user = await prisma.user.findUnique({
      where: { email: request.email },
    });

    if (!user) return next(new AppError("Invalid email and password", 400));

    // compare password
    const isPasswordMatch = await compareValue(request.password, user.password);

    if (!isPasswordMatch)
      return next(new AppError("Invalid email and password", 400));

    const accessToken = generateTokenAndSetCookie(res, user.id, user.role);
    const refreshToken = generateRefreshToken(res, user.id, user.role);

    res.status(OK).json({
      sucess: true,
      message: "User logged in successfully",
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          emailVerfied: user.emailVerified,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    return next(new AppError(`Registration failed: ${error.message}`, 500));
  }
});

export const logoutUser = catchAsyncError(async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(OK)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error: any) {
    return next(new AppError(`Registration failed: ${error.message}`, 500));
  }
});

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Test database connection
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - startTime;

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "connected",
        responseTime: `${dbResponseTime}ms`,
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error: any) {
    console.error("Health check failed:", error);

    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "disconnected",
        error: error.message,
      },
      environment: process.env.NODE_ENV || "development",
    });
  }
};
