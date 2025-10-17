import express from "express";
import { isAuthenticated, restrictTo } from "../middleware/isAuthenticated";
import { createStripeCustomerId } from "../controller/payment.controller";

const router = express.Router();

router.post(
  "/:id/payment/",
  isAuthenticated,
  restrictTo("user"),
  createStripeCustomerId
);

export default router;
