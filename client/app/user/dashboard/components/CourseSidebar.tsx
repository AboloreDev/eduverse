"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useFetchUserEnrolledCourseDetailsQuery } from "@/state/api/courseApi";
import { ChevronDown, Play } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import LessonItems from "./LessonItems";
import { useCourseProgress } from "@/hooks/use-course-progress";
import CourseSidebarSkeleton from "@/components/code/Skeletons/CourseSidebarSkeletons";

const CourseSidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const { data: singleCourse, isLoading } =
    useFetchUserEnrolledCourseDetailsQuery(id);

  const currentLessonId = pathname.split("/").pop();
  const { totalLessons, completedLessons, progressPercentage } =
    // @ts-ignore
    useCourseProgress({ singleCourse });

  if (isLoading) {
    return <CourseSidebarSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <div className="pb-4 pr-4 border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-4" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {singleCourse?.data?.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {singleCourse?.data?.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs ">
            <span className="text-slate-500">Progress</span>
            <span className="font-medium text-slate-500">
              {completedLessons}/{totalLessons} lessons completed
            </span>
          </div>

          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-slate-500">
            {progressPercentage}% complete
          </p>
        </div>

        <div className="py-4 pr-4 space-y-3">
          {singleCourse?.data?.chapters.map((chapter: any, index) => (
            <Collapsible key={chapter.id} defaultOpen={index === 0}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full p-3 h-auto flex items-center gap-2"
                >
                  <div className="shrink">
                    <ChevronDown className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold truncate text-sm text-slate-500">
                      {chapter.position} : {chapter.title}
                    </div>

                    <p className="text-xs text-slate-500 font-medium truncate">
                      {chapter.lessons.length}{" "}
                      {chapter?.lessons?.length !== 1 ? "Lessons" : "Lesson"}
                    </p>
                  </div>
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                {chapter.lessons.map((lesson: any) => (
                  <LessonItems
                    key={lesson.id}
                    lesson={lesson}
                    id={singleCourse?.data?.id || ""}
                    isActive={currentLessonId === lesson.id}
                    isLessonCompleted={
                      lesson.progress.find(
                        (progress: any) => progress.lessonId === lesson.id
                      )?.isCompleted || false
                    }
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
