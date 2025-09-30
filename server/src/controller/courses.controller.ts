import { OK } from "../constants/statusCodes";
import { AuthRequest } from "../middleware/isAuthenticated";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";

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
            level: true,
            price: true,
            duration: true,
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
            createdAt: true,
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
        courses,
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
      singleCourse,
    });
  } catch (error: any) {
    console.error("Error fetching single course:", error);
    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});

export const deleteSingleCourse = catchAsyncError(async (req, res, next) => {
  // get the course id
  const { id } = req.params;

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
});
