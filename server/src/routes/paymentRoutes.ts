import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import {
  createStripeCustomerId,
  getPaymentStats,
} from "../controller/payment.controller";
import { getDashboardStats } from "../controller/user.controller";

const router = express.Router();

router.post(
  "/:id/payment/",
  isAuthenticated,
  restrictTo("user"),
  createStripeCustomerId
);

router.get(
  "/payment/dashboard-stats",
  isAuthenticated,
  restrictTo("admin"),
  getPaymentStats
);

export default router;
