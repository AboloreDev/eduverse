import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";

export const reOrderChapters = catchAsyncError(async (req, res, next) => {
  const { courseId } = req.params;
  const { chapters } = req.body;

  try {
    if (!chapters || chapters.length === 0) {
      return next(new AppError(`Chapter not found`, 400));
    }

    await prisma.$transaction(
      chapters.map((chapter: any) =>
        prisma.chapter.update({
          where: {
            id: chapter.id,
            courseId: courseId,
          },
          data: { position: chapter.position },
        })
      )
    );

    res.status(200).json({
      success: true,
      message: "Chapter reordered successfully",
    });
  } catch (error: any) {
    console.error("Error reOrdering chapter:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});
