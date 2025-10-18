"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { useGetDashboardStatsQuery } from "@/state/api/authApi";
import { useGetEnrollmentStatsQuery } from "@/state/api/paymentApi";
import { useAppSelector } from "@/state/redux";
import RecentCourses from "./RecentCourses";
import { Suspense } from "react";

export default function AdminDashboardPage() {
  const user = useAppSelector((state) => state.global.user);
  const { data: dashboardStats, isLoading: DashboardStatsLoading } =
    useGetDashboardStatsQuery(user?.id, {
      skip: !user,
      refetchOnMountOrArgChange: true,
    });
  const { data: enrollmentChartStats, isLoading: EnrollmentStatsLoading } =
    useGetEnrollmentStatsQuery(user?.id, {
      skip: !user,
      refetchOnMountOrArgChange: true,
    });
  return (
    <>
      <SectionCards
        dashboardStats={dashboardStats}
        isLoading={DashboardStatsLoading}
      />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          enrollmentChartStats={enrollmentChartStats}
          isLoading={EnrollmentStatsLoading}
        />
      </div>
      <Suspense>
        <RecentCourses user={user} />
      </Suspense>
    </>
  );
}
