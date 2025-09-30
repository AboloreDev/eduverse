import express from "express";
import {
  deleteUploadedFile,
  submitCourse,
  uploadfile,
} from "../controller/file.upload.controller";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";

const router = express.Router();

router.post("/", isAuthenticated, restrictTo("admin"), uploadfile);

router.delete(
  "/:key",
  isAuthenticated,
  restrictTo("admin"),
  deleteUploadedFile
);

router.post("/course", isAuthenticated, restrictTo("admin"), submitCourse);

export default router;
