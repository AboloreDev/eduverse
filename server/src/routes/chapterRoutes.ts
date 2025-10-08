import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import { reOrderChapters } from "../controller/chapter.controller";

const router = express.Router();

router.put(
  "/chapters/re-order",
  isAuthenticated,
  restrictTo("admin"),
  reOrderChapters
);

export default router;
