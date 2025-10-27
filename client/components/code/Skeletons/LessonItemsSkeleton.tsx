import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LessonItemsSkeleton = () => {
  return (
    <div className="w-full p-2.5 h-auto flex items-center gap-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      {/* Icon Skeleton */}
      <div className="shrink-0">
        <Skeleton className="size-5 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  );
};

export default LessonItemsSkeleton;
