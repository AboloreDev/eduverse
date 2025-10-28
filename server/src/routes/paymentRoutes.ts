import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import {
  createStripeCustomerId,
  getEnrolledCourses,
  getPaymentHistory,
  getPaymentStats,
} from "../controller/payment.controller";

const router = express.Router();

router.post(
  "/:id",
  isAuthenticated,
  restrictTo("user"),
  createStripeCustomerId
);

router.get(
  "/dashboard-stats",
  isAuthenticated,
  restrictTo("admin"),
  getPaymentStats
);

router.get("/", isAuthenticated, getEnrolledCourses);

router.get("/history", isAuthenticated, restrictTo("user"), getPaymentHistory);

export default router;
