import React, { ReactNode } from "react";
import CourseSidebar from "../components/CourseSidebar";

const CourseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-1">
      {/* Sidebar  30 percent width*/}
      <div className="w-80 border-r shrink-0 px-4">
        <CourseSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default CourseLayout;
