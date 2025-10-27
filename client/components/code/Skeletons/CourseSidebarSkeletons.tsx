import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import LessonItemsSkeleton from "./LessonItemsSkeleton";
import Container from "../Container";

const CourseSidebarSkeleton = () => {
  return (
    <Container className="animate-in fade-in duration-300 ">
      <div className="flex flex-col h-full">
        <div className="pb-4 pr-4 border-b border-border">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="size-10 rounded-lg shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          {/* Chapters Section */}
          <div className="py-4 pr-4 space-y-3">
            {[...Array(3)].map((_, chapterIndex) => (
              <div key={chapterIndex} className="space-y-3">
                <Skeleton className="w-full h-16 rounded-lg" />
                <div className="pl-6 border-l-2 space-y-3">
                  {[...Array(4)].map((_, lessonIndex) => (
                    <LessonItemsSkeleton key={lessonIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CourseSidebarSkeleton;
