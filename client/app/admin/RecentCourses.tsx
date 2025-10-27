import { buttonVariants } from "@/components/ui/button";
import { useFetchRecentCoursesQuery } from "@/state/api/courseApi";
import Link from "next/link";
import React from "react";
import EmptyStates from "@/components/code/EmptyStates";
import CourseCard from "./courses/CourseCard";
import AdminCourseSkeleton from "@/components/code/Skeletons/AdminCourseSkeleton";

const RecentCourses = ({ user }: any) => {
  const { data: recentCourses, isLoading } = useFetchRecentCoursesQuery(
    user?.id,
    { skip: !user?.id }
  );

  console.log(recentCourses);

  const courses = recentCourses?.data ?? [];

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Courses</h2>
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ variant: "outline" })}
        >
          View all courses
        </Link>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <AdminCourseSkeleton />
      ) : // @ts-ignore
      courses.length > 0 ? (
        // Courses List
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {/* @ts-ignore */}
          {courses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        // Empty State
        <EmptyStates
          buttonText="Create new course"
          description="You dont have any, create a new one and see them here"
          title="You don't have any course yet"
          href="/admin/courses/create"
        />
      )}
    </div>
  );
};

export default RecentCourses;
