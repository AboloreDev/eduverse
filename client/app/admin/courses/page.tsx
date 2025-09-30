"use client";

import { buttonVariants } from "@/components/ui/button";
import { useFetchAllCoursesQuery } from "@/state/api/courseApi";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const CoursesPage = () => {
  const { data: courses, isLoading } = useFetchAllCoursesQuery();

  console.log("Courses", courses);
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Courses</h1>

        <Link href={"/admin/courses/create"} className={buttonVariants()}>
          <PlusIcon className="font-bold" />
          <p>Create new course</p>
        </Link>
      </div>
    </>
  );
};

export default CoursesPage;
