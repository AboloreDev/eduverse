import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateStripeCustomerIdMutation } from "@/state/api/paymentApi";

import { SingleCourseResponse } from "@/state/types/courseTypes";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import { CheckIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface SingleCourseProps {
  singleCourse: SingleCourseResponse<object>;
}

const UserEnrollmentCard = ({ singleCourse }: SingleCourseProps) => {
  const [createStripeCustomerId, { isLoading }] =
    useCreateStripeCustomerIdMutation();
  const courseId = singleCourse?.data?.id;
  const router = useRouter();

  const hasActivePayment = singleCourse?.data?.payment?.some(
    (payment) => payment.status === "Active"
  );

  const afterPaymentRoute = () => {
    if (hasActivePayment) {
      router.push(`/courses/${courseId}`);
    }
  };

  // create stripe customer
  const createStripeCustomer = async () => {
    try {
      const response = await createStripeCustomerId(
        courseId as string
      ).unwrap();
      if (response.success) {
        toast.success("success");
        // @ts-ignore
        router.push(response.checkoutUrl);
      } else {
        toast.error("Failed to create checkout");
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  return (
    <Card className="py-0">
      <CardContent className="p-4 space-y-4">
        {!hasActivePayment && (
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg">Price:</span>
            <span className="text-xl font-bold text-primary">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(singleCourse?.data?.price ?? 0)}
            </span>
          </div>
        )}

        <div className="mt-4 space-y-2 rounded-lg bg-muted p-4">
          <h4 className="font-medium">What you will get:</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex rounded-full size-8 items-center justify-center bg-primary/20">
                <IconClock className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Course Duration</p>
                <p className="text-sm text-slate-500">
                  {singleCourse.data?.duration} Hours
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-full size-8 items-center justify-center bg-primary/20">
                <IconChartBar className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Difficulty level</p>
                <p className="text-sm text-slate-500">
                  {singleCourse.data?.level}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-full size-8 items-center justify-center bg-primary/20">
                <IconCategory className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-slate-500">
                  {singleCourse.data?.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-full size-8 items-center justify-center bg-primary/20">
                <IconBook className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Lessons</p>
                <p className="text-sm text-slate-500">
                  {singleCourse?.data?.chapters.reduce(
                    (total, chapter) => total + chapter.lessons.length,
                    0
                  ) || 0}{" "}
                  {singleCourse?.data?.chapters?.lessons?.length !== 1
                    ? "Lessons"
                    : "Lesson"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <h4>This course includes:</h4>
          <ul className="space-y-2 text-slate-500">
            <li className="flex items-center gap-2 text-sm">
              <div className="rounded-full bg-green-900 text-green-500">
                <CheckIcon className="size-4 p-1" />
              </div>
              <span>Full lifetime access</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="rounded-full bg-green-900 text-green-500">
                <CheckIcon className="size-4 p-1" />
              </div>
              <span>Access on mobile and desktop</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <div className="rounded-full bg-green-900 text-green-500">
                <CheckIcon className="size-4 p-1" />
              </div>
              <span>Certificate on completion</span>
            </li>
          </ul>
        </div>

        <Button
          disabled={isLoading}
          onClick={hasActivePayment ? afterPaymentRoute : createStripeCustomer}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="size-4 animate-spin mr-2" /> Loading...
            </span>
          ) : hasActivePayment ? (
            "Watch Now"
          ) : (
            "Enroll Now"
          )}
        </Button>
        <p className="text-slate-500 text-xs text-center">
          30 days money back guarantee
        </p>
      </CardContent>
    </Card>
  );
};

export default UserEnrollmentCard;
