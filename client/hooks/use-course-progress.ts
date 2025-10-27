"use client";

import { useMemo } from "react";

export function useCourseProgress({
  singleCourse,
  course,
}: {
  singleCourse: any;
  course: any;
}) {
  return useMemo(() => {
    let totalLessons: number = 0;
    let completedLessons: number = 0;

    singleCourse?.data?.chapters?.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        totalLessons++;

        // check if lesson is completed
        const isCompleted = lesson.progress?.some(
          (progress: any) =>
            progress.lessonId === lesson.id && progress.isCompleted
        );

        if (isCompleted) {
          completedLessons++;
        }
      });
    });

    course?.chapters?.forEach((chapter: any) => {
      chapter.lessons?.forEach((lesson: any) => {
        totalLessons++;

        // check if lesson is completed
        const isCompleted = lesson.progress?.some(
          (progress: any) =>
            progress.lessonId === lesson.id && progress.isCompleted
        );

        if (isCompleted) {
          completedLessons++;
        }
      });
    });

    const progressPercentage: number =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  }, [singleCourse, course]);
}
