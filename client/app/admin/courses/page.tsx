"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  useDeleteSingleCourseMutation,
  useFetchAllCoursesQuery,
} from "@/state/api/courseApi";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CourseCard from "./CourseCard";

const CoursesPage = () => {
  const { data: courses, isLoading } = useFetchAllCoursesQuery();

  if (isLoading) {
    return <p>Loading courses...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create new course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.isArray(courses?.data) && courses.data.length > 0 ? (
          courses.data.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="text-gray-500">No courses found.</p>
        )}
      </div>
    </>
  );
};

export default CoursesPage;
