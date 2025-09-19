import { Request, Response } from "express";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";
import AppError from "../utils/appError";
import { OK } from "../constants/statusCodes";

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
