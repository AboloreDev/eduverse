import express from "express";
import {
  deleteUploadedFile,
  uploadfile,
} from "../controller/file.upload.controller";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";

const router = express.Router();

router.post("/", isAuthenticated, restrictTo("admin"), uploadfile);

router.delete("/", isAuthenticated, restrictTo("admin"), deleteUploadedFile);

export default router;
