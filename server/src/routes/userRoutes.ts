import express from "express";
import {
  getDashboardStats,
  getUserProfile,
} from "../controller/user.controller";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";

const router = express.Router();

router.get("/", isAuthenticated, getUserProfile);
router.get(
  "/dashboard-stats",
  isAuthenticated,
  restrictTo("admin"),
  getDashboardStats
);

export default router;
