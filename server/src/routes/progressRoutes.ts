import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import { markAsCompleted } from "../controller/progress.controller";

const router = express.Router();

router.patch(
  "/:courseId/lessons/:lessonId/progress",
  isAuthenticated,
  restrictTo("user"),
  markAsCompleted
);

export default router;
