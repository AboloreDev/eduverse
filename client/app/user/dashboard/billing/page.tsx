"use client";

import React from "react";
import { useGetPaymentHistoryQuery } from "@/state/api/paymentApi";
import { useAppSelector } from "@/state/redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const BillingPage = () => {
  const user = useAppSelector((state) => state.global.user);
  const { data: history, isLoading } = useGetPaymentHistoryQuery(user?.id, {
    skip: !user?.id,
  });

  return (
    <div className=" p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-slate-500 mt-1">
          View your recent payments and subscription history.
        </p>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription className="text-slate-500">
            Overview of your recent course payments and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-10 w-full" />
              ))}
            </div>
          ) : history?.data?.length ? (
            <div className="overflow-x-auto rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.data.map((history: any) => {
                    // ✅ Fix Stripe unit conversion (kobo → naira)
                    const amountInNaira =
                      history.amount >= 1000
                        ? history.amount / 100
                        : history.amount;

                    return (
                      <TableRow key={history.id}>
                        <TableCell className="font-medium">
                          {history.course?.title || "N/A"}
                        </TableCell>
                        <TableCell>
                          ₦
                          {amountInNaira.toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`
                                          ${
                                            history.status === "Active"
                                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                              : history.status === "Pending"
                                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                              : history.status === "Rejected"
                                              ? "bg-red-600 hover:bg-red-700 text-white"
                                              : "bg-gray-400 text-white"
                                          }
                                        `}
                          >
                            {history.status === "Active" && "Approved"}
                            {history.status === "Pending" && "Pending"}
                            {history.status === "Rejected" && "Declined"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(history.createdAt), "PPP")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              No payment history found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
