"use client";

import { useFetchUserEnrolledCourseDetailsQuery } from "@/state/api/courseApi";
import { redirect, useParams } from "next/navigation";
import React from "react";

const CourseIdPage = () => {
  const { id } = useParams();
  const { data: singleCourse } = useFetchUserEnrolledCourseDetailsQuery(id);

  const firstChapter = singleCourse?.data?.chapters[0];
  const firstLesson = firstChapter?.lessons[0];

  // Redirect to the first lesson of the course
  if (firstLesson) {
    if (typeof window !== "undefined") {
      redirect(`/user/dashboard/${id}/${firstLesson.id}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No lessons availabale</h2>
      <p className="text-slate-500">This course has no lesson yet</p>
    </div>
  );
};

export default CourseIdPage;
