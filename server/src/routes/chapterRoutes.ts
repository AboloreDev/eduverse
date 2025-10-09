import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import {
  createNewChapter,
  deleteChapter,
  reOrderChapters,
} from "../controller/chapter.controller";

const router = express.Router();

router.post(
  "/chapters/create",
  isAuthenticated,
  restrictTo("admin"),
  createNewChapter
);

router.put(
  "/:courseId/chapters/re-order",
  isAuthenticated,
  restrictTo("admin"),
  reOrderChapters
);

router.delete(
  "/:courseId/chapters/:chapterId/delete",
  isAuthenticated,
  restrictTo("admin"),
  deleteChapter
);

export default router;
