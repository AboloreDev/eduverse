import z from "zod";

const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not be more than 100"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2500, "Description must not be more than 2500"),
  subDescription: z
    .string()
    .min(1, "Sub-description is required")
    .max(500, "Sub-description must not be more than 500"),
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
