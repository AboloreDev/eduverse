"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelledPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-white px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="flex justify-center mb-6">
          <XCircle className="h-20 w-20 text-red-500 animate-pulse" />
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-8">
          It looks like your payment was not completed. Don’t worry—you can try
          again anytime to complete your purchase.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-all"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="border border-red-500 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-lg transition-all"
          >
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
