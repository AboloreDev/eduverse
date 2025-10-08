import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";

export const reOrderLessons = catchAsyncError(async (req, res, next) => {
  const { courseId, chapterId } = req.params;
  const { lessons } = req.body;

  try {
    if (!lessons || lessons.length === 0) {
      return next(new AppError(`Lesson not found`, 400));
    }

    await prisma.$transaction(
      lessons.map((lesson: any) =>
        prisma.lesson.update({
          where: {
            id: lesson.id,
            chapterId: chapterId,
          },
          data: { position: lesson.position },
        })
      )
    );

    res.status(200).json({
      success: true,
      message: "Lessons reordered successfully",
    });
  } catch (error: any) {
    console.error("Error deleting URL:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});
