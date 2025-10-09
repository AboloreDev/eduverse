import z from "zod";

export const chapterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  courseId: z.string().uuid("Invalid course ID"),
});
