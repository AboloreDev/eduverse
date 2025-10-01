import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import {
  createCourse,
  deleteSingleCourse,
  editCourse,
  fetchAllCourses,
  fetchSingleCourse,
} from "../controller/courses.controller";

const router = express.Router();

router.post("/create", isAuthenticated, restrictTo("admin"), createCourse);

router.get("/all", isAuthenticated, fetchAllCourses);

router.get("/:id", isAuthenticated, fetchSingleCourse);

router.delete("/:id", isAuthenticated, deleteSingleCourse);

router.put("/:id", isAuthenticated, editCourse);

export default router;
