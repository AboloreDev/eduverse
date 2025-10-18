import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="relative py-4 px-5">
          <CardContent className="p-0 flex flex-col gap-3">
            {/* Top Label */}
            <Skeleton className="h-4 w-24 rounded-md" />

            {/* Big Number */}
            <Skeleton className="h-8 w-32 rounded-md" />

            {/* Sub Label / description */}
            <Skeleton className="h-4 w-40 rounded-md mt-2" />

            {/* Optional icons / footer */}
            <div className="flex items-center gap-3 mt-3">
              <Skeleton className="size-6 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsSkeleton;
