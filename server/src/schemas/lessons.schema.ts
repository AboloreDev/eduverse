import z from "zod";

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
