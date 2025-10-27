import { chapterSchema } from "../schemas/chapter.schema";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import { initializeRedisclient } from "../utils/client";
import { singleChapterKey } from "../utils/keys";
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

export const createNewChapter = catchAsyncError(async (req, res, next) => {
  try {
    const request = chapterSchema.parse(req.body);

    if (!request) {
      return next(new AppError(`Invalid data`, 400));
    }

    const newChapter = await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.chapter.findFirst({
        where: { courseId: request.courseId },
        select: { position: true },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: request.name,
          courseId: request.courseId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Chapter creation was successful",
      data: newChapter,
    });
  } catch (error: any) {
    console.error("Error creating new chapter:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const deleteChapter = catchAsyncError(async (req, res, next) => {
  const { courseId, chapterId } = req.params;
  try {
    const coursesWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapters: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!coursesWithChapters) {
      return next(new AppError(`Course not found`, 400));
    }

    const chapters = coursesWithChapters.chapters;

    const chapterToDelete = chapters.find(
      (chapter) => chapter.id === chapterId
    );

    if (!chapterToDelete) {
      return next(
        new AppError(`There is no chapter found for this course`, 400)
      );
    }

    const remainingLessons = chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updateChapter = remainingLessons.map((chapter, idx) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: {
          position: idx + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updateChapter,
      prisma.chapter.delete({
        where: { id: chapterId, courseId: courseId },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Chapter deleted and position re-ordered successfully",
    });
  } catch (error: any) {
    console.error("Error deleting chapter:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});
