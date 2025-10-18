import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetDashboardStatsQuery } from "@/state/api/authApi";
import { useAppSelector } from "@/state/redux";
import { skip } from "node:test";
import DashboardStatsSkeleton from "./code/DashboardStataSkeleton";

interface SectioncardsProps {
  dashboardStats: {
    totalSignUps: number;
    totalCourses: number;
    totalCustomers: number;
    totalLessons: number;
  };
  isLoading: boolean;
}

export function SectionCards({ dashboardStats, isLoading }: SectioncardsProps) {
  if (isLoading) {
    <DashboardStatsSkeleton />;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold">Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardStats?.totalSignUps}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-500">
            No Registered Users
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold">
            Total Customers
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardStats?.totalCustomers}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-500">
            No Users who have enrolled for a course
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold">Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardStats?.totalCourses}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-500">
            No of Available Courses on the platform
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold">Total Lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardStats?.totalLessons}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-slate-500">
            No of Learning Content available
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
