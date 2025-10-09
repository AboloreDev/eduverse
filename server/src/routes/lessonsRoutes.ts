import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import {
  createNewLesson,
  deleteLesson,
  reOrderLessons,
} from "../controller/lessons.controller";

const router = express.Router();

router.post(
  "/chapters/lessons/create",
  isAuthenticated,
  restrictTo("admin"),
  createNewLesson
);

router.put(
  "/:courseId/chapters/:chapterId/lessons/re-order",
  isAuthenticated,
  restrictTo("admin"),
  reOrderLessons
);

router.delete(
  "/chapters/:chapterId/lessons/:lessonId/delete",
  isAuthenticated,
  restrictTo("admin"),
  deleteLesson
);

export default router;
