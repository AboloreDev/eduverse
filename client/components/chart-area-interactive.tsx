"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";

export const description = "An interactive area chart";

const chartConfig = {
  enrollments: {
    label: "Enrollment",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaProps {
  enrollmentChartStats: {
    data: {
      date: string;
      enrollments: number;
    }[];
  };
  isLoading: boolean;
}

export function ChartAreaInteractive({
  enrollmentChartStats,
  isLoading,
}: ChartAreaProps) {
  const totalEnrollments = React.useMemo(
    () =>
      enrollmentChartStats?.data?.reduce(
        (acc, curr) => acc + curr.enrollments,
        0
      ),
    [enrollmentChartStats]
  );

  if (isLoading) {
    <Loader2 className="animate-spin" />;
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollment</CardTitle>
        <CardDescription className="text-slate-500">
          <span className="hidden @[540px]/card:block"></span>
          Total Enrollment for the Last 30 days: {totalEnrollments}
          <span className="@[540px]/card:hidden">Last 30 days: 200</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={enrollmentChartStats?.data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />

            <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
