"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useFetchAllCoursesQuery } from "@/state/api/courseApi";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import CourseCard from "./CourseCard";
import EmptyStates from "@/components/code/EmptyStates";
import AdminCourseSkeleton from "@/components/code/AdminCourseSkeleton";

const CoursesPage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: courses,
    isLoading,
    isFetching,
  } = useFetchAllCoursesQuery({
    page,
    limit,
  });

  const hasCourses = Array.isArray(courses?.data) && courses.data.length > 0;
  const pagination = courses?.pagination;

  return (
    <div className="w-full">
      {/* --- Header always visible --- */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Courses</h1>

        <Link href="/admin/courses/create" className={buttonVariants()}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create new course
        </Link>
      </div>

      {hasCourses ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading || isFetching
              ? Array.from({ length: limit }).map((_, idx) => (
                  <AdminCourseSkeleton key={idx} />
                ))
              : // @ts-ignore
                courses?.data?.map((course: any) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>

          {pagination && (
            <div className="flex items-center justify-center mt-6 space-x-2">
              <Button
                disabled={pagination.page === 1 || isFetching}
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </Button>

              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                disabled={
                  pagination.page === pagination.totalPages || isFetching
                }
                variant="outline"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, idx) => (
            <AdminCourseSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <EmptyStates
          title="No Courses Found"
          description="Create a new course to get started"
          buttonText="Create Course"
        />
      )}
    </div>
  );
};

export default CoursesPage;
