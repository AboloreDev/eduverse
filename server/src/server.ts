import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import fileUploadsRoutes from "./routes/fileUploadsRoutes";
import coursesRoutes from "./routes/coursesRoutes";
import lessonsRoutes from "./routes/lessonsRoutes";
import chapterRoutes from "./routes/chapterRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import progressRoutes from "./routes/progressRoutes";
import { OK } from "./constants/statusCodes";
import AppError from "./utils/appError";
import { errorController } from "./utils/errorController";
import { healthCheck } from "./controller/auth.controller";

import { stripeWebhook } from "./controller/webhook.controller";

const globalErrorHandler = errorController;

dotenv.config();

const PORT = Number(process.env.PORT);

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL as string,
  process.env.FRONTEND_DEPLOYED_URL as string,
];

app.post(
  "/api/v1/webhook/stripe",
  express.raw({ type: "application/json" }),

  stripeWebhook
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(OK).json({ status: "healthy" });
});

//Routes
app.use("/api/v1/project/auth", authRoutes);
app.use("/api/v1/project/user", userRoutes);
app.use("/api/v1/project/file-uploads", fileUploadsRoutes);
app.use("/api/v1/project/courses", coursesRoutes);
app.use("/api/v1/project/courses", lessonsRoutes);
app.use("/api/v1/project/courses", chapterRoutes);
app.use("/api/v1/project/payment", paymentRoutes);
app.use("/api/v1/project/courses", progressRoutes);

app.get("/health", healthCheck);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find URL ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening on Port ${PORT}`);
});
