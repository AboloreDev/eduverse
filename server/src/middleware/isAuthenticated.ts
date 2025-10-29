import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../utils/catchAsync";
import AppError from "../utils/appError";
import prisma from "../utils/prismaClient";
import { NextFunction, Request, Response } from "express";
import { FORBIDDEN } from "../constants/statusCodes";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "user" | "admin";
        emailVerified: boolean;
      };
    }
  }
}

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
    firstName: string;
    lastName: string;
    emailVerified: boolean;
  };
}

// Your protect middleware should look like this:
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  // Check Authorization header FIRST (for mobile with localStorage)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Fallback to cookie (for desktop)
  else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError("Please login to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
});

export const restrictTo = (role: "user" | "admin") => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(FORBIDDEN).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
