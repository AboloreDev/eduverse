import EmptyStates from "@/components/code/EmptyStates";
import React from "react";
import UsersCourseCard from "../../courses/UsersCourseCard";

interface AvailableCoursesProps {
  enrolledCourses: any;
  allCourses: any;
}

const AvailableCourses = ({
  enrolledCourses,
  allCourses,
}: AvailableCoursesProps) => {
  return (
    <section className="mt-10">
      <div className="flex flex-col space-y-2 mb-5">
        <h1 className="text-xl md:text-3xl font-semibold">Available Courses</h1>
        <p className="text-slate-500">All available courses for purchase...</p>
      </div>
      {/* @ts-ignore */}
      {allCourses?.data?.filter(
        (course: any) =>
          !enrolledCourses?.data?.some(
            (enrollment: any) => enrollment.course.id === course.id
          )
      ).length === 0 ? (
        <EmptyStates
          title="No courses available"
          description="You have already purchased all available courses"
          buttonText="Browse courses"
          href="/user/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allCourses?.data
            // @ts-ignore
            ?.filter(
              (course: any) =>
                !enrolledCourses?.data?.some(
                  (enrollment: any) => enrollment.course.id === course.id
                )
            )
            .map((course: any) => (
              <UsersCourseCard key={course.id} course={course} />
            ))}
        </div>
      )}
    </section>
  );
};

export default AvailableCourses;
