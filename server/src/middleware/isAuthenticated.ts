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

export const isAuthenticated = catchAsyncError(
  async (req: AuthRequest, res, next) => {
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
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return next(new AppError("Invalid token: user not found", 400));
      }

      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as "user" | "admin",
        emailVerified: user.emailVerified,
      };

      next();
    } catch (error: any) {
      return next(new AppError(`Server Error: ${error.message}`, 500));
    }
  }
);

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
