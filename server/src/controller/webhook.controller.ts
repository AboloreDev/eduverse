import Stripe from "stripe";
import { catchAsyncError } from "../utils/catchAsync";
import AppError from "../utils/appError";
import { stripe } from "../utils/stripe";
import prisma from "../utils/prismaClient";
import { OK } from "../constants/statusCodes";

export const stripeWebhook = catchAsyncError(async (req, res, next) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return next(new AppError("No signature provided", 400));
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return next(new AppError(`Webhook error: ${error.message}`, 500));
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const courseId = session.metadata?.courseId;
    const customerId = session.customer as string;

    if (!courseId) {
      return res.status(200).json({ received: true, error: "No courseId" });
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      return res.status(200).json({ received: true, error: "User not found" });
    }

    try {
      await prisma.enrollment.update({
        where: {
          id: session.metadata?.enrollmentId as string,
        },
        data: {
          userId: user.id,
          courseId: courseId,
          amount: session.amount_total as number,
          status: "Active",
        },
      });
    } catch (error: any) {
      return res.status(200).json({ received: true, error: error.message });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const courseId = session.metadata?.courseId;

    if (!courseId) {
      return res.status(200).json({ received: true, error: "No courseId" });
    }

    try {
      await prisma.enrollment.update({
        where: {
          id: session.metadata?.enrollmentId as string,
        },
        data: {
          courseId,
          amount: session.amount_total as number,
          status: "Rejected",
        },
      });
    } catch (error: any) {
      return res.status(200).json({ received: true, error: error.message });
    }
  }

  return res.status(200).json({ received: true });
});
