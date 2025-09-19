import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { OK } from "./constants/statusCodes";
import AppError from "./utils/appError";
import { errorController } from "./utils/errorController";

const globalErrorHandler = errorController;

dotenv.config();

const PORT = Number(process.env.PORT);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//Routes
app.use("/api/v1/project/auth", authRoutes);
app.use("/api/v1/project/user", userRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find URL ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.status(OK).json({ status: "healthy" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening on Port ${PORT}`);
});
