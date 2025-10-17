import Stripe from "stripe";
import { AuthRequest } from "../middleware/isAuthenticated";
import AppError from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsync";
import prisma from "../utils/prismaClient";
import { stripe } from "../utils/stripe";
import { aj } from "../utils/arcjet";

export const createStripeCustomerId = catchAsyncError(
  async (req: AuthRequest, res, next) => {
    const { id: courseId } = req.params;
    const user = req.user!;
    let stripeCustomerId: string;

    try {
      // ✅ Rate limit check (Arcjet)
      const decision = await aj.protect(req, {
        requested: 1,
        userId: user.id,
        email: user.email,
      });

      if (decision.isDenied()) {
        return res.status(429).json({
          success: false,
          error: "Too Many Requests",
          reason: decision.reason,
        });
      }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          price: true,
          slug: true,
          stripePriceId: true,
        },
      });

      if (!course) return next(new AppError(`Course not found`, 404));

      const userRecord = await prisma.user.findUnique({
        where: { id: user.id },
        select: { stripeCustomerId: true },
      });

      if (userRecord?.stripeCustomerId) {
        stripeCustomerId = userRecord.stripeCustomerId;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          metadata: { userId: user.id },
        });

        stripeCustomerId = customer.id;

        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId },
        });
      }

      const paymentResponse = await prisma.$transaction(async (tx) => {
        const existingEnrollment = await tx.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
          select: { status: true, id: true },
        });

        // Already active
        if (existingEnrollment?.status === "Active") {
          return { alreadyEnrolled: true };
        }

        let enrollment;
        if (existingEnrollment) {
          enrollment = await tx.enrollment.update({
            where: { id: existingEnrollment.id },
            data: {
              amount: course.price,
              status: "Pending",
              updatedAt: new Date(),
            },
          });
        } else {
          enrollment = await tx.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              amount: course.price,
              status: "Pending",
            },
          });
        }

        const successUrl = `${process.env.FRONTEND_URL}/payment/success`;
        const cancelUrl = `${process.env.FRONTEND_URL}/payment/failure`;

        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          line_items: [
            {
              price: course.stripePriceId!,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            userId: user.id,
            courseId: course.id,
            enrollmentId: enrollment.id,
          },
        });

        return {
          checkoutUrl: session.url,
        };
      });

      if ((paymentResponse as any).alreadyEnrolled) {
        return res.status(200).json({
          success: true,
          message: "You are already enrolled in this course",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Checkout session created successfully",
        checkoutUrl: (paymentResponse as any).checkoutUrl,
      });
    } catch (error: any) {
      console.error("Payment creation failed:", error);

      if (error instanceof Stripe.errors.StripeError) {
        return res.status(400).json({
          success: false,
          message: error.message || "Stripe payment error",
        });
      }

      return next(new AppError(`Something went wrong: ${error.message}`, 500));
    }
  }
);
