import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import {
  createCourse,
  deleteSingleCourse,
  editCourse,
  fetchAllCourses,
  fetchSingleCourse,
  getRecentCourse,
} from "../controller/courses.controller";

const router = express.Router();

router.post("/create", isAuthenticated, restrictTo("admin"), createCourse);

router.get("/all", isAuthenticated, fetchAllCourses);

router.get("/recent", isAuthenticated, restrictTo("admin"), getRecentCourse);

router.get("/:id", isAuthenticated, fetchSingleCourse);

router.delete("/:id", isAuthenticated, restrictTo("admin"), deleteSingleCourse);

router.put("/:id", isAuthenticated, restrictTo("admin"), editCourse);

export default router;
