"use client";

import React, { useState } from "react";
import Container from "@/components/code/Container";
import Navbar from "@/components/code/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useFetchAllCoursesQuery } from "@/state/api/courseApi";
import AdminCourseSkeleton from "@/components/code/AdminCourseSkeleton";
import UsersCourseCard from "./UsersCourseCard";
import EmptyStates from "@/components/code/EmptyStates";
import ProtectedRoute from "@/components/code/ProtectedRoutes";

const UserCoursePage = () => {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data: courses, isLoading } = useFetchAllCoursesQuery({
    page,
    limit,
  });

  console.log(courses);

  const hasCourses = Array.isArray(courses?.data) && courses.data.length > 0;
  const pagination = courses?.pagination;

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-primary text-white">
        <Container className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Explore Courses
          </h1>
          <p className="text-base md:text-lg mt-3 text-indigo-100">
            Discover a wide range of courses designed to help you achieve your
            learning goals.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex w-full max-w-md items-center space-x-2 bg-white rounded-xl shadow-md p-2">
              <Input
                type="text"
                placeholder="Search courses..."
                className="flex-1 border-none focus-visible:ring-0 text-gray-700"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Course List */}
      <Container className="mt-10 mb-20">
        {hasCourses ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: limit }).map((_, idx) => (
                    <AdminCourseSkeleton key={idx} />
                  ))
                : // @ts-ignore
                  courses?.data?.map((course: any) => (
                    <UsersCourseCard key={course.id} course={course} />
                  ))}
            </div>
            {pagination && (
              <div className="flex items-center justify-center mt-6 space-x-2 cursor-pointer">
                <Button
                  disabled={pagination.page === 1 || isLoading}
                  variant="default"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </Button>

                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  disabled={
                    pagination.page === pagination.totalPages || isLoading
                  }
                  variant="default"
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
          // Empty State
          <EmptyStates
            title="No Courses Found"
            description=" New courses are coming soon. Check back later!"
          />
        )}
      </Container>
    </>
  );
};

export default UserCoursePage;
