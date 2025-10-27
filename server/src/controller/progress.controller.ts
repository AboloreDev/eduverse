import { OK } from "../constants/statusCodes";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";

export const markAsCompleted = catchAsyncError(async (req, res, next) => {
  const user = req.user!;
  const { lessonId, courseId } = req.params;
  const { isCompleted } = req.body;

  try {
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        lessonId: lessonId,
        userId: user.id,
        isCompleted: true,
      },
    });

    return res.status(OK).json({
      success: true,
      message: "Lesson marked as completed",
      data: progress,
    });
  } catch (error: any) {
    console.error("Error marking lesson as completed:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});
