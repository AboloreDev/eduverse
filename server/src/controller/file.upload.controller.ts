import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileUploadSchema } from "../schemas/file.upload.schema";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../utils/s3Client";

dotenv.config();

export const uploadfile = catchAsyncError(async (req, res, next) => {
  try {
    const request = fileUploadSchema.parse(req.body);

    if (!request) return next(new AppError("All fields are required", 400));

    const uniqueKey = `${uuidv4()}-${request.fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      ContentType: request.fileType,
      Key: uniqueKey,
      ACL: "public-read",
    });

    const preSignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 });

    res.status(200).json({
      success: true,
      message: "Pre-signed URL generated successfully",
      data: {
        preSignedUrl,
        key: uniqueKey,
      },
    });
  } catch (error: any) {}
});

export const deleteUploadedFile = catchAsyncError(async (req, res, next) => {
  try {
    const { key } = req.body;

    if (!key) return next(new AppError("Missing or invalid Object key", 400));

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
    });

    await S3.send(command);

    res.status(200).json({
      success: true,
      message: "File deleted Successfully",
    });
  } catch (error: any) {
    console.error("Error deleting URL:", error);

    return next(new AppError(`Something went wrong: ${error.message}`, 500));
  }
});
