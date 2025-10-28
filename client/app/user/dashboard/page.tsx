"use client";

import UserEnrolledCourses from "./UserEnrolledCourses";

export default function DasboardPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-1 mb-6">
        <h1 className="text-xl md:text-3xl font-semibold">Enrolled Courses</h1>
        <p className="text-slate-500">All courses you have access to...</p>
      </div>

      <UserEnrolledCourses />
    </div>
  );
}
