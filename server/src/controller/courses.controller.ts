import { OK } from "../constants/statusCodes";
import { AuthRequest } from "../middleware/isAuthenticated";
import { courseSchema } from "../schemas/course.schema";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";

export const createCourse = catchAsyncError(
  async (req: AuthRequest, res, next) => {
    const user = req.user!;
    try {
      const request = courseSchema.parse(req.body);

      if (!request) return next(new AppError("All fields are required", 400));

      const data = await prisma.course.create({
        data: {
          ...request,
          userId: user.id,
        },
      });

      res.status(200).json({
        success: true,
        message: "Course creation was successful",
        data,
      });
    } catch (error: any) {
      console.error("Error submitting course form:", error);

      return next(new AppError(`Something went wrong: ${error.message}`, 500));
    }
  }
);

export const fetchAllCourses = catchAsyncError(
  async (req: AuthRequest, res, next) => {
    const user = req.user!;
    let courses;

    try {
      if (user.role === "user") {
        courses = await prisma.course.findMany({
          where: { userId: user.id },
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            fileKey: true,
            level: true,
            status: true,
            price: true,
            duration: true,
            subDescription: true,
            User: {
              select: {
                id: true,
                firstName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } else if (user.role === "admin") {
        courses = await prisma.course.findMany({
          where: { userId: user.id },
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            level: true,
            price: true,
            duration: true,
            subDescription: true,
            createdAt: true,
            status: true,
            fileKey: true,
            slug: true,
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        });
      } else {
        return next(new AppError(`No courses found`, 404));
      }

      return res.status(OK).json({
        success: true,
        message: "Course fetched Successfully",
        data: courses,
      });
    } catch (error: any) {
      console.error("Error fetching all courses:", error);
      return next(new AppError(`Something went wrong: ${error.message}`, 500));
    }
  }
);

export const fetchSingleCourse = catchAsyncError(async (req, res, next) => {
  // get the course id from params
  const { id } = req.params;

  try {
    const singleCourse = await prisma.course.findUnique({
      where: { id: id },
      include: { User: true },
    });

    if (!singleCourse) return next(new AppError("No course found", 404));

    return res.status(OK).json({
      success: true,
      message: "Single course fetched Successfully",
      data: singleCourse,
    });
  } catch (error: any) {
    console.error("Error fetching single course:", error);
    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const deleteSingleCourse = catchAsyncError(async (req, res, next) => {
  // get the course id
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // 2. Delete course
    await prisma.course.delete({
      where: { id },
    });

    // 3. Return response
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const editCourse = catchAsyncError(async (req, res, next) => {
  const request = courseSchema.parse(req.body);
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    const editCourse = await prisma.course.update({
      where: { id: id },
      data: {
        title: request.title,
        category: request.category,
        description: request.description,
        level: request.level,
        price: request.price,
        duration: request.duration,
        status: request.status,
        fileKey: request.fileKey,
        slug: request.slug,
        subDescription: request.subDescription,
      },
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: editCourse,
    });
  } catch (error: any) {
    console.error("Error editing  course:", error);
    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});
