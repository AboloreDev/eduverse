import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import { reOrderLessons } from "../controller/lessons.controller";

const router = express.Router();

router.put(
  "/chapters/:chapterId/lessons/re-order",
  isAuthenticated,
  restrictTo("admin"),
  reOrderLessons
);

export default router;
