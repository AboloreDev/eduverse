import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LessonContentPageSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      {/* Video Player Skeleton */}
      <div className="aspect-video bg-muted rounded-md overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Action Button Skeleton */}
      <div className="py-4 border-b">
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      {/* Lesson Content Skeleton */}
      <div className="space-y-4 pt-4">
        {/* Title Skeleton */}
        <Skeleton className="h-8 w-3/4" />

        {/* Description Skeleton - Multiple lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default LessonContentPageSkeleton;
