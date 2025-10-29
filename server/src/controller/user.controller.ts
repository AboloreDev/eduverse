import { Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";
import AppError from "../utils/appError";
import { OK } from "../constants/statusCodes";
import { AuthRequest } from "../middleware/isAuthenticated";

export const getUserProfile = catchAsyncError(async (req, res, next) => {
  // get the user
  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { id: req.user.id },
  });

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  // return the response
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
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

export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id, role: "user" },
    });

    if (!user) {
      return next(new AppError("User not found", 400));
    }
    // check and update the tenant
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
    });

    // send a response
    return res.status(OK).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error marking lesson as completed:", error);
    return next(new AppError(`Failed to update user: ${error.message}`, 500));
  }
});
