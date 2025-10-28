"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/code/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useFetchAllCoursesQuery } from "@/state/api/courseApi";
import UsersCourseCard from "./UsersCourseCard";
import EmptyStates from "@/components/code/EmptyStates";
import AdminCourseSkeleton from "@/components/code/Skeletons/AdminCourseSkeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const UserCoursePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get search and page from URL
  const urlSearch = searchParams.get("search") || "";
  const urlPage = Number(searchParams.get("page")) || 1;

  const [searchValue, setSearchValue] = useState(urlSearch);
  const [page, setPage] = useState(urlPage);

  const limit = 6;

  // Fetch courses with search and pagination
  const {
    data: courses,
    isLoading,
    isFetching,
  } = useFetchAllCoursesQuery({
    search: searchValue,
    page,
    limit,
  });

  const hasCourses = Array.isArray(courses?.data) && courses.data.length > 0;
  const pagination = courses?.pagination;

  // Sync state with URL on mount and URL changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlPage = Number(searchParams.get("page")) || 1;

    setSearchValue(urlSearch);
    setPage(urlPage);
  }, [searchParams]);

  // Update URL with search params
  const updateURL = (search: string, pageNum: number) => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (pageNum > 1) params.set("page", pageNum.toString());

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  // Debounced search handler
  const debouncedSearch = useDebouncedCallback((term: string) => {
    setPage(1); // Reset to page 1 on new search
    updateURL(term, 1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setPage(1);
    updateURL("", 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL(searchValue, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="border-none focus-visible:ring-0 text-gray-700 pr-8"
                />
                {searchValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={isFetching}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchValue && (
            <p className="mt-4 text-sm text-indigo-100">
              {isFetching ? (
                "Searching..."
              ) : (
                <>
                  Found {pagination?.total || 0} result
                  {pagination?.total !== 1 ? "s" : ""} for "{searchValue}"
                </>
              )}
            </p>
          )}
        </Container>
      </section>

      {/* Course List */}
      <Container className="mt-10 mb-20">
        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, idx) => (
              <AdminCourseSkeleton key={idx} />
            ))}
          </div>
        ) : hasCourses ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* @ts-ignore */}
              {courses?.data?.map((course: any) => (
                <UsersCourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-3">
                <Button
                  disabled={pagination.page === 1 || isFetching}
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter((pageNum) => {
                      return (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 1
                      );
                    })
                    .map((pageNum, index, array) => {
                      const showEllipsis =
                        index > 0 && pageNum - array[index - 1] > 1;

                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsis && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <Button
                            variant={
                              pageNum === pagination.page
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isFetching}
                            className="min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <Button
                  disabled={
                    pagination.page === pagination.totalPages || isFetching
                  }
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyStates
            title={searchValue ? "No Courses Found" : "No Courses Available"}
            description={
              searchValue
                ? `No courses found for "${searchValue}". Try a different search term.`
                : "New courses are coming soon. Check back later!"
            }
            href="/"
          />
        )}
      </Container>
    </>
  );
};

export default UserCoursePage;
