import { z } from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1, { message: "Content type is required" }),
  fileSize: z
    .number()
    .min(1, { message: "Content size is required" })
    .optional(),
  isImage: z.boolean().optional(),
});
