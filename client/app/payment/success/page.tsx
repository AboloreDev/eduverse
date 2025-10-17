"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useConfetti } from "@/hooks/use-cofetti";
import { useEffect } from "react";
import { buttonVariants } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-20 w-20 text-blue-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase! Your payment has been processed
          successfully. You now have access to your course materials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/user/courses" className={buttonVariants()}>
            Go to My Courses
          </Link>
          <Link href="/" className={buttonVariants()}>
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
