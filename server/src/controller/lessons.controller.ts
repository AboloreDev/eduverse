import { OK } from "../constants/statusCodes";
import { lessonSchema } from "../schemas/lessons.schema";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import { initializeRedisclient } from "../utils/client";
import {
  lessonContentForEnrolledUser,
  singleLessonKeyById,
} from "../utils/keys";
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

export const createNewLesson = catchAsyncError(async (req, res, next) => {
  try {
    const request = lessonSchema.parse(req.body);

    if (!request) return next(new AppError(`Invalid data`, 400));

    const newLesson = await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.lesson.findFirst({
        where: { chapterId: request.chapterId },
        select: { position: true },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: request.name,
          description: request.description,
          videoKey: request.videoKey || "",
          thumbnailKey: request.thumbnailKey || "",
          chapterId: request.chapterId,
          position: (maxPosition?.position ?? 0) + 1,
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Lesson creation was successful",
      data: newLesson,
    });
  } catch (error: any) {
    console.error("Error creating lesson:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const deleteLesson = catchAsyncError(async (req, res, next) => {
  const { chapterId, lessonId } = req.params;
  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
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

    if (!chapterWithLessons) {
      return next(new AppError(`Chapter not found`, 400));
    }

    const lessons = chapterWithLessons.lessons;

    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);

    if (!lessonToDelete) {
      return next(
        new AppError(`There is no lesson found for this chapter`, 400)
      );
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);

    const updateLessons = remainingLessons.map((lesson, idx) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          position: idx + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updateLessons,
      prisma.lesson.delete({
        where: { id: lessonId, chapterId: chapterId },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Lesson deleted and positions re-ordered successfully",
    });
  } catch (error: any) {
    console.error("Error deleting lessons:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const fetchSingleLessonDetails = catchAsyncError(
  async (req, res, next) => {
    const { courseId, chapterId, lessonId } = req.params;

    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId, chapterId: chapterId },
        select: {
          id: true,
          title: true,
          description: true,
          position: true,
          thumbnailKey: true,
          videoKey: true,
          chapterId: true,
        },
      });

      if (!lesson) return next(new AppError(`Lesson not found`, 400));

      res.status(200).json({
        success: true,
        message: "Lessons fetched successfully",
        data: lesson,
      });
    } catch (error: any) {
      console.error("Error fetching lesson:", error);

      return next(new AppError(`Something went wrong: ${error.message}`, 500));
    }
  }
);

export const updateLesson = catchAsyncError(async (req, res, next) => {
  const { courseId, chapterId, lessonId } = req.params;

  try {
    const request = lessonSchema.parse(req.body);

    if (!request) return next(new AppError(`All fields are required`, 400));

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId, chapterId: chapterId },
      data: {
        title: request.name,
        thumbnailKey: request.thumbnailKey,
        videoKey: request.videoKey,
        description: request.description,
      },
    });

    res.status(200).json({
      success: true,
      message: "Lessons updated successfully",
      data: updatedLesson,
    });
  } catch (error: any) {
    console.log("Error updating lesson", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const fetchLessonContentForEnrolledUser = catchAsyncError(
  async (req, res, next) => {
    const user = req.user!;
    const { lessonId } = req.params;

    try {
      const lessonContent = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
          id: true,
          thumbnailKey: true,
          videoKey: true,
          title: true,
          position: true,
          description: true,
          progress: {
            where: { userId: user.id },
            select: { isCompleted: true, lessonId: true },
          },
          chapter: {
            select: {
              courseId: true,
              course: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      if (!lessonContent) return next(new AppError(`Lesson not found`, 400));

      // Check if the user is enrolled in the course to view the lesson
      if (!lessonContent.chapter) {
        return next(new AppError(`Lesson chapter not found`, 400));
      }

      const enrollmemt = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: lessonContent.chapter.courseId as string,
          },
        },
        select: {
          status: true,
        },
      });

      if (!enrollmemt || enrollmemt.status !== "Active") {
        return next(new AppError(`You are not enrolled for this course`, 400));
      }

      res.status(200).json({
        success: true,
        message: "Lessons content fetched successfully",
        data: lessonContent,
      });
    } catch (error: any) {
      console.error("Error fetching lesson content:", error);

      return next(new AppError(`Something went wrong: ${error.message}`, 500));
    }
  }
);
