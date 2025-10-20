import { success } from "zod";
import { OK } from "../constants/statusCodes";
import { AuthRequest } from "../middleware/isAuthenticated";
import { courseSchema, editCourseSchema } from "../schemas/course.schema";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";
import { stripe } from "../utils/stripe";
import { initializeRedisclient } from "../utils/client";
import { nanoid } from "nanoid";
import {
  coursesKeyById,
  coursesListKey,
  recentCourseListKey,
} from "../utils/keys";

export const createCourse = catchAsyncError(
  async (req: AuthRequest, res, next) => {
    const user = req.user!;
    const request = courseSchema.parse(req.body);

    if (!request) return next(new AppError("All fields are required", 400));

    try {
      const client = await initializeRedisclient();
      const id = nanoid();
      const coursesKey = coursesKeyById(id);
      const hashData = {
        id,
        name: request.title,
        description: request.description,
        subDescription: request.subDescription,
        category: request.category,
        price: request.price,
        duration: request.duration,
        fileKey: request.fileKey,
        status: request.status,
        level: request.level,
        slug: request.slug,
      };
      const addResult = await client.hSet(coursesKey, hashData);
      console.log(`Added ${addResult} fields`);
      const stripeProduct = await stripe.products.create({
        name: request.title,
        description: request.description,
        metadata: {
          slug: request.slug,
        },
      });

      const stripePrice = await stripe.prices.create({
        currency: "ngn",
        unit_amount: Math.round(request.price * 100), // Convert to cents
        product: stripeProduct.id,
      });

      const data = await prisma.course.create({
        data: {
          ...request,
          userId: user.id,
          stripePriceId: stripePrice.id,
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    try {
      // Check cache first
      const client = await initializeRedisclient();
      const cacheKey = coursesListKey(page, limit, user.role);
      const cached = await client.get(cacheKey);

      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
      let whereCondition = {};
      if (user.role === "admin") {
        whereCondition = {};
      } else if (user.role === "user") {
        whereCondition = { status: "Published" };
      } else {
        return next(new AppError(`Unauthorized role`, 403));
      }

      const [courses, totalCount] = await Promise.all([
        prisma.course.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            category: true,
            description: true,
            level: true,
            price: true,
            duration: true,
            subDescription: true,
            status: true,
            fileKey: true,
            slug: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
        prisma.course.count({ where: whereCondition }),
      ]);

      const response = {
        success: true,
        message: "Courses fetched successfully",
        data: courses,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
      await client.setEx(cacheKey, 300, JSON.stringify(response));
      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      return next(new AppError(`Something went wrong: ${error.message}`, 500));
    }
  }
);

export const getRecentCourse = catchAsyncError(async (req, res, next) => {
  const client = await initializeRedisclient();
  const recentList = recentCourseListKey();
  const cached = await client.get(recentList);

  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  const course = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      duration: true,
      fileKey: true,
      level: true,
      price: true,
      slug: true,
      description: true,
      status: true,
    },
  });

  await client.setEx(recentList, 300, JSON.stringify(course));

  return res.status(200).json({
    success: true,
    message: "Success",
    data: course,
  });
});

export const fetchSingleCourse = catchAsyncError(async (req, res, next) => {
  // get the course id from params
  const { id } = req.params;

  try {
    const client = await initializeRedisclient();
    const singlecourseCachedKey = coursesKeyById(id);
    const cached = await client.get(singlecourseCachedKey);

    if (cached) {
      return res.status(OK).json({
        success: true,
        message: "success",
        data: JSON.parse(cached),
      });
    }
    const singleCourse = await prisma.course.findUnique({
      where: { id: id },
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
        chapters: {
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnailKey: true,
                position: true,
                videoKey: true,
              },
              orderBy: {
                position: "asc",
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!singleCourse) return next(new AppError("No course found", 404));

    // 3. Store in Redis for future requests (cache for 1 hour)
    await client.setEx(
      singlecourseCachedKey,
      300,
      JSON.stringify(singleCourse)
    );

    return res.status(OK).json({
      success: true,
      message: "Success",
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
    // Clear user cache on logout
    const client = await initializeRedisclient();
    const cachedCourseKey = coursesKeyById(id as string);
    await client.del(cachedCourseKey);
    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // 2. Delete course
    await prisma.course.delete({
      where: { id: id },
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
  const request = editCourseSchema.parse(req.body);
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: id },
    });

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Check if price changed
    let stripePriceId = course.stripePriceId;

    if (request.price !== course.price) {
      // Create new price (Stripe doesn't allow updating prices)
      const stripePrice = await stripe.prices.create({
        currency: "ngn",
        unit_amount: Math.round(request.price * 100),
        product: course.stripePriceId
          ? ((
              await stripe.prices.retrieve(course.stripePriceId)
            ).product as string)
          : (
              await stripe.products.create({
                name: request.title,
                description: request.description,
              })
            ).id,
      });

      stripePriceId = stripePrice.id;
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
        stripePriceId: stripePriceId,
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
