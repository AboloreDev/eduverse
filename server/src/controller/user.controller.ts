import { Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";
import AppError from "../utils/appError";
import { OK } from "../constants/statusCodes";
import { AuthRequest } from "../middleware/isAuthenticated";

export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { id: req.user.id },
  });
  if (!user)
    return next(new AppError("Unauthorized Request: No token provided", 404));

  // return the response
  res.status(OK).json({
    user,
  });
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
