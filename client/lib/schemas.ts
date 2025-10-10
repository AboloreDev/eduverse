import z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not be more than 100"),
  description: z.string().min(1, "Description is required"),
  subDescription: z.string().min(1, "Sub-description is required"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(10000, "Category must not be more than 10000"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  duration: z.coerce.number().min(1, "Duration is required"),
  fileKey: z.string().min(1, "File key is required"),
  level: z.enum(courseLevels),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(courseStatus),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const chapterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  courseId: z.string().uuid("Invalid course ID"),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;

export const lessonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  courseId: z.string().uuid("Invalid course ID").optional(),
  chapterId: z.string().uuid("Invalid chapter ID").optional(),
  description: z
    .string()
    .min(1, "Description must be at least 3 characters long")
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;
