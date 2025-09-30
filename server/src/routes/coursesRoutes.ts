import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated";
import {
  deleteSingleCourse,
  fetchAllCourses,
  fetchSingleCourse,
} from "../controller/courses.controller";

const router = express.Router();

router.get("/all", isAuthenticated, fetchAllCourses);

router.get("/:id", isAuthenticated, fetchSingleCourse);

router.delete("/:id", isAuthenticated, deleteSingleCourse);

export default router;
