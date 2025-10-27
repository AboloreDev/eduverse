import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Container from "../Container";

const UserSingleCourseSkeleton = () => {
  return (
    <Container className="animate-in fade-in duration-300">
      {/* Course thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
        <Skeleton className="h-full w-full rounded-xl" />
      </div>

      {/* Title & description */}
      <div className="mt-6 space-y-4">
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>

      {/* Badges */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <Separator className="my-8" />

      {/* Course Description */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>

      <Separator className="my-8" />

      {/* Course Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Chapters */}
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <Skeleton className="h-5 w-1/3 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default UserSingleCourseSkeleton;
