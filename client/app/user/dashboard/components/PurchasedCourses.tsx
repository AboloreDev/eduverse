import EmptyStates from "@/components/code/EmptyStates";
import React from "react";
import CourseProgressCard from "./CourseprogressCard";

const PurchasedCourses = ({ enrolledCourses }: { enrolledCourses: any }) => {
  return (
    <div>
      {enrolledCourses?.data?.length === 0 ? (
        <EmptyStates
          title="No Enrolled courses yet"
          description="You haven't purchased any course"
          buttonText="Browse Courses"
          href="/user/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {enrolledCourses?.data?.map((enrollment: any) => (
            <CourseProgressCard
              course={enrollment.course}
              key={enrollment.course.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasedCourses;
