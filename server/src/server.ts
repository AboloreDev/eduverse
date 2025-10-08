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
import { OK } from "./constants/statusCodes";
import AppError from "./utils/appError";
import { errorController } from "./utils/errorController";
import { healthCheck } from "./controller/auth.controller";

const globalErrorHandler = errorController;

dotenv.config();

const PORT = Number(process.env.PORT);

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.status(OK).json({ status: "healthy" });
});

//Routes
app.use("/api/v1/project/auth", authRoutes);
app.use("/api/v1/project/user", userRoutes);
app.use("/api/v1/project/file-uploads", fileUploadsRoutes);
app.use("/api/v1/project/courses", coursesRoutes);
app.use("/api/v1/project/courses/:courseId", lessonsRoutes);
app.use("/api/v1/project/courses/:courseId", chapterRoutes);

app.get("/health", healthCheck);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find URL ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening on Port ${PORT}`);
});
