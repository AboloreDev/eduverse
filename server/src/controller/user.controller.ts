import { Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";
import AppError from "../utils/appError";
import { OK } from "../constants/statusCodes";
import { AuthRequest } from "../middleware/isAuthenticated";
import { initializeRedisclient } from "../utils/client";
import { authenticationKeyById } from "../utils/keys";

export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new AppError("Unauthorized: No user ID", 401));
  }
  const client = await initializeRedisclient();
  const authorizationkEY = authenticationKeyById(userId as string);

  try {
    // get the user from redis first
    const cachedUser = await client.get(authorizationkEY);

    if (cachedUser) {
      return res.status(OK).json({
        success: true,
        source: "cache",
        user: JSON.parse(cachedUser),
      });
    }

    // if missed, get from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user)
      return next(new AppError("Unauthorized Request: No token provided", 404));

    // 3. Store in Redis for future requests (cache for 1 hour)
    await client.setEx(authorizationkEY, 18000, JSON.stringify(user));

    // return the response
    res.status(OK).json({
      success: true,
      source: "database",
      user,
    });
  } catch (error: any) {
    return next(new AppError(`Failed to fetch profile: ${error.message}`, 500));
  }
});

export const getDashboardStats = catchAsyncError(
  async (req: AuthRequest, res, next) => {
    const [
      totalSignUps,
      totalCustomers,
      totalCourses,
      totalLessons,
      totalPayments,
    ] = await Promise.all([
      // Total sign ups
      prisma.user.count({
        where: { role: "user" },
      }),
      // total customers{}
      prisma.user.count({
        where: {
          payment: {
            some: {},
          },
        },
      }),
      // total courses
      prisma.course.count(),
      // total lessons
      prisma.lesson.count(),
      // get payment
      prisma.enrollment.count(),
    ]);

    res.status(200).json({
      totalSignUps,
      totalCustomers,
      totalCourses,
      totalLessons,
      totalPayments,
    });
  }
);
