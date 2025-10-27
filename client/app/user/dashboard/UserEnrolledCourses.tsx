"use client";

import { useGetUserProfileQuery } from "@/state/api/authApi";
import { useFetchAllCoursesQuery } from "@/state/api/courseApi";
import { useGetEnrolledCoursesQuery } from "@/state/api/paymentApi";
import React, { useState } from "react";

import PurchasedCourses from "./components/PurchasedCourses";
import AvailableCourses from "./components/AvailableCourses";

import UserSingleCourseSkeleton from "@/components/code/Skeletons/UserSingleCourseSkeleton";
import AdminCourseSkeleton from "@/components/code/Skeletons/AdminCourseSkeleton";

const UserEnrolledCourses = () => {
  const { data: user } = useGetUserProfileQuery();
  // @ts-ignore
  const userId = user?.user?.id;
  const { data: enrolledCourses, isLoading: LoadingEnrolledCourses } =
    useGetEnrolledCoursesQuery(userId, {
      // @ts-ignore
      skip: !user?.user?.id,
      refetchOnMountOrArgChange: true,
    });
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: allCourses, isLoading: allCoursesLoading } =
    useFetchAllCoursesQuery({
      page,
      limit,
    });

  if (LoadingEnrolledCourses) {
    return <UserSingleCourseSkeleton />;
  }

  if (allCoursesLoading) {
    return <AdminCourseSkeleton />;
  }
  return (
    <div>
      <PurchasedCourses enrolledCourses={enrolledCourses} />

      <AvailableCourses
        enrolledCourses={enrolledCourses}
        allCourses={allCourses}
      />
    </div>
  );
};

export default UserEnrolledCourses;
